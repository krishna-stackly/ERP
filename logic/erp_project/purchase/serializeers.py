# DRF
from rest_framework import serializers

# Django
from django.db import transaction
from django.contrib.auth import get_user_model

# Python
from decimal import Decimal, ROUND_HALF_UP

# User Model
User = get_user_model()

from django.db.models import Q

# Models
from .models import (
    # Stock Receipt
    StockReceipt, StockReceiptItem,
    SerialNumber, BatchNumber, BatchSerialNumber,
    StockReceiptComment, StockReceiptHistory, StockReceiptAttachment,

    # Purchase
    PurchaseOrder, PurchaseOrderItem, PurchaseOrderHistory,
    PurchaseOrderComment, PurchaseOrderAttachment,

    # Stock Return
    StockReturn, StockReturnItem, SerialNumberReturn,
    StockReturnComment, StockReturnHistory, StockReturnAttachment
)

# Masters
from masters.models import Supplier, Product, Warehouse
from masters.serializers import SupplierSerializer, ProductSerializer, WarehouseSerializer



class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
    delete = serializers.BooleanField(
        required=False,
        default=False,
        write_only=True
    )
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
            'id', 'delete', 'product', 'product_name', 'product_id', 'uom', 'in_stock',
            'qty_ordered', 'insufficient_stock', 'unit_price', 'tax_rate',
            'discount_rate', 'total', 'tax_amount'
        ]
        read_only_fields = ['id', 'product_name', 'product_id', 'uom', 'in_stock', 'insufficient_stock', 'total', 'tax_amount']

    def validate(self, data):
        if 'qty_ordered' in data and data.get('qty_ordered') < 1:
            raise serializers.ValidationError({"qty_ordered": "Must be at least 1"})

        if 'unit_price' in data and data.get('unit_price') <= 0:
            raise serializers.ValidationError({"unit_price": "Must be positive"})

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
    supplier_name = serializers.CharField(read_only=True)  # auto-filled

    class Meta:
        model = PurchaseOrder
        fields = [
            'po_date', 'delivery_date', 'status',
            'supplier', 'supplier_name',
            'payment_terms', 'inco_terms', 'currency',
            'notes_comments', 'global_discount', 'shipping_charges',
            'items'
        ]
        read_only_fields = ['PO_ID', 'subtotal', 'tax_summary', 'total_order_value', 'rounding_adjustment', 'supplier_name']

    def validate_supplier(self, value):
        self.context['supplier_name'] = value.supplier_name
        return value

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

        # Update supplier_name if supplier changed
        if 'supplier' in validated_data:
            validated_data['supplier_name'] = validated_data['supplier'].name

        # Update parent fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        # ✅ Safe nested handling
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

                # -------- UPDATE ITEM --------
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

                # -------- CREATE ITEM --------
                else:
                    item_data.pop("delete", None)
                    if not item_data.get("product"):
                        raise serializers.ValidationError("Product is required")

                    PurchaseOrderItem.objects.create(
                        purchase_order=instance,
                        **item_data
                    )

        # Recalculate totals
        instance.calculate_summary()

        return instance

    



from rest_framework import serializers
from django.db import transaction


from .models import (
    StockReceipt, StockReceiptItem, SerialNumber, 
    BatchNumber, BatchSerialNumber, 
    StockReceiptComment, StockReceiptHistory, StockReceiptAttachment
)
from masters.models import Product, Warehouse
from masters.serializers import SupplierSerializer
from .models import PurchaseOrder   


# ────────────────────────────────────────────────
# Extend Existing Serializers with Delete Support
# ────────────────────────────────────────────────

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





class SerialNumberReturnSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)

    def to_internal_value(self, data):
        return {'id': data['id']}

    def to_representation(self, instance):
        if instance.serial:
            return {
                'id': instance.serial.id,
                'serial_no': instance.serial.serial_no,
                'type': 'serial'
            }

        elif instance.batch_serial:
            return {
                'id': instance.batch_serial.id,
                'serial_no': instance.batch_serial.serial_no,
                'type': 'batch'
            }

        return None

class StockReturnItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    stock_receipt_item = serializers.PrimaryKeyRelatedField(
    queryset=StockReceiptItem.objects.all(),
    required=True
)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
    product_name = serializers.CharField(read_only=True)
    product_id = serializers.CharField(source='product.product_id', read_only=True)
    serial_numbers = SerialNumberReturnSerializer(many=True, required=False)

    available_serials = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StockReturnItem
        fields = [
            'id', 'stock_receipt_item', 'product', 'product_name', 'product_id', 'uom',
            'qty_ordered', 'qty_rejected', 'qty_returned', 'return_reason',
            'unit_price', 'tax_rate', 'discount_rate', 'total',
            'serial_numbers', 'available_serials'
        ]
        read_only_fields = [
            'product_name', 'product_id', 'qty_ordered', 'qty_rejected', 'total'
        ]

    def get_available_serials(self, obj):
        if not obj.stock_receipt_item:
            return []

        # Used serials in THIS stock return
        used_serial_ids = SerialNumberReturn.objects.filter(
            stock_return_item__stock_return=obj.stock_return
        ).values_list('serial_id', flat=True)

        used_batch_serial_ids = SerialNumberReturn.objects.filter(
            stock_return_item__stock_return=obj.stock_return
        ).values_list('batch_serial_id', flat=True)

        stock_item = obj.stock_receipt_item

        # =========================
        # SERIAL TYPE
        # =========================
        if stock_item.stock_dim == "Serial":
            available = SerialNumber.objects.filter(
                stock_receipt_item=stock_item
            ).exclude(id__in=used_serial_ids)

            return [
                {
                    "id": s.id,
                    "serial_no": s.serial_no,
                    "type": "serial"   # ✅ ADDED
                }
                for s in available
            ]

        # =========================
        # BATCH TYPE
        # =========================
        elif stock_item.stock_dim == "Batch":
            available = BatchSerialNumber.objects.filter(
                batch_number__stock_receipt_item=stock_item
            ).exclude(id__in=used_batch_serial_ids)

            return [
                {
                    "id": s.id,
                    "serial_no": s.serial_no,
                    "type": "batch"   # ✅ ADDED
                }
                for s in available
            ]

        return []

    def get_serial_numbers(self, obj):
        serial_returns = obj.serial_numbers.all()
        result = []
        for sr in serial_returns:
            if sr.serial:
                result.append({
                    "id": sr.serial.id,
                    "serial_no": sr.serial.serial_no,
                    "type": "serial"
                })
            elif sr.batch_serial:
                result.append({
                    "id": sr.batch_serial.id,
                    "serial_no": sr.batch_serial.serial_no,
                    "type": "batch"
                })
        return result

    def validate(self, data):
        instance = getattr(self, 'instance', None)

        stock_receipt_item = data.get(
            'stock_receipt_item',
            getattr(instance, 'stock_receipt_item', None)
        )

        # ✅ Always get current qty from DB if instance exists
        if instance:
            current_qty = StockReturnItem.objects.get(pk=instance.pk).qty_returned
        else:
            current_qty = 0

        qty_returned = data.get('qty_returned', current_qty)

        serials = data.get('serial_numbers', None)

        qty_in_request = 'qty_returned' in data
        serials_in_request = 'serial_numbers' in data

        # =========================
        # QTY LIMIT VALIDATION
        # =========================
        if stock_receipt_item and qty_in_request:
            max_returnable = stock_receipt_item.rejected_qty

            if qty_returned > max_returnable:
                raise serializers.ValidationError({
                    "qty_returned": f"Cannot exceed rejected quantity ({max_returnable})"
                })

            if qty_returned < 0:
                raise serializers.ValidationError({
                    "qty_returned": "Returned quantity cannot be negative"
                })

        # =========================
        # SERIAL VALIDATION (FINAL FIX)
        # =========================
        if serials_in_request:
            # 🔥 Use NEW serials from request
            if len(serials) > qty_returned:
                raise serializers.ValidationError({
                    "serial_numbers": (
                        f"Cannot select more serials ({len(serials)}) "
                        f"than qty returned ({qty_returned})"
                    )
                })

        elif qty_in_request and instance:
            # 🔥 If serials NOT sent → fallback to existing DB
            existing_serial_count = instance.serial_numbers.count()

            if qty_returned < existing_serial_count:
                raise serializers.ValidationError({
                    "serial_numbers": (
                        f"You reduced qty_returned to {qty_returned}, "
                        f"but {existing_serial_count} serials already exist. "
                        f"Please update serial_numbers."
                    )
                })

        return data

    def create(self, validated_data):
        serials_data = validated_data.pop('serial_numbers', [])
        item = StockReturnItem.objects.create(**validated_data)

        for serial_data in serials_data:
            serial_id = serial_data['id']
            stock_dim = item.stock_receipt_item.stock_dim

            if stock_dim == "Serial":
                SerialNumberReturn.objects.create(
                    stock_return_item=item,
                    serial_id=serial_id
                )
            elif stock_dim == "Batch":
                SerialNumberReturn.objects.create(
                    stock_return_item=item,
                    batch_serial_id=serial_id
                )

        return item

    def update(self, instance, validated_data):
        serials_data = validated_data.pop('serial_numbers', None)

        # 🔒 lock FK
        validated_data.pop('stock_receipt_item', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if serials_data is not None:
            instance.serial_numbers.all().delete()
            for serial_data in serials_data:
                serial_id = serial_data['id']
                stock_dim = instance.stock_receipt_item.stock_dim

                if stock_dim == "Serial":
                    SerialNumberReturn.objects.create(
                        stock_return_item=instance,
                        serial_id=serial_id
                    )
                elif stock_dim == "Batch":
                    SerialNumberReturn.objects.create(
                        stock_return_item=instance,
                        batch_serial_id=serial_id
                    )

        return instance



class StockReturnCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = StockReturnComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class StockReturnHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = StockReturnHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


class StockReturnAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = StockReturnAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']


class StockReturnSerializer(serializers.ModelSerializer):
    items = StockReturnItemSerializer(many=True, read_only=True)
    comments = StockReturnCommentSerializer(many=True, read_only=True)
    history = StockReturnHistorySerializer(many=True, read_only=True)
    attachments = StockReturnAttachmentSerializer(many=True, read_only=True)

    po_reference = serializers.StringRelatedField(read_only=True)
    grn_reference = serializers.StringRelatedField(read_only=True)
    supplier = SupplierSerializer(read_only=True)
    return_initiated_by = serializers.StringRelatedField(read_only=True)

    created_by = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)
    updated_by = serializers.CharField(source='updated_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = StockReturn
        fields = '__all__'



from django.db import transaction
from decimal import Decimal, ROUND_HALF_UP
from rest_framework import serializers

class StockReturnWriteSerializer(serializers.ModelSerializer):
    items = StockReturnItemSerializer(many=True, required=False, allow_empty=True)

    po_reference = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrder.objects.filter(status='Submitted'),
        required=True
    )
    grn_reference = serializers.PrimaryKeyRelatedField(
        queryset=StockReceipt.objects.filter(status='Submitted'),
        required=False, allow_null=True
    )

    class Meta:
        model = StockReturn
        fields = [
            'po_reference', 'grn_reference', 'received_date', 'return_date',
            'return_initiated_by', 'supplier', 'status', 'global_discount',
            'items'
        ]
        read_only_fields = [
            'SRN_ID', 'original_purchased_total', 'return_subtotal',
            'global_discount_amount', 'rounding_adjustment', 'amount_to_recover'
        ]

    # =========================
    # SERIAL VALIDATION
    # =========================
    def _validate_and_get_serials(self, item, serial_ids):
        if not item.stock_receipt_item:
            raise serializers.ValidationError("stock_receipt_item is required")

        stock_item = item.stock_receipt_item
        stock_dim = stock_item.stock_dim

        if stock_dim == "Serial":
            serial_objs = SerialNumber.objects.filter(
                id__in=serial_ids,
                stock_receipt_item=stock_item
            )

        elif stock_dim == "Batch":
            serial_objs = BatchSerialNumber.objects.filter(
                id__in=serial_ids,
                batch_number__stock_receipt_item=stock_item
            )

        else:
            raise serializers.ValidationError("Invalid stock type")

        if serial_objs.count() != len(serial_ids):
            raise serializers.ValidationError("Invalid serials for this GRN item")

        return serial_objs

    # =========================
    # TOTAL CALCULATION
    # =========================
    def _recalculate_totals(self, stock_return):
        subtotal = Decimal('0.00')
        for item in stock_return.items.all():
            subtotal += item.total or Decimal('0.00')

        discount_amount = subtotal * (stock_return.global_discount / Decimal('100'))
        total_before_round = subtotal - discount_amount
        rounded = total_before_round.quantize(Decimal('1'), rounding=ROUND_HALF_UP)

        StockReturn.objects.filter(pk=stock_return.pk).update(
            return_subtotal=subtotal,
            global_discount_amount=discount_amount,
            rounding_adjustment=rounded - total_before_round,
            amount_to_recover=rounded
        )

        stock_return.refresh_from_db()

    # =========================
    # CREATE
    # =========================
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        validated_data['supplier'] = validated_data['po_reference'].supplier

        stock_return = StockReturn.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        used_serial_ids = set(
            SerialNumberReturn.objects.filter(
                stock_return_item__stock_return=stock_return
            ).values_list('serial_id', flat=True)
        )

        used_batch_serial_ids = set(
            SerialNumberReturn.objects.filter(
                stock_return_item__stock_return=stock_return
            ).values_list('batch_serial_id', flat=True)
        )

        try:
            for item_data in items_data:
                serials_data = item_data.pop('serial_numbers', [])
                item_data.pop('delete', None)

                item = StockReturnItem.objects.create(
                    stock_return=stock_return,
                    **item_data
                )

                if serials_data:
                    serial_ids = [s['id'] for s in serials_data]

                    # Duplicate check
                    if len(serial_ids) != len(set(serial_ids)):
                        raise serializers.ValidationError("Duplicate serials not allowed")

                    serial_objs = self._validate_and_get_serials(item, serial_ids)

                    for s in serial_objs:
                        if isinstance(s, SerialNumber) and s.id in used_serial_ids:
                            raise serializers.ValidationError(f"Serial already used: {s.serial_no}")
                        if isinstance(s, BatchSerialNumber) and s.id in used_batch_serial_ids:
                            raise serializers.ValidationError(f"Batch serial already used: {s.serial_no}")

                    SerialNumberReturn.objects.bulk_create([
                        SerialNumberReturn(
                            stock_return_item=item,
                            serial=s if isinstance(s, SerialNumber) else None,
                            batch_serial=s if isinstance(s, BatchSerialNumber) else None
                        ) for s in serial_objs
                    ])

        except serializers.ValidationError:
            raise
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})

        self._recalculate_totals(stock_return)
        return stock_return

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        used_serial_ids = set(
            SerialNumberReturn.objects.exclude(
                stock_return_item__stock_return=instance
            ).values_list('serial_id', flat=True)
        )

        used_batch_serial_ids = set(
            SerialNumberReturn.objects.exclude(
                stock_return_item__stock_return=instance
            ).values_list('batch_serial_id', flat=True)
        )

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.get('id')
                delete_flag = item_data.get('delete', False)
                serials_data = item_data.get('serial_numbers', None)

                # DELETE
                if item_id and delete_flag:
                    StockReturnItem.objects.filter(
                        id=item_id,
                        stock_return=instance
                    ).delete()
                    continue

                # ✅ Strip serial_numbers/id/delete — handled separately
                item_data_clean = {
                    k: v for k, v in item_data.items()
                    if k not in ('serial_numbers', 'delete', 'id')
                }

                # CREATE
                if not item_id:
                    serializer = StockReturnItemSerializer(
                        data=item_data_clean,
                        context=self.context
                    )
                    serializer.is_valid(raise_exception=True)
                    item = serializer.save(stock_return=instance)

                # UPDATE
                else:
                    item = StockReturnItem.objects.get(
                        id=item_id,
                        stock_return=instance
                    )
                    serializer = StockReturnItemSerializer(
                        item,
                        data=item_data_clean,
                        partial=True,
                        context=self.context
                    )
                    serializer.is_valid(raise_exception=True)
                    item = serializer.save()

                # SERIAL SYNC — handled here, not in item serializer
                if serials_data is not None:
                    serial_ids = [s['id'] for s in serials_data]

                    if len(serial_ids) != len(set(serial_ids)):
                        raise serializers.ValidationError("Duplicate serials not allowed")

                    serial_objs = self._validate_and_get_serials(item, serial_ids)

                    for s in serial_objs:
                        if isinstance(s, SerialNumber) and s.id in used_serial_ids:
                            raise serializers.ValidationError(f"Serial already used: {s.serial_no}")
                        if isinstance(s, BatchSerialNumber) and s.id in used_batch_serial_ids:
                            raise serializers.ValidationError(f"Batch serial already used: {s.serial_no}")

                    with transaction.atomic():
                        item.serial_numbers.all().delete()
                        SerialNumberReturn.objects.bulk_create([
                            SerialNumberReturn(
                                stock_return_item=item,
                                serial=s if isinstance(s, SerialNumber) else None,
                                batch_serial=s if isinstance(s, BatchSerialNumber) else None
                            ) for s in serial_objs
                        ])

        self._recalculate_totals(instance)
        return instance