from rest_framework import serializers
from django.db import transaction
from decimal import Decimal, ROUND_HALF_UP

from masters.models import Product
from masters.serializers import SupplierSerializer

from purchase.models import (
    PurchaseOrder,
    StockReceipt,
    StockReceiptItem,
    SerialNumber,
    BatchSerialNumber,
    StockReturn,
    StockReturnItem,
    SerialNumberReturn,
    StockReturnComment,
    StockReturnHistory,
    StockReturnAttachment,
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

    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        required=False
    )

    product_name = serializers.CharField(read_only=True)
    product_id = serializers.CharField(source='product.product_id', read_only=True)

    serial_numbers = SerialNumberReturnSerializer(many=True, required=False)
    available_serials = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StockReturnItem
        fields = [
            'id', 'stock_receipt_item', 'product', 'product_name',
            'product_id', 'uom', 'qty_ordered', 'qty_rejected',
            'qty_returned', 'return_reason', 'unit_price',
            'tax_rate', 'discount_rate', 'total',
            'serial_numbers', 'available_serials'
        ]
        read_only_fields = [
            'product_name', 'product_id',
            'qty_ordered', 'qty_rejected', 'total'
        ]

    def get_available_serials(self, obj):
        if not obj.stock_receipt_item:
            return []

        used_serial_ids = SerialNumberReturn.objects.filter(
            stock_return_item__stock_return=obj.stock_return
        ).values_list('serial_id', flat=True)

        used_batch_serial_ids = SerialNumberReturn.objects.filter(
            stock_return_item__stock_return=obj.stock_return
        ).values_list('batch_serial_id', flat=True)

        stock_item = obj.stock_receipt_item

        if stock_item.stock_dim == "Serial":
            available = SerialNumber.objects.filter(
                stock_receipt_item=stock_item
            ).exclude(id__in=used_serial_ids)

            return [
                {
                    "id": s.id,
                    "serial_no": s.serial_no,
                    "type": "serial"
                }
                for s in available
            ]

        elif stock_item.stock_dim == "Batch":
            available = BatchSerialNumber.objects.filter(
                batch_number__stock_receipt_item=stock_item
            ).exclude(id__in=used_batch_serial_ids)

            return [
                {
                    "id": s.id,
                    "serial_no": s.serial_no,
                    "type": "batch"
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

        if instance:
            current_qty = StockReturnItem.objects.get(pk=instance.pk).qty_returned
        else:
            current_qty = 0

        qty_returned = data.get('qty_returned', current_qty)
        serials = data.get('serial_numbers', None)

        qty_in_request = 'qty_returned' in data
        serials_in_request = 'serial_numbers' in data

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

        if serials_in_request:
            if len(serials) > qty_returned:
                raise serializers.ValidationError({
                    "serial_numbers": (
                        f"Cannot select more serials ({len(serials)}) "
                        f"than qty returned ({qty_returned})"
                    )
                })

        elif qty_in_request and instance:
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


class StockReturnWriteSerializer(serializers.ModelSerializer):
    items = StockReturnItemSerializer(many=True, required=False, allow_empty=True)

    po_reference = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrder.objects.filter(status='Submitted'),
        required=True
    )

    grn_reference = serializers.PrimaryKeyRelatedField(
        queryset=StockReceipt.objects.filter(status='Submitted'),
        required=False,
        allow_null=True
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
            'global_discount_amount', 'rounding_adjustment',
            'amount_to_recover'
        ]

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

                    if len(serial_ids) != len(set(serial_ids)):
                        raise serializers.ValidationError("Duplicate serials not allowed")

                    serial_objs = self._validate_and_get_serials(item, serial_ids)

                    for s in serial_objs:
                        if isinstance(s, SerialNumber) and s.id in used_serial_ids:
                            raise serializers.ValidationError(
                                f"Serial already used: {s.serial_no}"
                            )

                        if isinstance(s, BatchSerialNumber) and s.id in used_batch_serial_ids:
                            raise serializers.ValidationError(
                                f"Batch serial already used: {s.serial_no}"
                            )

                    SerialNumberReturn.objects.bulk_create([
                        SerialNumberReturn(
                            stock_return_item=item,
                            serial=s if isinstance(s, SerialNumber) else None,
                            batch_serial=s if isinstance(s, BatchSerialNumber) else None
                        )
                        for s in serial_objs
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

                if item_id and delete_flag:
                    StockReturnItem.objects.filter(
                        id=item_id,
                        stock_return=instance
                    ).delete()
                    continue

                item_data_clean = {
                    k: v for k, v in item_data.items()
                    if k not in ('serial_numbers', 'delete', 'id')
                }

                if not item_id:
                    serializer = StockReturnItemSerializer(
                        data=item_data_clean,
                        context=self.context
                    )
                    serializer.is_valid(raise_exception=True)
                    item = serializer.save(stock_return=instance)

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

                if serials_data is not None:
                    serial_ids = [s['id'] for s in serials_data]

                    if len(serial_ids) != len(set(serial_ids)):
                        raise serializers.ValidationError("Duplicate serials not allowed")

                    serial_objs = self._validate_and_get_serials(item, serial_ids)

                    for s in serial_objs:
                        if isinstance(s, SerialNumber) and s.id in used_serial_ids:
                            raise serializers.ValidationError(
                                f"Serial already used: {s.serial_no}"
                            )

                        if isinstance(s, BatchSerialNumber) and s.id in used_batch_serial_ids:
                            raise serializers.ValidationError(
                                f"Batch serial already used: {s.serial_no}"
                            )

                    with transaction.atomic():
                        item.serial_numbers.all().delete()

                        SerialNumberReturn.objects.bulk_create([
                            SerialNumberReturn(
                                stock_return_item=item,
                                serial=s if isinstance(s, SerialNumber) else None,
                                batch_serial=s if isinstance(s, BatchSerialNumber) else None
                            )
                            for s in serial_objs
                        ])

        self._recalculate_totals(instance)
        return instance
