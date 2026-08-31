from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from masters.models import Supplier, Product
from masters.serializers import SupplierSerializer
from ..models.stock_receipt import (
    StockReceipt, StockReceiptItem, SerialNumber, BatchNumber, BatchSerialNumber,
    StockReceiptComment, StockReceiptHistory, StockReceiptAttachment
)
from masters.models import Warehouse
from purchase.models import PurchaseOrder


class SerialNumberSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    class Meta:
        model = SerialNumber
        fields = ['id', 'delete', 'serial_no']

    def validate(self, data):
        if data.get('delete'):
            return data
        if not data.get('serial_no'):
            raise serializers.ValidationError({"serial_no": "This field is required."})
        return data


class BatchSerialNumberSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    class Meta:
        model = BatchSerialNumber
        fields = ['id', 'delete', 'serial_no']

    def validate(self, data):
        if data.get('delete'):
            return data
        if not data.get('serial_no'):
            raise serializers.ValidationError({"serial_no": "This field is required."})
        return data


class BatchNumberSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)
    
    serial_numbers = BatchSerialNumberSerializer(many=True, required=False)

    class Meta:
        model = BatchNumber
        fields = ['id', 'delete', 'batch_no', 'batch_qty', 'mfg_date', 'expiry_date', 'serial_numbers']

    def validate(self, data):
        # 🔥 Skip validation if deleting
        if data.get('delete'):
            return data

        # 🔥 Skip validation if only nested serial operations (PATCH case)
        if data.get('id') and not any(
            key in data for key in ['batch_no', 'batch_qty']
        ):
            return data

        # ✅ Normal validation (create / actual update)
        if not data.get('batch_no') or not data.get('batch_qty'):
            raise serializers.ValidationError({
                "batch_no": "Batch number and quantity are required."
            })

        return data

    def create(self, validated_data):
        stock_receipt_item = self.context.get('stock_receipt_item')
        if not stock_receipt_item:
            raise serializers.ValidationError("stock_receipt_item context is required")

        validated_data.pop('delete', None)
        validated_data.pop('serial_numbers', None)   # handled separately

        return BatchNumber.objects.create(
            stock_receipt_item=stock_receipt_item, 
            **validated_data
        )

# ────────────────────────────────────────────────
# Stock Receipt Item Serializer
# ────────────────────────────────────────────────
class StockReceiptItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
    warehouse = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), required=False, allow_null=True
    )

    # Now using the extended serializers (still same name)
    serial_numbers = SerialNumberSerializer(many=True, required=False)
    batch_numbers = BatchNumberSerializer(many=True, required=False)

    product_name = serializers.CharField(read_only=True)
    product_id = serializers.CharField(source='product.product_id', read_only=True)
    uom = serializers.CharField(read_only=True)

    class Meta:
        model = StockReceiptItem
        fields = [
            'id', 'delete', 'product', 'product_name', 'product_id', 'uom',
            'qty_ordered', 'qty_received', 'accepted_qty', 'rejected_qty', 'qty_returned',
            'stock_dim', 'warehouse', 'unit_price', 'tax_rate', 'discount_rate', 'total',
            'serial_numbers', 'batch_numbers'
        ]
        read_only_fields = [
            'product_name', 'product_id', 'uom', 
            'rejected_qty', 'qty_returned', 'total'
        ]

    def validate(self, data):
        if data.get("delete"):
            return data

        if data.get('qty_received', 0) < 0:
            raise serializers.ValidationError({"qty_received": "Cannot be negative"})

        if data.get('accepted_qty') is not None and data.get('qty_received') is not None:
            if data.get('accepted_qty') > data.get('qty_received'):
                raise serializers.ValidationError({"accepted_qty": "Cannot exceed received quantity"})

        return data


# ────────────────────────────────────────────────
# Other Serializers (Unchanged)
# ────────────────────────────────────────────────
class StockReceiptCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = StockReceiptComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class StockReceiptHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = StockReceiptHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


class StockReceiptAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = StockReceiptAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']


