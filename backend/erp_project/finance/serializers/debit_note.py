
from rest_framework import serializers
from django.db import transaction
from decimal import Decimal
from ..models.debit_note import DebitNote, DebitNoteItem, DebitNoteAttachment, DebitNoteComment, DebitNoteHistory
from masters.serializers import BranchSerializer, SupplierSerializer, ProductSerializer, UOMSerializer
from purchase.models import PurchaseOrder,PurchaseOrderItem
from purchase.serializers import PurchaseOrderSerializer
from masters.models import Product,Branch

class DebitNoteItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    delete = serializers.BooleanField(write_only=True, required=False)

    purchase_order_item = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrderItem.objects.all(),
        required=False
    )

    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
    product_name = serializers.CharField(read_only=True)
    uom = UOMSerializer(read_only=True)

    class Meta:
        model = DebitNoteItem
        fields = [
            'id', 'delete',
            'purchase_order_item', 'product', 'product_name', 'uom',
            'ordered_qty', 'returned_qty', 'return_reason',
            'unit_price', 'tax_rate', 'discount_rate', 'total'
        ]
        read_only_fields = ['product_name', 'ordered_qty', 'total']

    def validate(self, data):
        instance = getattr(self, 'instance', None)

        po_item = data.get('purchase_order_item') or getattr(instance, 'purchase_order_item', None)

        # 🔴 REQUIRED ON CREATE
        if not instance and not po_item:
            raise serializers.ValidationError({
                "purchase_order_item": "This field is required"
            })

        # ✅ SAFE QTY
        if 'returned_qty' in data:
            returned_qty = data.get('returned_qty') or 0
        elif instance:
            returned_qty = instance.returned_qty
        else:
            returned_qty = 0

        # ❌ NEGATIVE CHECK
        if returned_qty < 0:
            raise serializers.ValidationError({
                "returned_qty": "Returned quantity cannot be negative"
            })

        # ❌ EXCEED CHECK
        if po_item:
            if returned_qty > po_item.quantity:
                raise serializers.ValidationError({
                    "returned_qty": f"Cannot exceed ordered quantity ({po_item.quantity})"
                })

        return data

class DebitNoteAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DebitNoteAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class DebitNoteCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DebitNoteComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class DebitNoteHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DebitNoteHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


class DebitNoteSerializer(serializers.ModelSerializer):
    items = DebitNoteItemSerializer(many=True, read_only=True)
    attachments = DebitNoteAttachmentSerializer(many=True, read_only=True)
    comments = DebitNoteCommentSerializer(many=True, read_only=True)
    history = DebitNoteHistorySerializer(many=True, read_only=True)

    purchase_order = PurchaseOrderSerializer(read_only=True)
    supplier = SupplierSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = DebitNote
        fields = '__all__'

class DebitNoteWriteSerializer(serializers.ModelSerializer):
    items = DebitNoteItemSerializer(many=True, required=False)

    purchase_order = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrder.objects.filter(status='Submitted')
    )

    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all())

    class Meta:
        model = DebitNote
        fields = [
            'purchase_order', 'debit_note_date', 'branch', 'currency',
            'payment_terms', 'inco_terms',
            'payment_status', 'credit_limit',
            'refund_mode',
            'items'
        ]

    def validate_purchase_order(self, value):
        self.context['supplier'] = value.supplier
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])

        dbn = DebitNote.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            supplier=self.context['supplier'],
            **validated_data
        )

        for item_data in items_data:
            item_data.pop('delete', None)
            DebitNoteItem.objects.create(debit_note=dbn, **item_data)

        dbn.update_totals()  # 🔥 IMPORTANT

        return dbn

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # ✅ UPDATE MAIN FIELDS
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        # ✅ HANDLE ITEMS
        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)

                # ❌ DELETE WITHOUT ID
                if delete_flag and not item_id:
                    raise serializers.ValidationError({
                        "items": "ID is required to delete item"
                    })

                # 🔥 DELETE
                if item_id and delete_flag:
                    DebitNoteItem.objects.filter(id=item_id, debit_note=instance).delete()
                    continue

                # 🔥 UPDATE
                if item_id:
                    item = DebitNoteItem.objects.get(id=item_id, debit_note=instance)
                    serializer = DebitNoteItemSerializer(item, data=item_data, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

                # 🔥 CREATE
                else:
                    item_data.pop('delete', None)
                    DebitNoteItem.objects.create(debit_note=instance, **item_data)


        return instance
    
