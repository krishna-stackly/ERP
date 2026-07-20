from django.db import transaction
from rest_framework import serializers

from masters.models import Product
from masters.serializers import (
    CustomerSerializer,
    ProductSerializer,
    UOMSerializer,
)

from purchase.models import SerialNumber

from crm.models.invoice_return_models import (
    InvoiceReturnItem,
)

from crm.models.delivery_note_return_models import (
    DeliveryNoteReturn,
    DeliveryNoteReturnItem,
    DeliveryNoteReturnSerial,
    DeliveryNoteReturnAttachment,
    DeliveryNoteReturnComment,
    DeliveryNoteReturnHistory,
)

from crm.serializers.invoice_return_serializers import (
    InvoiceReturnSerializer,
)

class DeliveryNoteReturnSerialSerializer(serializers.Serializer):
    serial_no = serializers.CharField(required=True)

    def to_internal_value(self, data):
        return {
            "serial_no": data.get("serial_no")
        }

    def to_representation(self, instance):
        return {
            "serial_no": instance.serial_no
        }

class DeliveryNoteReturnItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    invoice_return_item = serializers.PrimaryKeyRelatedField(
        queryset=InvoiceReturnItem.objects.all(),
        required=False
    )

    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        required=False
    )

    product_name = serializers.CharField(read_only=True)
    uom = UOMSerializer(read_only=True)

    serial_numbers = DeliveryNoteReturnSerialSerializer(many=True, required=False)
    available_serials = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DeliveryNoteReturnItem
        fields = [
            'id', 'delete', 'invoice_return_item', 'product',
            'product_name', 'uom', 'invoiced_qty',
            'returned_qty_cus', 'serial_numbers',
            'available_serials', 'return_reason',
            'unit_price', 'tax_rate', 'discount_rate', 'total'
        ]
        read_only_fields = ['product_name', 'invoiced_qty', 'total']

    # ✅ AVAILABLE SERIALS (simple product-based)
    def get_available_serials(self, obj):
        if not obj.product:
            return []

        serials = SerialNumber.objects.filter(
            stock_receipt_item__product=obj.product
        )

        return [{"serial_no": s.serial_no} for s in serials]

    # 🔥 VALIDATION (PATCH SAFE)
    def validate(self, data):
        instance = getattr(self, 'instance', None)

        invoice_return_item = (
            data.get('invoice_return_item')
            or (instance.invoice_return_item if instance else None)
        )

        # ✅ SAFE QTY (DN STYLE)
        if 'returned_qty_cus' in data:
            returned_qty = data.get('returned_qty_cus')
        elif instance:
            returned_qty = instance.returned_qty_cus
        else:
            returned_qty = None

        serials = data.get('serial_numbers', None)

        # ✅ Qty validation
        if 'returned_qty_cus' in data:
            if returned_qty is None or returned_qty < 0:
                raise serializers.ValidationError({
                    "returned_qty_cus": "Returned qty must be valid"
                })

            if invoice_return_item and returned_qty > invoice_return_item.invoiced_qty:
                raise serializers.ValidationError({
                    "returned_qty_cus": f"Cannot exceed invoiced qty ({invoice_return_item.invoiced_qty})"
                })

        # ✅ Serial validation
        if serials is not None:
            serial_values = [s['serial_no'] for s in serials]

            # Duplicate check
            if len(serial_values) != len(set(serial_values)):
                raise serializers.ValidationError({
                    "serial_numbers": "Duplicate serials not allowed"
                })

            # 🔥 KEY FIX (PATCH SAFE)
            if returned_qty is not None and len(serial_values) > returned_qty:
                raise serializers.ValidationError({
                    "serial_numbers": f"Cannot select more serials ({len(serial_values)}) than returned qty ({returned_qty})"
                })

        # Auto-fill
        if invoice_return_item:
            data['invoiced_qty'] = invoice_return_item.invoiced_qty
            data['product'] = invoice_return_item.product

        return data

    # ✅ CREATE
    def create(self, validated_data):
        serials_data = validated_data.pop('serial_numbers', [])
        item = DeliveryNoteReturnItem.objects.create(**validated_data)

        for s in serials_data:
            DeliveryNoteReturnSerial.objects.create(
                delivery_note_return_item=item,
                serial_no=s['serial_no']
            )

        return item

    # ✅ UPDATE
    def update(self, instance, validated_data):
        serials_data = validated_data.pop('serial_numbers', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if serials_data is not None:
            instance.serial_numbers.all().delete()

            for s in serials_data:
                DeliveryNoteReturnSerial.objects.create(
                    delivery_note_return_item=instance,
                    serial_no=s['serial_no']
                )

        return instance

   

class DeliveryNoteReturnAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DeliveryNoteReturnAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class DeliveryNoteReturnCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DeliveryNoteReturnComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class DeliveryNoteReturnHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DeliveryNoteReturnHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


class DeliveryNoteReturnSerializer(serializers.ModelSerializer):
    items = DeliveryNoteReturnItemSerializer(many=True, read_only=True)
    attachments = DeliveryNoteReturnAttachmentSerializer(many=True, read_only=True)
    comments = DeliveryNoteReturnCommentSerializer(many=True, read_only=True)
    history = DeliveryNoteReturnHistorySerializer(many=True, read_only=True)

    invoice_return = InvoiceReturnSerializer(read_only=True)
    customer = CustomerSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DeliveryNoteReturn
        fields = '__all__'


        
class DeliveryNoteReturnWriteSerializer(serializers.ModelSerializer):
    items = DeliveryNoteReturnItemSerializer(many=True)

    class Meta:
        model = DeliveryNoteReturn
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])

        instance = DeliveryNoteReturn.objects.create(**validated_data)

        for item_data in items_data:
            item_data.pop('delete', None)

            serials = item_data.pop('serial_numbers', [])

            item = DeliveryNoteReturnItem.objects.create(
                delivery_note_return=instance,
                **item_data
            )

            for s in serials:
                DeliveryNoteReturnSerial.objects.create(
                    delivery_note_return_item=item,
                    serial_no=s['serial_no']
                )

        return instance

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        existing_items = {item.id: item for item in instance.items.all()}

        for item_data in items_data:
            item_id = item_data.get('id')
            delete_flag = item_data.get('delete', False)

            if item_id and item_id in existing_items:
                item = existing_items[item_id]

                if delete_flag:
                    item.delete()
                    continue

                serializer = DeliveryNoteReturnItemSerializer(
                    item, data=item_data, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

            else:
                item_data.pop('delete', None)

                serials = item_data.pop('serial_numbers', [])

                item = DeliveryNoteReturnItem.objects.create(
                    delivery_note_return=instance,
                    **item_data
                )

                for s in serials:
                    DeliveryNoteReturnSerial.objects.create(
                        delivery_note_return_item=item,
                        serial_no=s['serial_no']
                    )

        return instance