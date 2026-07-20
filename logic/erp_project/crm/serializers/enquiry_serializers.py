import re

from django.db import transaction
from rest_framework import serializers

from crm.models.enquiry_models import Enquiry, EnquiryItem


class EnquiryItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    class Meta:
        model = EnquiryItem
        fields = ['id', 'delete','item_code', 'product_description', 'cost_price', 'selling_price', 'quantity', 'total_amount']
        read_only_fields = ['total_amount']

    def validate_item_code(self, value):
        if not value:
            return value

        enquiry = self.context.get('enquiry')
        if not enquiry:
            return value  # skip if no context

        if self.instance:
            if EnquiryItem.objects.filter(
                enquiry=enquiry,
                item_code=value
            ).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(
                    "Product item with this item code already exists in this enquiry."
                )
        else:
            if EnquiryItem.objects.filter(
                enquiry=enquiry,
                item_code=value
            ).exists():
                raise serializers.ValidationError(
                    "Product item with this item code already exists in this enquiry."
                )


        if value and not re.match(r'^[A-Za-z0-9\-]+$', value):
            raise serializers.ValidationError("Item Code can only contain letters, numbers and hyphens.")

        return value

    def validate_product_description(self, value):
 
        if value and not re.match(r'^[A-Za-z0-9\s.,\-]+$', value):
            raise serializers.ValidationError("Product Description can only contain letters, numbers, spaces and basic punctuation.")
        return value

    def validate(self, data):
        if data.get('selling_price', 0) <= 0:
            raise serializers.ValidationError({"selling_price": "Must be positive"})
        if data.get('quantity', 0) < 1:
            raise serializers.ValidationError({"quantity": "Must be at least 1"})
        return data


class EnquirySerializer(serializers.ModelSerializer):
    items = EnquiryItemSerializer(many=True, read_only=True)
    grand_total = serializers.SerializerMethodField()
    user = serializers.StringRelatedField()
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Enquiry
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by']

    def get_grand_total(self, obj):
        return sum(item.total_amount for item in obj.items.all())
    
    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class EnquiryWriteSerializer(serializers.ModelSerializer):
    # Make items read-only here — we handle sync manually in update/create
    items = EnquiryItemSerializer(many=True, read_only=True)

    class Meta:
        model = Enquiry
        fields = [
            'first_name', 'last_name', 'email', 'phone_number',
            'street_address', 'apartment', 'city', 'state', 'postal', 'country',
            'enquiry_type', 'enquiry_description',
            'enquiry_channel', 'social_media_platform',
            'source', 'source_social_media',
            'how_heard', 'urgency_level', 'enquiry_status', 'priority',
            'items'  # still include in fields for response
        ]

    def validate_email(self, value):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError("Invalid email format (local part contains invalid characters).")
        return value

    def validate(self, data):
        if self.instance is None:
            required = ['first_name', 'email', 'phone_number', 'enquiry_type', 'enquiry_status']
            for field in required:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"{field.replace('_', ' ').title()} is required"})

        channel = data.get('enquiry_channel')
        if channel == 'Social Media' and not data.get('social_media_platform'):
            raise serializers.ValidationError({
                'social_media_platform': 'Required when channel is Social Media'
            })

        source = data.get('source')
        if source == 'Social Media' and not data.get('source_social_media'):
            raise serializers.ValidationError({
                'source_social_media': 'Required when source is Social Media'
            })

        return data

    @transaction.atomic
    def create(self, validated_data):
        # Create main enquiry
        user = self.context['request'].user
        enquiry = Enquiry.objects.create(
            user=user,
            created_by=user,
            updated_by=user,
            **validated_data
        )

        # Items are read-only here — but frontend can send them
        # So manually create if sent
        items_data = self.initial_data.get('items', [])
        if items_data:
            item_serializer = EnquiryItemSerializer(data=items_data, many=True, context={'enquiry': enquiry})
            item_serializer.is_valid(raise_exception=True)
            item_serializer.save(enquiry=enquiry)

        return enquiry

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # Update parent
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)

                # 🚫 Skip invalid delete (no id)
                if delete_flag and not item_id:
                    continue

                # DELETE
                if item_id and delete_flag:
                    EnquiryItem.objects.filter(
                        id=item_id,
                        enquiry=instance
                    ).delete()
                    continue

                # UPDATE
                if item_id:
                    try:
                        item = EnquiryItem.objects.get(
                            id=item_id,
                            enquiry=instance
                        )
                    except EnquiryItem.DoesNotExist:
                        raise serializers.ValidationError(
                            f"Item {item_id} not found."
                        )

                    serializer = EnquiryItemSerializer(
                        item,
                        data=item_data,
                        partial=True,
                        context={'enquiry': instance}
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

                # CREATE
                else:
                    serializer = EnquiryItemSerializer(
                        data=item_data,
                        context={'enquiry': instance}
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save(enquiry=instance)

        return instance