class StockReceiptSerializer(serializers.ModelSerializer):
    items = StockReceiptItemSerializer(many=True, read_only=True)
    comments = StockReceiptCommentSerializer(many=True, read_only=True)
    history = StockReceiptHistorySerializer(many=True, read_only=True)
    attachments = StockReceiptAttachmentSerializer(many=True, read_only=True)
    supplier = SupplierSerializer(read_only=True)
    po_reference = serializers.StringRelatedField(read_only=True)

    created_by = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)
    updated_by = serializers.CharField(source='updated_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = StockReceipt
        fields = '__all__'


# ────────────────────────────────────────────────
# StockReceiptWriteSerializer 
# ────────────────────────────────────────────────
class StockReceiptWriteSerializer(serializers.ModelSerializer):
    items = StockReceiptItemSerializer(many=True, required=False, allow_empty=True)

    po_reference = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrder.objects.filter(status='Submitted'),
        required=True
    )
    supplier = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = StockReceipt
        fields = [
            'received_date', 'po_reference', 'supplier',
            'supplier_dn_no', 'supplier_invoice_no',
            'received_by', 'qc_done_by', 'status',
            'items'
        ]
        read_only_fields = ['GRN_ID', 'supplier']

    def validate_po_reference(self, value):
        if value.status != 'Submitted':
            raise serializers.ValidationError("Only Submitted Purchase Orders can be received.")
        self.context['supplier'] = value.supplier
        return value

    def validate(self, data):
        if 'received_date' in data and data['received_date'] > timezone.now().date():
            raise serializers.ValidationError({"received_date": "Received date cannot be in the future"})

        return data

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        validated_data['supplier'] = validated_data['po_reference'].supplier

        receipt = StockReceipt.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:
            item_data.pop("delete", None)

            po_item = receipt.po_reference.items.filter(product=item_data.get('product')).first()
            if not po_item:
                raise serializers.ValidationError(
                    f"Product {item_data.get('product')} not found in Purchase Order"
                )

            item_data['qty_ordered'] = po_item.qty_ordered

            # Extract nested data
            serials_data = item_data.pop('serial_numbers', None)
            batches_data = item_data.pop('batch_numbers', None)

            item = StockReceiptItem.objects.create(stock_receipt=receipt, **item_data)

            # Handle nested objects
            self._handle_nested_serials_and_batches(item, {
                'serial_numbers': serials_data or [],
                'batch_numbers': batches_data or []
            })

        return receipt

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # Update main StockReceipt
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
                    StockReceiptItem.objects.filter(id=item_id, stock_receipt=instance).delete()
                    continue

                # Extract nested data
                serials_data = item_data.pop('serial_numbers', None)
                batches_data = item_data.pop('batch_numbers', None)

                if item_id:
                    # UPDATE item
                    try:
                        item = StockReceiptItem.objects.get(id=item_id, stock_receipt=instance)
                    except StockReceiptItem.DoesNotExist:
                        raise serializers.ValidationError(f"Stock receipt item {item_id} not found.")

                    for attr, value in item_data.items():
                        if attr not in ['id', 'delete']:
                            setattr(item, attr, value)
                    item.save()
                else:
                    # CREATE new item
                    item_data.pop("delete", None)
                    item = StockReceiptItem.objects.create(stock_receipt=instance, **item_data)

                # Handle nested serials & batches
                self._handle_nested_serials_and_batches(item, {
                    'serial_numbers': serials_data or [],
                    'batch_numbers': batches_data or []
                })

        return instance

    def _handle_nested_serials_and_batches(self, stock_receipt_item, nested_data):
        """Handle create, update, delete for all nested levels"""

        # ─────────────────────────────────────────────
        # 1. Direct Serial Numbers (on StockReceiptItem)
        # ─────────────────────────────────────────────
        serials_data = nested_data.get('serial_numbers')

        if serials_data:
            for s_data in serials_data:
                s_id = s_data.get('id')
                s_delete = s_data.get('delete', False)

                # DELETE serial
                if s_delete and s_id:
                    SerialNumber.objects.filter(
                        id=s_id,
                        stock_receipt_item=stock_receipt_item
                    ).delete()
                    continue

                # CREATE serial
                if not s_delete and not s_id and s_data.get('serial_no'):
                    SerialNumber.objects.create(
                        stock_receipt_item=stock_receipt_item,
                        serial_no=s_data['serial_no']
                    )

        # ─────────────────────────────────────────────
        # 2. Batch Numbers + Batch Serial Numbers
        # ─────────────────────────────────────────────
        batches_data = nested_data.get('batch_numbers')

        if batches_data:
            for b_data in batches_data:
                b_id = b_data.get('id')
                b_delete = b_data.get('delete', False)

                # DELETE batch
                if b_delete and b_id:
                    BatchNumber.objects.filter(
                        id=b_id,
                        stock_receipt_item=stock_receipt_item
                    ).delete()
                    continue

                # ─────────────────────────────
                # CREATE new batch
                # ─────────────────────────────
                if not b_delete and not b_id:
                    batch_serials = b_data.pop('serial_numbers', [])

                    serializer = BatchNumberSerializer(
                        data=b_data,
                        context={'stock_receipt_item': stock_receipt_item}
                    )
                    serializer.is_valid(raise_exception=True)
                    batch = serializer.save()

                    # CREATE serials inside new batch
                    for bs_data in batch_serials:
                        bs_id = bs_data.get('id')
                        bs_delete = bs_data.get('delete', False)

                        if bs_delete and bs_id:
                            continue

                        if not bs_delete and not bs_id and bs_data.get('serial_no'):
                            BatchSerialNumber.objects.create(
                                batch_number=batch,
                                serial_no=bs_data['serial_no']
                            )

                # ─────────────────────────────
                # UPDATE existing batch
                # ─────────────────────────────
                if b_id and not b_delete:
                    try:
                        batch = BatchNumber.objects.get(
                            id=b_id,
                            stock_receipt_item=stock_receipt_item
                        )
                    except BatchNumber.DoesNotExist:
                        continue

                    # UPDATE batch fields (only if provided)
                    for attr, value in b_data.items():
                        if attr not in ['id', 'delete', 'serial_numbers']:
                            setattr(batch, attr, value)
                    batch.save()

                    # HANDLE serials inside existing batch
                    batch_serials = b_data.get('serial_numbers', [])

                    for bs_data in batch_serials:
                        bs_id = bs_data.get('id')
                        bs_delete = bs_data.get('delete', False)

                        # DELETE serial inside batch
                        if bs_delete and bs_id:
                            BatchSerialNumber.objects.filter(
                                id=bs_id,
                                batch_number=batch
                            ).delete()
                            continue

                        # CREATE new serial inside batch
                        if not bs_delete and not bs_id and bs_data.get('serial_no'):
                            BatchSerialNumber.objects.create(
                                batch_number=batch,
                                serial_no=bs_data['serial_no']
                            )

