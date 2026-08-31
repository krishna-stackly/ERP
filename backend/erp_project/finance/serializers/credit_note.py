from rest_framework import serializers
from ..models.credit_note import CreditNote, CreditNoteItem, CreditNoteAttachment,CreditNoteHistory,CreditNoteComment, InvoiceItem
from masters.models import Product,Branch
from crm.models import Invoice
from masters.serializers import UOMSerializer,BranchSerializer,SupplierSerializer
from crm.serializers import CustomerSerializer, ProductSerializer, InvoiceSerializer
from purchase.serializers import PurchaseOrderSerializer
from django.conf import settings
from django.db import transaction

class CreditNoteItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    delete = serializers.BooleanField(write_only=True, required=False)

    invoice_item = serializers.PrimaryKeyRelatedField(
        queryset=InvoiceItem.objects.all(),
        required=False
    )

    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        required=False
    )

    product_name = serializers.CharField(read_only=True)
    uom = UOMSerializer(read_only=True)

    class Meta:
        model = CreditNoteItem
        fields = [
            'id', 'delete',
            'invoice_item', 'product', 'product_name', 'uom',
            'invoiced_qty', 'returned_qty', 'return_reason',
            'unit_price', 'tax_rate', 'discount_rate', 'total'
        ]
        read_only_fields = ['product_name', 'invoiced_qty', 'total']

    def validate(self, data):
        instance = getattr(self, 'instance', None)

        invoice_item = data.get('invoice_item') or getattr(instance, 'invoice_item', None)

        # ✅ Safe qty handling (PATCH safe)
        if 'returned_qty' in data:
            returned_qty = data.get('returned_qty') or 0
        elif instance:
            returned_qty = instance.returned_qty
        else:
            returned_qty = 0

        # ✅ Validate only if invoice_item exists
        if invoice_item:
            if returned_qty > invoice_item.quantity:
                raise serializers.ValidationError({
                    "returned_qty": f"Cannot exceed invoiced quantity ({invoice_item.quantity})"
                })

        return data


class CreditNoteAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = CreditNoteAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class CreditNoteCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = CreditNoteComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class CreditNoteHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = CreditNoteHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


class CreditNoteSerializer(serializers.ModelSerializer):
    items = CreditNoteItemSerializer(many=True, read_only=True)
    attachments = CreditNoteAttachmentSerializer(many=True, read_only=True)
    comments = CreditNoteCommentSerializer(many=True, read_only=True)
    history = CreditNoteHistorySerializer(many=True, read_only=True)

    invoice = InvoiceSerializer(read_only=True)
    customer = CustomerSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = CreditNote
        fields = '__all__'  

from django.contrib.auth import get_user_model

User = get_user_model()

class CreditNoteWriteSerializer(serializers.ModelSerializer):
    items = CreditNoteItemSerializer(many=True, required=False)

    invoice = serializers.PrimaryKeyRelatedField(
        queryset=Invoice.objects.filter(invoice_status__in=['Sent', 'Paid'])
    )

    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())

    class Meta:
        model = CreditNote
        fields = [
            'invoice', 'credit_note_date', 'branch', 'currency',
            'billing_address', 'phone_number',
            'invoice_date', 'due_date',
            'payment_terms', 'invoice_status', 'payment_status',
            'refund_mode',  
            'items'
        ]

    def validate_invoice(self, value):
        self.context['customer'] = value.customer
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])

        crn = CreditNote.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            customer=self.context['customer'],
            **validated_data
        )

        for item_data in items_data:
            item_data.pop('delete', None)
            CreditNoteItem.objects.create(credit_note=crn, **item_data)

        # 🔥 UPDATE TOTALS
        crn.update_totals()

        return crn

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # ✅ Update main fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        # ✅ Handle items
        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)

                # 🔥 DELETE
                if item_id and delete_flag:
                    CreditNoteItem.objects.filter(id=item_id, credit_note=instance).delete()
                    continue

                # 🔥 UPDATE
                if item_id:
                    item = CreditNoteItem.objects.get(id=item_id, credit_note=instance)
                    serializer = CreditNoteItemSerializer(item, data=item_data, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

                # 🔥 CREATE
                else:
                    CreditNoteItem.objects.create(credit_note=instance, **item_data)

        # 🔥 UPDATE TOTALS AFTER PATCH
        instance.update_totals()

        return instance