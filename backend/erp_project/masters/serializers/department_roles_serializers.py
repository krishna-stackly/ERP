from django.db import transaction
from django.utils.crypto import get_random_string
from rest_framework import serializers

from masters.models.user_models import (
    CustomUser,
    Branch,
    Department,
    Role,
)

from masters.serializers.validation_helpers import (
    validate_letters_space,
    validate_alphanumeric,
    validate_alphanumeric_space,
    validate_description,
    validate_permissions,
    validate_name,
)


class BranchSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Branch
        fields = [
            'id',
            'name',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def validate_name(self, value):
        qs = Branch.objects.filter(name__iexact=value)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "Branch with this name already exists."
            )

        return value

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class DepartmentDropdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'department_name']


class DepartmentBaseSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = Department
        fields = [
            'id',
            'code',
            'department_name',
            'description',
            'branch',
        ]


class RoleReadSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(
        source='department.department_name',
        read_only=True
    )

    branch_name = serializers.CharField(
        source='branch.name',
        read_only=True
    )

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = [
            'id',
            'role',
            'description',
            'permissions',
            'department_name',
            'branch_name',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class NestedRoleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = Role
        fields = [
            'id',
            'role',
            'description',
            'permissions',
            'delete',
        ]

    def validate_role(self, value):
        return validate_alphanumeric_space(value, "Role name")

    def validate_description(self, value):
        return validate_description(value)

    def validate_permissions(self, value):
        return validate_permissions(value)


class DepartmentCreateWithRolesSerializer(serializers.ModelSerializer):
    branch = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all()
    )

    roles = NestedRoleSerializer(
        many=True,
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Department
        fields = [
            'code',
            'department_name',
            'description',
            'branch',
            'roles',
        ]

    def validate_department_name(self, value):
        return validate_letters_space(value, "Department name")

    def validate_code(self, value):
        return validate_alphanumeric(value, "Department code")

    def validate_description(self, value):
        return validate_description(value)

    @transaction.atomic
    def create(self, validated_data):
        roles_data = validated_data.pop('roles', [])

        department = Department.objects.create(
            **validated_data,
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user
        )

        for role_data in roles_data:
            role_data.pop('id', None)
            role_data.pop('delete', None)

            Role.objects.create(
                department=department,
                branch=department.branch,
                created_by=self.context['request'].user,
                updated_by=self.context['request'].user,
                **role_data
            )

        return department


class DepartmentUpdateWithRolesSerializer(serializers.ModelSerializer):
    branch = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(),
        required=False
    )

    roles = NestedRoleSerializer(
        many=True,
        required=False,
        allow_empty=True
    )

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            'id',
            'code',
            'department_name',
            'description',
            'branch',
            'is_active',
            'created_at',
            'updated_at',
            'roles',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def validate_department_name(self, value):
        return validate_letters_space(value, "Department name")

    def validate_code(self, value):
        return validate_alphanumeric(value, "Department code")

    def validate_description(self, value):
        return validate_description(value)

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None

    @transaction.atomic
    def update(self, instance, validated_data):
        roles_data = validated_data.pop('roles', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        if roles_data is not None:
            for role_data in roles_data:
                role_id = role_data.pop('id', None)
                delete_flag = role_data.pop('delete', False)

                if role_id and delete_flag:
                    Role.objects.filter(
                        id=role_id,
                        department=instance
                    ).delete()
                    continue

                if role_id:
                    try:
                        role = Role.objects.get(
                            id=role_id,
                            department=instance
                        )
                    except Role.DoesNotExist:
                        raise serializers.ValidationError(
                            f"Role {role_id} not found in this department."
                        )

                    for key, value in role_data.items():
                        setattr(role, key, value)

                    role.updated_by = self.context['request'].user
                    role.save()

                else:
                    Role.objects.create(
                        department=instance,
                        branch=instance.branch,
                        created_by=self.context['request'].user,
                        updated_by=self.context['request'].user,
                        **role_data
                    )

        return instance



#Read Serializers
class DepartmentListSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)
    roles  = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'code', 'department_name', 'description', 'branch', 'roles', 'created_by' , 'updated_by' ]

    def get_roles(self, obj):
        if self.context.get('include_roles', True):
            return RoleReadSerializer(obj.roles.all(), many=True).data
        return []
    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class DepartmentDetailSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)
    roles  = RoleReadSerializer(many=True, read_only=True)
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'code', 'department_name', 'description', 'branch', 'roles', 'created_by' , 'updated_by' ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None