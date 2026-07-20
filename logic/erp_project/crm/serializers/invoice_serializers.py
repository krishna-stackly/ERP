from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from masters.models import Product, TaxCode
from masters.serializers import (
    CustomerSerializer,
    ProductSerializer,
    UOMSerializer,
)

from crm.models.invoice_models import (
    Invoice,
    InvoiceItem,
    InvoiceAttachment,
    InvoiceComment,
    InvoiceHistory,
)

from crm.models.sales_order_models import SalesOrder
from crm.serializers.sales_order_serializers import (
    SalesOrderSerializer,
)


class InvoiceItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.CharField(read_only=True)
    uom = UOMSerializer(read_only=True)
    tax_code = serializers.PrimaryKeyRelatedField(queryset=TaxCode.objects.all(), required=False)

    delete = serializers.BooleanField(write_only=True, required=False)

    class Meta:
        model = InvoiceItem
        fields = [
            'id', 'product', 'product_name', 'quantity', 'returned_qty_cus',
            'uom', 'unit_price', 'tax_code', 'tax_rate',
            'discount_rate', 'total', 'delete'
        ]
        read_only_fields = ['product_name', 'total', 'tax_rate']

    def validate(self, data):
        instance = getattr(self, 'instance', None)

        quantity = data.get('quantity') if 'quantity' in data else (
            instance.quantity if instance else None
        )

        returned = data.get('returned_qty_cus') if 'returned_qty_cus' in data else (
            instance.returned_qty_cus if instance else 0
        )

        # ✅ Quantity validation
        if 'quantity' in data:
            if quantity is None or quantity < 1:
                raise serializers.ValidationError({
                    "quantity": "Quantity must be at least 1"
                })

        # ✅ Returned qty validation
        if returned is not None and quantity is not None:
            if returned < 0 or returned > quantity:
                raise serializers.ValidationError({
                    "returned_qty_cus": "Cannot exceed quantity"
                })

        # ✅ Discount validation
        discount = data.get('discount_rate', instance.discount_rate if instance else 0)
        if discount and discount > 100:
            raise serializers.ValidationError({
                "discount_rate": "Cannot exceed 100%"
            })

        return data


class InvoiceAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = InvoiceAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class InvoiceCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = InvoiceComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class InvoiceHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = InvoiceHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    attachments = InvoiceAttachmentSerializer(many=True, read_only=True)
    comments = InvoiceCommentSerializer(many=True, read_only=True)
    history = InvoiceHistorySerializer(many=True, read_only=True)

    sales_order = SalesOrderSerializer(read_only=True)
    customer = CustomerSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    subtotal = serializers.SerializerMethodField()
    tax_summary = serializers.SerializerMethodField()
    grand_total = serializers.SerializerMethodField()
    balance_due = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = '__all__'

    def get_subtotal(self, obj):
        return sum(item.total for item in obj.items.all()) or 0

    def get_tax_summary(self, obj):
        return sum(
            (item.quantity * item.unit_price * item.tax_rate) / 100
            for item in obj.items.all()
        ) or 0

    def get_grand_total(self, obj):
        return obj.grand_total  # ✅ use model

    def get_balance_due(self, obj):
        return obj.balance_due  # ✅ use model



class InvoiceWriteSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, required=False)

    sales_order = serializers.PrimaryKeyRelatedField(
        queryset=SalesOrder.objects.filter(status__in=['Submitted', 'Partially Delivered'])
    )

    class Meta:
        model = Invoice
        fields = [
            'sales_order', 'invoice_date', 'due_date', 'customer_ref_no',
            'invoice_tags', 'terms_conditions', 'invoice_status',
            'payment_terms', 'billing_address', 'shipping_address',
            'email_id', 'phone_number', 'contact_person',
            'payment_method', 'currency', 'payment_ref_number',
            'transaction_date', 'payment_status',
            'global_discount', 'shipping_charges',
            'amount_paid', 'items'
        ]
        read_only_fields = ['invoice_id']

    def validate_invoice_tags(self, value):
        if isinstance(value, list):
            return ','.join(value)
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', []) or []

        # ✅ SAFE CUSTOMER SET
        sales_order = validated_data.get('sales_order')
        validated_data['customer'] = sales_order.customer

        invoice = Invoice.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:
            item_data.pop('delete', None)  # 🔥 IMPORTANT
            InvoiceItem.objects.create(invoice=invoice, **item_data)

        return invoice

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # Update main fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        # =========================
        # HANDLE ITEMS
        # =========================
        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)

                # DELETE
                if item_id and delete_flag:
                    InvoiceItem.objects.filter(
                        id=item_id,
                        invoice=instance
                    ).delete()
                    continue

                # UPDATE
                if item_id:
                    item = InvoiceItem.objects.get(id=item_id, invoice=instance)
                    for attr, value in item_data.items():
                        setattr(item, attr, value)
                    item.save()

                # CREATE
                else:
                    InvoiceItem.objects.create(
                        invoice=instance,
                        **item_data
                    )

        return instance