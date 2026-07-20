from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import serializers

from masters.models import Product, UOM, TaxCode, Customer
from masters.serializers import CustomerSerializer

from crm.models.quotation_models import (
    Quotation,
    QuotationItem,
    QuotationAttachment,
    QuotationComment,
    QuotationHistory,
    QuotationRevision,
)

User = get_user_model()


# Child Serializers
class QuotationItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id_display = serializers.CharField(source='product.product_id', read_only=True)
    uom = serializers.PrimaryKeyRelatedField(queryset=UOM.objects.all())
    tax = serializers.PrimaryKeyRelatedField(queryset=TaxCode.objects.all(), allow_null=True, required=False)

    class Meta:
        model = QuotationItem
        fields = [
            'id', 'delete', 'product', 'product_name', 'product_id_display', 'uom',
            'unit_price', 'discount', 'tax', 'tax_rate', 'quantity', 'total'
        ]
        read_only_fields = ['product_name', 'product_id_display', 'tax_rate', 'total']

    def validate_product(self, value):
        quotation = self.context.get('quotation')
        if not quotation:
            return value

        if self.instance:
            if QuotationItem.objects.filter(
                quotation=quotation,
                product=value
            ).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(
                    "This product is already added in this quotation. You cannot add it again."
                )
        else:
            if QuotationItem.objects.filter(
                quotation=quotation,
                product=value
            ).exists():
                raise serializers.ValidationError(
                    "This product is already added in this quotation. You cannot add it again."
                )

        return value

    def validate(self, data):
        if 'unit_price' in data and data['unit_price'] <= 0:
            raise serializers.ValidationError({"unit_price": "Must be positive"})

        if 'quantity' in data and data['quantity'] < 1:
            raise serializers.ValidationError({"quantity": "Must be at least 1"})

        return data


class QuotationAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuotationAttachment
        fields = ['id', 'file', 'uploaded_by', 'timestamp']


class QuotationCommentSerializer(serializers.ModelSerializer):
    comment_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuotationComment
        fields = ['id', 'comment_by', 'comment', 'timestamp']


class QuotationHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuotationHistory
        fields = ['id', 'event_type', 'status', 'extra_info', 'action_by', 'timestamp']


class QuotationRevisionSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuotationRevision
        fields = ['id', 'revision_no', 'revision_date', 'created_by', 'comment', 'status']


# Main Serializers
class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    attachments = QuotationAttachmentSerializer(many=True, read_only=True)
    comments = QuotationCommentSerializer(many=True, read_only=True)
    history = QuotationHistorySerializer(many=True, read_only=True)
    revisions = QuotationRevisionSerializer(many=True, read_only=True)

    customer = CustomerSerializer(read_only=True)
    sales_rep = serializers.StringRelatedField(read_only=True)

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    subtotal = serializers.ReadOnlyField()
    tax_summary = serializers.ReadOnlyField()
    grand_total = serializers.ReadOnlyField()

    class Meta:
        model = Quotation
        fields = '__all__'

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None

class QuotationWriteSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, required=False, allow_empty=True)

    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    sales_rep = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__role='Sales Representative'),
        allow_null=True
    )

    class Meta:
        model = Quotation
        fields = [
            'customer', 'customer_po_reference', 'sales_rep',
            'quotation_type', 'quotation_date', 'expiry_date',
            'currency', 'payment_terms', 'expected_delivery',
            'status', 'global_discount', 'shipping_charges',
            'items'  
        ]

    def validate(self, data):
        if self.instance is None:
            required = ['customer', 'quotation_type', 'quotation_date', 'status']
            for field in required:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"{field.replace('_', ' ').title()} is required"})
        return data

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        # REMOVED: comments_data = validated_data.pop('comments', [])

        quotation = Quotation.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:
            item_data.pop("delete", None)
            QuotationItem.objects.create(
                quotation=quotation,
                **item_data
            )


        return quotation

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

                # 🚫 Skip invalid delete
                if delete_flag and not item_id:
                    continue

                # -------- DELETE --------
                if item_id and delete_flag:
                    QuotationItem.objects.filter(
                        id=item_id,
                        quotation=instance
                    ).delete()
                    continue

                # -------- UPDATE --------
                if item_id:
                    try:
                        item = QuotationItem.objects.get(
                            id=item_id,
                            quotation=instance
                        )
                    except QuotationItem.DoesNotExist:
                        raise serializers.ValidationError(
                            f"Quotation item {item_id} not found."
                        )

                    for attr, value in item_data.items():
                        if attr != "id":
                            setattr(item, attr, value)

                    item.save()

                # -------- CREATE --------
                else:
                    item_data.pop("delete", None)
                    QuotationItem.objects.create(
                    quotation=instance,
                    **item_data
                )

        return instance