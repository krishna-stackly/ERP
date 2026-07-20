from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from masters.models import Supplier, Product
from masters.serializers import SupplierSerializer
from purchase.models import (
    PurchaseOrder,
    PurchaseOrderItem,
    PurchaseOrderHistory,
    PurchaseOrderComment,
    PurchaseOrderAttachment,
)


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    product_name = serializers.CharField(read_only=True)
    product_id = serializers.CharField(source='product.product_id', read_only=True)
    uom = serializers.CharField(read_only=True)
    in_stock = serializers.IntegerField(read_only=True)
    insufficient_stock = serializers.IntegerField(read_only=True)
    total = serializers.DecimalField(read_only=True, max_digits=15, decimal_places=2)
    tax_amount = serializers.DecimalField(read_only=True, max_digits=12, decimal_places=2)

    class Meta:
        model = PurchaseOrderItem
        fields = [
            'id', 'delete', 'product', 'product_name', 'product_id', 'uom',
            'in_stock', 'qty_ordered', 'insufficient_stock', 'unit_price',
            'tax_rate', 'discount_rate', 'total', 'tax_amount'
        ]
        read_only_fields = [
            'id', 'product_name', 'product_id', 'uom', 'in_stock',
            'insufficient_stock', 'total', 'tax_amount'
        ]

    def validate(self, data):
        if 'qty_ordered' in data and data.get('qty_ordered') < 1:
            raise serializers.ValidationError({"qty_ordered": "Must be at least 1"})

        if 'unit_price' in data and data.get('unit_price') < 0:
            raise serializers.ValidationError({"unit_price": "Cannot be negative"})

        if 'tax_rate' in data and data.get('tax_rate') < 0:
            raise serializers.ValidationError({"tax_rate": "Cannot be negative"})

        if 'discount_rate' in data and data.get('discount_rate') < 0:
            raise serializers.ValidationError({"discount_rate": "Cannot be negative"})

        return data


class PurchaseOrderHistorySerializer(serializers.ModelSerializer):
    performed_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PurchaseOrderHistory
        fields = ['id', 'action', 'performed_by', 'timestamp', 'details']
        read_only_fields = ['id', 'timestamp', 'performed_by']


class PurchaseOrderCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PurchaseOrderComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class PurchaseOrderAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PurchaseOrderAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    history = PurchaseOrderHistorySerializer(many=True, read_only=True)
    comments = PurchaseOrderCommentSerializer(many=True, read_only=True)
    attachments = PurchaseOrderAttachmentSerializer(many=True, read_only=True)
    supplier = SupplierSerializer(read_only=True)

    created_by = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)
    updated_by = serializers.CharField(source='updated_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = PurchaseOrder
        fields = '__all__'


class PurchaseOrderWriteSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, required=False, allow_empty=True)

    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        required=True
    )
    supplier_name = serializers.CharField(read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            'po_date', 'delivery_date', 'status',
            'supplier', 'supplier_name',
            'payment_terms', 'inco_terms', 'currency',
            'notes_comments', 'global_discount', 'shipping_charges',
            'items'
        ]
        read_only_fields = [
            'PO_ID', 'subtotal', 'tax_summary',
            'total_order_value', 'rounding_adjustment', 'supplier_name'
        ]

    def validate_supplier(self, value):
        self.context['supplier_name'] = value.supplier_name
        return value

    def validate(self, data):
        if 'po_date' in data and data['po_date'] > timezone.now().date():
            raise serializers.ValidationError({"po_date": "PO date cannot be in the future"})

        if 'delivery_date' in data and data['delivery_date']:
            if data['delivery_date'] < timezone.now().date():
                raise serializers.ValidationError({"delivery_date": "Delivery date cannot be in the past"})

        if 'global_discount' in data and data['global_discount'] < 0:
            raise serializers.ValidationError({"global_discount": "Cannot be negative"})

        if 'shipping_charges' in data and data['shipping_charges'] < 0:
            raise serializers.ValidationError({"shipping_charges": "Cannot be negative"})

        items_data = data.get('items', [])
        status = data.get('status', 'Draft')
        
        if status == 'Submitted' and (not items_data or len(items_data) == 0):
            raise serializers.ValidationError({"items": "At least one line item is required for submission"})

        return data

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        validated_data['supplier_name'] = self.context['supplier_name']

        po = PurchaseOrder.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:
            item_data.pop("delete", None)
            PurchaseOrderItem.objects.create(
                purchase_order=po,
                **item_data
            )

        po.calculate_summary()
        return po

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        if 'supplier' in validated_data:
            validated_data['supplier_name'] = validated_data['supplier'].supplier_name

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)

                if delete_flag and not item_id:
                    continue

                if item_id and delete_flag:
                    PurchaseOrderItem.objects.filter(
                        id=item_id,
                        purchase_order=instance
                    ).delete()
                    continue

                if item_id is not None:
                    try:
                        item = PurchaseOrderItem.objects.get(
                            id=item_id,
                            purchase_order=instance
                        )
                    except PurchaseOrderItem.DoesNotExist:
                        raise serializers.ValidationError(
                            f"Purchase order item {item_id} not found."
                        )

                    for attr, value in item_data.items():
                        if attr != "id":
                            setattr(item, attr, value)

                    item.save()

                else:
                    item_data.pop("delete", None)

                    if not item_data.get("product"):
                        raise serializers.ValidationError("Product is required")

                    PurchaseOrderItem.objects.create(
                        purchase_order=instance,
                        **item_data
                    )

        instance.calculate_summary()
        return instance
