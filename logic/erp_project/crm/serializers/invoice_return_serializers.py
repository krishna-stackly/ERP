from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from masters.models import Product
from masters.serializers import (
    CustomerSerializer,
    ProductSerializer,
    UOMSerializer,
)

from purchase.models import (
    SerialNumber,
    BatchSerialNumber,
)

from crm.models.invoice_models import (
    Invoice,
    InvoiceItem,
)

from crm.models.invoice_return_models import (
    InvoiceReturn,
    InvoiceReturnItem,
    InvoiceReturnSerial,
    InvoiceReturnAttachment,
    InvoiceReturnComment,
    InvoiceReturnHistory,
)

from crm.serializers.invoice_serializers import InvoiceSerializer
from crm.serializers.delivery_note_serializers import (
    get_product_serial_queryset,
)


class InvoiceReturnSerialSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)

    def to_internal_value(self, data):
        if not isinstance(data, dict) or 'id' not in data:
            raise serializers.ValidationError("Serial ID is required")
        return {'id': data['id']}

    def to_representation(self, instance):
        if instance.serial:
            return {
                "id": instance.serial.id,
                "serial_no": instance.serial.serial_no,
                "type": "serial"
            }
        elif instance.batch_serial:
            return {
                "id": instance.batch_serial.id,
                "serial_no": instance.batch_serial.serial_no,
                "type": "batch"
            }
        return {"id": None, "serial_no": None}

class InvoiceReturnItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    invoice_item = serializers.PrimaryKeyRelatedField(
        queryset=InvoiceItem.objects.all(),
        required=False
    )

    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
    product_name = serializers.CharField(read_only=True)
    uom = UOMSerializer(read_only=True)

    serial_numbers = InvoiceReturnSerialSerializer(many=True, required=False)
    available_serials = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = InvoiceReturnItem
        fields = [
            'id', 'delete', 'invoice_item', 'product', 'product_name', 'uom',
            'invoiced_qty', 'returned_qty_cus',
            'serial_numbers', 'available_serials',
            'return_reason', 'unit_price', 'tax_rate', 'discount_rate', 'total'
        ]
        read_only_fields = ['product_name', 'invoiced_qty', 'total']

    def validate(self, data):
        instance = getattr(self, 'instance', None)

        invoice_item = data.get('invoice_item') or getattr(instance, 'invoice_item', None)

        # ✅ FIXED (DN style)
        if 'returned_qty_cus' in data:
            returned_qty = data.get('returned_qty_cus')
        elif instance:
            returned_qty = instance.returned_qty_cus
        else:
            returned_qty = None   # 🔥 IMPORTANT

        serials = data.get('serial_numbers', None)

        # ✅ Quantity validation ONLY if qty provided
        if 'returned_qty_cus' in data:
            if returned_qty is None or returned_qty < 0:
                raise serializers.ValidationError({
                    "returned_qty_cus": "Returned qty must be valid"
                })

            if invoice_item and returned_qty > invoice_item.quantity:
                raise serializers.ValidationError({
                    "returned_qty_cus": f"Cannot exceed invoiced qty ({invoice_item.quantity})"
                })

        # ✅ Require serials if qty updated
        if 'returned_qty_cus' in data:
            if returned_qty > 0 and 'serial_numbers' not in data:
                raise serializers.ValidationError({
                    "serial_numbers": "Serial numbers required when updating returned qty"
                })

        # ✅ Serial validations
        if serials is not None:
            serial_ids = [s['id'] for s in serials]

            if len(serial_ids) != len(set(serial_ids)):
                raise serializers.ValidationError({
                    "serial_numbers": "Duplicate serials not allowed"
                })

            # 🔥 FIXED CONDITION
            if returned_qty is not None and len(serial_ids) > returned_qty:
                raise serializers.ValidationError({
                    "serial_numbers": f"Cannot select more serials ({len(serial_ids)}) than returned qty ({returned_qty})"
                })

            product = data.get('product') or getattr(instance, 'product', None)

            if product:
                serial_qs, batch_qs = get_product_serial_queryset(product)
                valid_ids = set(
                    list(serial_qs.values_list('id', flat=True)) +
                    list(batch_qs.values_list('id', flat=True))
                )

                for sid in serial_ids:
                    if sid not in valid_ids:
                        raise serializers.ValidationError({
                            "serial_numbers": "Invalid serial for this product"
                        })

        if invoice_item:
            data['invoiced_qty'] = invoice_item.quantity
            data['product'] = invoice_item.product

        return data

    def get_available_serials(self, obj):
        if not obj.product:
            return []

        current_ir_id = obj.invoice_return_id

        serials, batch_serials = get_product_serial_queryset(obj.product)

        used_serial_ids = set(
            InvoiceReturnSerial.objects.exclude(
                invoice_return_item__invoice_return_id=current_ir_id
            ).values_list('serial_id', flat=True)
        )

        used_batch_ids = set(
            InvoiceReturnSerial.objects.exclude(
                invoice_return_item__invoice_return_id=current_ir_id
            ).values_list('batch_serial_id', flat=True)
        )

        serials = serials.exclude(id__in=used_serial_ids)
        batch_serials = batch_serials.exclude(id__in=used_batch_ids)

        result = []

        for s in serials:
            result.append({
                "id": s.id,
                "serial_no": s.serial_no,
                "type": "serial"
            })

        for s in batch_serials:
            result.append({
                "id": s.id,
                "serial_no": s.serial_no,
                "type": "batch"
            })

        return result

class InvoiceReturnAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = InvoiceReturnAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class InvoiceReturnCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = InvoiceReturnComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class InvoiceReturnHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = InvoiceReturnHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


class InvoiceReturnSerializer(serializers.ModelSerializer):
    items = InvoiceReturnItemSerializer(many=True, read_only=True)
    attachments = InvoiceReturnAttachmentSerializer(many=True, read_only=True)
    comments = InvoiceReturnCommentSerializer(many=True, read_only=True)
    history = InvoiceReturnHistorySerializer(many=True, read_only=True)

    invoice = InvoiceSerializer(read_only=True)
    customer = CustomerSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    original_grand_total = serializers.SerializerMethodField()
    return_subtotal = serializers.SerializerMethodField()
    global_discount_amount = serializers.SerializerMethodField()
    amount_to_refund = serializers.SerializerMethodField()

    class Meta:
        model = InvoiceReturn
        fields = '__all__'

    def get_original_grand_total(self, obj):
        return obj.invoice.grand_total if obj.invoice else Decimal('0.00')

    def get_return_subtotal(self, obj):
        return sum(item.total for item in obj.items.all()) or Decimal('0.00')

    def get_global_discount_amount(self, obj):
        subtotal = self.get_return_subtotal(obj)
        return subtotal * (obj.global_discount or Decimal('0.00')) / Decimal('100')

    def get_amount_to_refund(self, obj):
        subtotal = self.get_return_subtotal(obj)
        discount = self.get_global_discount_amount(obj)

        return (
            subtotal - discount + (obj.rounding_adjustment or Decimal('0.00'))
        ).quantize(Decimal('0.01'))

class InvoiceReturnWriteSerializer(serializers.ModelSerializer):
    items = InvoiceReturnItemSerializer(many=True, required=False)

    invoice = serializers.PrimaryKeyRelatedField(
        queryset=Invoice.objects.filter(invoice_status__in=['Sent', 'Paid'])
    )

    customer = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = InvoiceReturn
        fields = [
            'invoice', 'invoice_return_date', 'customer_ref_no',
            'customer', 'email_id', 'phone_number', 'contact_person',
            'status', 'items'
        ]

    def validate_invoice(self, value):
        self.context['customer'] = value.customer
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        validated_data['customer'] = self.context['customer']

        ir = InvoiceReturn.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:
            item_data.pop('delete', None) 
            serials_data = item_data.pop('serial_numbers', [])

            item = InvoiceReturnItem.objects.create(
                invoice_return=ir,
                **item_data
            )

            serial_ids = [s['id'] for s in serials_data]

            serials, batch_serials = get_product_serial_queryset(item.product)

            serial_objs = list(serials.filter(id__in=serial_ids))
            batch_objs = list(batch_serials.filter(id__in=serial_ids))

            if len(serial_objs) + len(batch_objs) != len(serial_ids):
                raise serializers.ValidationError("Invalid serials for this product")

            InvoiceReturnSerial.objects.bulk_create([
                InvoiceReturnSerial(
                    invoice_return_item=item,
                    serial=s if isinstance(s, SerialNumber) else None,
                    batch_serial=s if isinstance(s, BatchSerialNumber) else None
                )
                for s in (serial_objs + batch_objs)
            ])

        return ir

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)
                serials_data = item_data.pop('serial_numbers', None)

                if item_id and delete_flag:
                    InvoiceReturnItem.objects.filter(id=item_id).delete()
                    continue

                if item_id:
                    item = InvoiceReturnItem.objects.get(id=item_id)

                    for attr, value in item_data.items():
                        setattr(item, attr, value)
                    item.save()
                else:
                    item_data.pop('delete', None) 
                    item = InvoiceReturnItem.objects.create(
                        invoice_return=instance,
                        **item_data
                    )

                if serials_data is not None:
                    serial_ids = [s['id'] for s in serials_data]

                    serials, batch_serials = get_product_serial_queryset(item.product)

                    serial_objs = list(serials.filter(id__in=serial_ids))
                    batch_objs = list(batch_serials.filter(id__in=serial_ids))

                    item.serial_numbers.all().delete()

                    InvoiceReturnSerial.objects.bulk_create([
                        InvoiceReturnSerial(
                            invoice_return_item=item,
                            serial=s if isinstance(s, SerialNumber) else None,
                            batch_serial=s if isinstance(s, BatchSerialNumber) else None
                        )
                        for s in (serial_objs + batch_objs)
                    ])

        return instance