import re

from rest_framework import serializers

from masters.models.customer_models import Customer
from masters.models.user_models import CustomUser


class CustomerSerializer(serializers.ModelSerializer):
    assigned_sales_rep = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(
            role__role="Sales Representative"
        ),
        allow_null=True,
        required=False
    )

    customer_id = serializers.CharField(
        required=False,
        allow_blank=True
    )

    available_limit = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        allow_null=True
    )

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    assigned_sales_rep_detail = serializers.StringRelatedField(
        source='assigned_sales_rep',
        read_only=True
    )

    class Meta:
        model = Customer
        fields = [
            'id',
            'first_name',
            'last_name',
            'customer_type',
            'customer_id',
            'status',
            'assigned_sales_rep',
            'assigned_sales_rep_detail',
            'email',
            'phone_number',
            'address',
            'street',
            'city',
            'state',
            'zip_code',
            'country',
            'company_name',
            'industry',
            'location',
            'gst_tax_id',
            'credit_limit',
            'available_limit',
            'billing_address',
            'shipping_address',
            'payment_terms',
            'credit_term',
            'last_edit_date',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

        read_only_fields = [
            'id',
            'customer_id',
            'last_edit_date',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
            'assigned_sales_rep_detail',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None

    def validate(self, data):
        phone = str(data.get('phone_number', '')).strip()

        if phone and (
            len(phone) != 10
            or not phone.isdigit()
            or phone.startswith('0')
        ):
            raise serializers.ValidationError({
                "phone_number":
                "Phone must be exactly 10 digits and cannot start with 0."
            })

        for field in [
            'first_name',
            'last_name',
            'company_name',
            'city',
            'state',
            'location'
        ]:
            value = str(data.get(field, '')).strip()

            if value and not re.match(r'^[a-zA-Z\s]+$', value):
                raise serializers.ValidationError({
                    field:
                    f"{field.replace('_', ' ').title()} can only contain letters and spaces."
                })

        if data.get('credit_limit', 0) < 0:
            raise serializers.ValidationError({
                "credit_limit": "Credit limit cannot be negative."
            })

        if self.instance is None:
            required = [
                'first_name',
                'email',
                'phone_number',
                'customer_type',
                'status',
            ]

            for field in required:
                if field not in data or not data[field]:
                    raise serializers.ValidationError({
                        field:
                        f"{field.replace('_', ' ').title()} is required"
                    })

        if 'email' in data:
            if self.instance and self.instance.email == data['email']:
                pass
            elif Customer.objects.filter(email=data['email']).exists():
                raise serializers.ValidationError({
                    "email": "A customer with this email already exists."
                })

        return data

    def create(self, validated_data):
        if not validated_data.get('customer_id'):
            last_customer = Customer.objects.order_by('-id').first()

            if last_customer and last_customer.customer_id:
                last_id = int(
                    last_customer.customer_id.replace('CUST-', '')
                ) + 1
            else:
                last_id = 1

            validated_data['customer_id'] = f'CUST-{last_id:04d}'

        if (
            'available_limit' not in validated_data
            or validated_data['available_limit'] is None
        ):
            validated_data['available_limit'] = validated_data.get(
                'credit_limit',
                0.00
            )

        customer = super().create(validated_data)

        customer.created_by = self.context['request'].user
        customer.save()

        return customer

    def update(self, instance, validated_data):
        if (
            'credit_limit' in validated_data
            and (
                'available_limit' not in validated_data
                or validated_data.get('available_limit') is None
            )
        ):
            validated_data['available_limit'] = validated_data['credit_limit']

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        return instance
