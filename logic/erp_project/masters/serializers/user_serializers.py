from django.db import transaction
from django.utils.crypto import get_random_string
from rest_framework import serializers
from ..models.department_roles_models import Branch, Department, Role
from ..serializers.department_roles_serializers import BranchSerializer, DepartmentListSerializer, RoleReadSerializer
from ..models.user_models import CustomUser
import re


class CustomUserDetailSerializer(serializers.ModelSerializer):
    branch            = BranchSerializer(read_only=True)
    department        = DepartmentListSerializer(read_only=True)
    role              = RoleReadSerializer(read_only=True)
    available_branches = BranchSerializer(many=True, read_only=True)
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()
    reporting_to= serializers.StringRelatedField(read_only=True)  # Shows __str__ (email) — or change to get_full_name if you have it

    class Meta:
        model = CustomUser
        fields = [
            'id', 'first_name', 'last_name', 'email', 'contact_number',
            'branch', 'department', 'role', 'available_branches',
            'reporting_to', 'employee_id', 'profile_pic','created_by', 'updated_by'
        ]
    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None



def validate_name(value, field_name="Field"):
    if not re.match(r'^[A-Za-z\s]+$', value.strip()):
        raise serializers.ValidationError(f"{field_name} can contain only letters and spaces.")
    return value.strip()

class CustomUserCreateSerializer(serializers.ModelSerializer):
    available_branches = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(),
        many=True,
        required=False
    )
    reporting_to = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        required=False,
        allow_null=True
    )
    branch = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(),
        required=False,
        allow_null=True
    )
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        required=False,
        allow_null=True
    )
    role = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'email', 'contact_number',
            'branch', 'department', 'role',
            'reporting_to', 'available_branches',
            'employee_id', 'profile_pic'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'last_name': {'required': False, 'allow_blank': True},
        }

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_employee_id(self, value):
        if value and CustomUser.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID must be unique.")
        return value

    def validate_first_name(self, value):
        return validate_name(value, "First Name")          

    def validate_last_name(self, value):
        if value:
            return validate_name(value, "Last Name")
        return value

    def validate_contact_number(self, value):              
        if value:
            cleaned = value.replace("+", "").replace("-", "").replace(" ", "")
            if not cleaned.isdigit() or len(cleaned) < 9:
                raise serializers.ValidationError("Contact number must be 9-15 digits only.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        # Pop all special fields
        branches = validated_data.pop('available_branches', [])
        reporting_to = validated_data.pop('reporting_to', None)
        branch = validated_data.pop('branch', None)
        department = validated_data.pop('department', None)
        role = validated_data.pop('role', None)

        # Generate password if not provided
        password = validated_data.pop('password', None)
        if not password:
            password = get_random_string(length=8, allowed_chars='abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*')

        # Create user with password (this hashes it automatically)
        user = CustomUser.objects.create_user(
            email=validated_data.pop('email'),
            password=password,  # ← passed here — hashed in manager
            **validated_data
        )

        # Explicitly set FKs (safety net)
        user.created_by = self.context['request'].user
        user.updated_by = self.context['request'].user
        user.branch = branch
        user.department = department
        user.role = role
        user.reporting_to = reporting_to
        user.save()

        # Set M2M
        if branches:
            user.available_branches.set(branches)

        # Return user (for email in view)
        return user

class CustomUserUpdateSerializer(serializers.ModelSerializer):
    available_branches = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(),
        many=True,
        required=False
    )

    reporting_to = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'email', 'contact_number',
            'branch', 'department', 'role',
            'reporting_to', 'available_branches',
            'employee_id', 'profile_pic'
        ]
        extra_kwargs = {
            'email': {'required': False},
            'first_name': {'required': False},
        }

    def validate_role(self, value):
        if self.instance and self.instance.role:
            if self.instance.role.role.lower() == 'admin':
                if value and value.role.lower() != 'admin':
                    # Only Django superuser can downgrade an Admin
                    if not self.context['request'].user.is_superuser:
                        raise serializers.ValidationError(
                            "Cannot remove 'Admin' role unless you are a Django superuser."
                        )
        return value

    def validate_email(self, value):
        if self.instance and self.instance.email == value:
            return value
        if CustomUser.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_employee_id(self, value):
        if value and self.instance and self.instance.employee_id == value:
            return value
        if value and CustomUser.objects.filter(employee_id=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("Employee ID must be unique.")
        return value
    
    def validate_first_name(self, value):
        return validate_name(value, "First Name")

    def validate_last_name(self, value):
        if value:
            return validate_name(value, "Last Name")
        return value

    def validate_contact_number(self, value):
        if value:
            cleaned = value.replace("+", "").replace("-", "").replace(" ", "")
            if not cleaned.isdigit() or len(cleaned) < 9:
                raise serializers.ValidationError("Contact number must be 9-15 digits only.")
        return value

    @transaction.atomic
    def update(self, instance, validated_data):
        branches = validated_data.pop('available_branches', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.updated_by = self.context['request'].user
        instance.save()

        if branches is not None:
            instance.available_branches.set(branches)

        return instance

  #Test  