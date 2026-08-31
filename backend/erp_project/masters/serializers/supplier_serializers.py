import re

from rest_framework import serializers

from masters.models.supplier_models import (
    Supplier,
    SupplierAttachment,
    SupplierComment,
    SupplierHistory,
)


class SupplierSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Supplier
        fields = "__all__"
        read_only_fields = [
            'supplier_id',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class SupplierCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            'tax_id',
            'supplier_name',
            'company_registration_number',
            'legal_entity_name',
            'country_of_registration',
            'supplier_type',
            'is_custom_supplier_type',
            'custom_supplier_type',
            'supplier_tier',
            'status',
            'workflow_status',
            'product_details',
            'primary_contact_first_name',
            'primary_contact_last_name',
            'primary_contact_designation',
            'primary_contact_email',
            'primary_contact_phone',
            'alternate_contact_number',
            'website',
            'relationship_manager',
            'registered_address',
            'mailing_address',
            'warehouse_address',
            'billing_address',
            'region',
            'bank_name',
            'bank_account_no',
            'iban_swift',
            'payment_method',
            'payment_terms',
            'is_custom_payment_terms',
            'custom_payment_terms',
            'currency',
            'tax_withholding_setup',
            'categories_served',
            'incoterms',
            'product_catalog',
            'freight_terms',
            'min_order_quantity',
            'return_replacement_policy',
            'avg_lead_time_days',
            'contract_references',
            'certifications',
            'compliance_status',
            'insurance_documents',
            'mitigation_plans',
            'risk_rating',
            'risk_notes',
            'last_risk_assessment',
            'on_time_delivery_rate',
            'quality_rating',
            'defect_return_rate',
            'last_evaluation_date',
            'contract_breaches',
            'improvement_plans',
            'complaints_registered',
            'external_key_contact',
            'interaction_logs',
            'dispute_resolutions',
            'feedback_surveys',
            'visit_mom_history',
        ]

    def validate_supplier_name(self, value):
        if not re.match(r'^[A-Za-z0-9\s&.,-]+$', value):
            raise serializers.ValidationError(
                "Supplier name can only contain letters, numbers, spaces & basic punctuation."
            )

        return value

    def validate_primary_contact_first_name(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError(
                "First name can only contain letters and spaces."
            )

        return value

    def validate_primary_contact_phone(self, value):
        cleaned = (
            value.replace("+", "")
            .replace(" ", "")
            .replace("-", "")
        )

        if (
            not cleaned.isdigit()
            or len(cleaned) != 10
            or cleaned.startswith('0')
        ):
            raise serializers.ValidationError(
                "Phone must be exactly 10 digits and cannot start with 0."
            )

        return value

    def validate_last_risk_assessment(self, value):
        if value and value.year < 1900:
            raise serializers.ValidationError(
                "Last Risk Assessment Date cannot be before year 1900."
            )

        return value

    def validate_last_evaluation_date(self, value):
        if value and value.year < 1900:
            raise serializers.ValidationError(
                "Last Evaluation Date cannot be before year 1900."
            )

        return value

    def validate(self, data):
        if self.instance is None:
            required = [
                'tax_id',
                'supplier_name',
                'legal_entity_name',
                'country_of_registration',
                'primary_contact_first_name',
                'primary_contact_email',
                'primary_contact_phone',
                'registered_address',
            ]

            for field in required:
                if not data.get(field):
                    raise serializers.ValidationError({
                        field:
                        f"{field.replace('_', ' ').title()} is required"
                    })

        custom_pairs = [
            ('supplier_type', 'custom_supplier_type'),
            ('payment_terms', 'custom_payment_terms'),
        ]

        for normal, custom in custom_pairs:
            if f'is_custom_{normal}' in data:
                is_custom = data[f'is_custom_{normal}']
                custom_value = data.get(f'custom_{normal}', '')
                normal_value = data.get(normal)

                if is_custom and not custom_value:
                    raise serializers.ValidationError({
                        f'custom_{normal}':
                        f"Custom {normal.replace('_', ' ').title()} is required when custom is selected"
                    })

                if not is_custom and normal in data and not normal_value:
                    raise serializers.ValidationError({
                        normal:
                        f"{normal.replace('_', ' ').title()} is required"
                    })

        if self.instance:
            old_workflow = self.instance.workflow_status
            new_workflow = data.get(
                'workflow_status',
                old_workflow
            )

            if old_workflow == 'Draft' and new_workflow not in [
                'Draft',
                'Submitted'
            ]:
                raise serializers.ValidationError({
                    "workflow_status":
                    "Draft can only be saved as Draft or Submitted"
                })

            if old_workflow == 'Submitted' and new_workflow == 'Draft':
                raise serializers.ValidationError({
                    "workflow_status":
                    "Cannot revert to Draft after submission"
                })

        if (
            'avg_lead_time_days' in data
            and data['avg_lead_time_days'] <= 0
        ):
            raise serializers.ValidationError({
                "avg_lead_time_days": "Must be positive"
            })

        if (
            'on_time_delivery_rate' in data
            and data['on_time_delivery_rate'] > 100
        ):
            raise serializers.ValidationError({
                "on_time_delivery_rate": "Cannot exceed 100%"
            })

        if (
            'quality_rating' in data
            and data['quality_rating'] > 5
        ):
            raise serializers.ValidationError({
                "quality_rating": "Cannot exceed 5.0"
            })

        if (
            'defect_return_rate' in data
            and data['defect_return_rate'] > 100
        ):
            raise serializers.ValidationError({
                "defect_return_rate": "Cannot exceed 100%"
            })

        if (
            'min_order_quantity' in data
            and data['min_order_quantity'] <= 0
        ):
            raise serializers.ValidationError({
                "min_order_quantity": "Must be positive"
            })

        return data

    def create(self, validated_data):
        return Supplier.objects.create(
            **validated_data,
            created_by=self.context['request'].user
        )

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        return instance


class SupplierCommentSerializer(serializers.ModelSerializer):
    commented_by = serializers.SerializerMethodField()

    class Meta:
        model = SupplierComment
        fields = "__all__"
        read_only_fields = [
            'commented_by',
            'timestamp',
        ]

    def get_commented_by(self, obj):
        return obj.commented_by.get_full_name() if obj.commented_by else None


class SupplierAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.SerializerMethodField()

    class Meta:
        model = SupplierAttachment
        fields = "__all__"
        read_only_fields = [
            'uploaded_by',
            'uploaded_at',
        ]

    def get_uploaded_by(self, obj):
        return obj.uploaded_by.get_full_name() if obj.uploaded_by else None


class SupplierHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.SerializerMethodField()

    class Meta:
        model = SupplierHistory
        fields = "__all__"
        read_only_fields = [
            'changed_by',
            'changed_at',
        ]

    def get_changed_by(self, obj):
        return obj.changed_by.get_full_name() if obj.changed_by else None
