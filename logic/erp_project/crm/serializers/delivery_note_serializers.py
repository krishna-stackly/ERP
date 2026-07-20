from decimal import Decimal

from django.db import transaction
from django.utils import timezone
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
    StockReceiptItem,
    SerialNumberReturn,
)

from crm.models.delivery_note_models import (
    DeliveryNote,
    DeliveryNoteItem,
    DeliveryNoteSerial,
    DeliveryNoteCustomerAcknowledgement,
    DeliveryNoteAttachment,
    DeliveryNoteComment,
    DeliveryNoteHistory,
)

from crm.models.sales_order_models import SalesOrder


#  HELPER FUNCTION 
def get_product_serial_queryset(product):
    receipt_items = StockReceiptItem.objects.filter(
        product=product,
        stock_receipt__status='Submitted'
    )

    serials = SerialNumber.objects.filter(
        stock_receipt_item__in=receipt_items
    )

    batch_serials = BatchSerialNumber.objects.filter(
        batch_number__stock_receipt_item__in=receipt_items
    )

    return serials, batch_serials




class DeliveryNoteSerialSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)

    def to_internal_value(self, data):
        if not isinstance(data, dict) or 'id' not in data:
            raise serializers.ValidationError("Serial ID is required")
        return {'id': data['id']}

    def to_representation(self, instance):
        if instance.serial:
            return {
                'id': instance.serial.id,
                'serial_no': instance.serial.serial_no,
                'type': 'serial'
            }
        if instance.batch_serial:
            return {
                'id': instance.batch_serial.id,
                'serial_no': instance.batch_serial.serial_no,
                'type': 'batch'
            }

        return None

class DeliveryNoteItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.CharField(read_only=True)
    product_id = serializers.CharField(read_only=True)
    uom = UOMSerializer(read_only=True)

    serial_numbers = DeliveryNoteSerialSerializer(many=True, required=False)
    available_serials = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DeliveryNoteItem
        fields = [
            'id', 'delete', 'product', 'product_name', 'product_id',
            'quantity', 'uom', 'serial_numbers', 'available_serials'
        ]
        read_only_fields = ['product_name', 'product_id', 'uom']

    # 🔥 FULL VALIDATION
    def validate(self, data):
        instance = getattr(self, 'instance', None)

        #  STEP 1: Get quantity safely
        if 'quantity' in data:
            quantity = data.get('quantity')
        elif instance:
            quantity = instance.quantity
        else:
            quantity = None   # <-- IMPORTANT CHANGE

        serials_data = data.get('serial_numbers', None)

        #  STEP 2: Validate quantity ONLY if provided
        if 'quantity' in data:
            if quantity is None or quantity < 1:
                raise serializers.ValidationError({
                    "quantity": "Quantity must be at least 1"
                })

        # 🔥 STEP 3: Validate serials ONLY if sent
        if serials_data is not None:
            serial_ids = [s['id'] for s in serials_data]

            # Duplicate check
            if len(serial_ids) != len(set(serial_ids)):
                raise serializers.ValidationError({
                    "serial_numbers": "Duplicate serials not allowed"
                })

            # 🔥 IMPORTANT FIX: only compare if quantity exists
            if quantity is not None and len(serial_ids) > quantity:
                raise serializers.ValidationError({
                    "serial_numbers": f"Cannot select more serials ({len(serial_ids)}) than quantity ({quantity})"
                })

        return data

    # 🔥 AVAILABLE SERIALS (UI ONLY)
    def get_available_serials(self, obj):
        if not obj.product:
            return []

        current_dn_id = obj.delivery_note_id

        serials, batch_serials = get_product_serial_queryset(obj.product)

        used_serial_ids = set(
            DeliveryNoteSerial.objects.exclude(
                delivery_note_item__delivery_note_id=current_dn_id
            ).values_list('serial_id', flat=True)
        )

        used_batch_ids = set(
            DeliveryNoteSerial.objects.exclude(
                delivery_note_item__delivery_note_id=current_dn_id
            ).values_list('batch_serial_id', flat=True)
        )

        returned_serial_ids = set(
            SerialNumberReturn.objects.values_list('serial_id', flat=True)
        )

        returned_batch_ids = set(
            SerialNumberReturn.objects.values_list('batch_serial_id', flat=True)
        )

        current_serial_ids = set(
            obj.serial_numbers.filter(serial__isnull=False)
            .values_list('serial_id', flat=True)
        )

        current_batch_ids = set(
            obj.serial_numbers.filter(batch_serial__isnull=False)
            .values_list('batch_serial_id', flat=True)
        )

        serials = serials.exclude(
            id__in=used_serial_ids | returned_serial_ids | current_serial_ids
        )

        batch_serials = batch_serials.exclude(
            id__in=used_batch_ids | returned_batch_ids | current_batch_ids
        )

        result = []

        for s in serials:
            result.append({"id": s.id, "serial_no": s.serial_no})

        for s in batch_serials:
            result.append({"id": s.id, "serial_no": s.serial_no})

        return result

class DeliveryNoteCustomerAcknowledgementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryNoteCustomerAcknowledgement
        fields = ['received_by', 'contact_number', 'proof_of_delivery']
        read_only_fields = ['id']


class DeliveryNoteAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DeliveryNoteAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class DeliveryNoteCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DeliveryNoteComment
        fields = ['id', 'comment', 'created_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'created_by']


class DeliveryNoteHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DeliveryNoteHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


class DeliveryNoteSerializer(serializers.ModelSerializer):
    items = DeliveryNoteItemSerializer(many=True, read_only=True)
    acknowledgement = DeliveryNoteCustomerAcknowledgementSerializer(read_only=True)
    attachments = DeliveryNoteAttachmentSerializer(many=True, read_only=True)
    comments = DeliveryNoteCommentSerializer(many=True, read_only=True)
    history = DeliveryNoteHistorySerializer(many=True, read_only=True)

    sales_order = serializers.StringRelatedField(read_only=True)
    customer = CustomerSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DeliveryNote
        fields = '__all__'


class DeliveryNoteWriteSerializer(serializers.ModelSerializer):
    items = DeliveryNoteItemSerializer(many=True, required=False)
    acknowledgement = DeliveryNoteCustomerAcknowledgementSerializer(required=False)

    sales_order = serializers.PrimaryKeyRelatedField(
        queryset=SalesOrder.objects.filter(status__in=['Submitted', 'Partially Delivered'])
    )

    class Meta:
        model = DeliveryNote
        fields = [
            'sales_order', 'delivery_date', 'delivery_type',
            'destination_address', 'delivered_by',
            'delivery_status', 'vehicle_no', 'tracking_id',
            'delivery_notes', 'status',
            'items',
            'acknowledgement'
        ]

    def validate_sales_order(self, value):
        self.context['customer'] = value.customer
        return value

    def validate(self, data):
        if 'delivery_date' in data and data['delivery_date']:
            if data['delivery_date'] < timezone.now().date():
                raise serializers.ValidationError({"delivery_date": "Delivery date cannot be in the past"})

        items_data = data.get('items', [])
        status = data.get('status', 'Draft')

        if status == 'Submitted' and (not items_data or len(items_data) == 0):
            raise serializers.ValidationError({"items": "At least one line item is required for submission"})

        return data

    def _validate_and_get_serials(self, item, serial_ids):
        serials, batch_serials = get_product_serial_queryset(item.product)

        serial_objs = list(serials.filter(id__in=serial_ids))
        batch_objs = list(batch_serials.filter(id__in=serial_ids))

        all_objs = serial_objs + batch_objs

        if len(all_objs) != len(serial_ids):
            raise serializers.ValidationError("Invalid serials for this product")

        return all_objs

    # =========================
    # CREATE (NO ACKNOWLEDGEMENT)
    # =========================
    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('acknowledgement', None)  #  Ignore if sent

        items_data = validated_data.pop('items', [])
        sales_order = validated_data.get('sales_order')
        validated_data['customer'] = sales_order.customer   

        dn = DeliveryNote.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:
            item_data.pop('delete', None) 
            serials_data = item_data.pop('serial_numbers', [])
            item = DeliveryNoteItem.objects.create(delivery_note=dn, **item_data)

            serial_ids = [s['id'] for s in serials_data]

            if len(serial_ids) != len(set(serial_ids)):
                raise serializers.ValidationError("Duplicate serials not allowed")

            if len(serial_ids) > item.quantity:
                raise serializers.ValidationError(
                    f"Cannot select more serials ({len(serial_ids)}) than quantity ({item.quantity})"
                )

            if serial_ids:
                serial_objs = self._validate_and_get_serials(item, serial_ids)

                used_serial_ids = set(
                    DeliveryNoteSerial.objects.filter(serial__isnull=False)
                    .values_list('serial_id', flat=True)
                )

                used_batch_ids = set(
                    DeliveryNoteSerial.objects.filter(batch_serial__isnull=False)
                    .values_list('batch_serial_id', flat=True)
                )

                for s in serial_objs:
                    if isinstance(s, SerialNumber) and s.id in used_serial_ids:
                        raise serializers.ValidationError(f"Serial already used: {s.serial_no}")

                    if isinstance(s, BatchSerialNumber) and s.id in used_batch_ids:
                        raise serializers.ValidationError(f"Batch serial already used: {s.serial_no}")

                DeliveryNoteSerial.objects.bulk_create([
                    DeliveryNoteSerial(
                        delivery_note_item=item,
                        serial=s if isinstance(s, SerialNumber) else None,
                        batch_serial=s if isinstance(s, BatchSerialNumber) else None
                    ) for s in serial_objs
                ])

        return dn

    # =========================
    # UPDATE (ACKNOWLEDGEMENT ALLOWED)
    # =========================
    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        acknowledgement_data = validated_data.pop('acknowledgement', None)

        # 🔴 RULE: ACK ONLY AFTER SUBMITTED / PARTIAL
        if acknowledgement_data:
            if instance.status not in ['Submitted', 'Partially Delivered']:
                raise serializers.ValidationError({
                    "acknowledgement": "Allowed only after DN is Submitted or Partially Delivered"
                })

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
                serials_data = item_data.pop('serial_numbers', None)

                if item_id and delete_flag:
                    DeliveryNoteItem.objects.filter(
                        id=item_id,
                        delivery_note=instance
                    ).delete()
                    continue

                if item_id:
                    item = DeliveryNoteItem.objects.get(id=item_id, delivery_note=instance)
                    for attr, value in item_data.items():
                        setattr(item, attr, value)
                    item.save()
                else:
                    item_data.pop('delete', None) 
                    item = DeliveryNoteItem.objects.create(
                        delivery_note=instance,
                        **item_data
                    )

                if serials_data is not None:
                    serial_ids = [s['id'] for s in serials_data]

                    if len(serial_ids) != len(set(serial_ids)):
                        raise serializers.ValidationError("Duplicate serials not allowed")

                    if len(serial_ids) > item.quantity:
                        raise serializers.ValidationError(
                            f"Cannot select more serials ({len(serial_ids)}) than quantity ({item.quantity})"
                        )

                    serial_objs = self._validate_and_get_serials(item, serial_ids)

                    used_serial_ids = set(
                        DeliveryNoteSerial.objects.exclude(
                            delivery_note_item__delivery_note=instance
                        ).filter(serial__isnull=False)
                        .values_list('serial_id', flat=True)
                    )

                    used_batch_ids = set(
                        DeliveryNoteSerial.objects.exclude(
                            delivery_note_item__delivery_note=instance
                        ).filter(batch_serial__isnull=False)
                        .values_list('batch_serial_id', flat=True)
                    )

                    for s in serial_objs:
                        if isinstance(s, SerialNumber) and s.id in used_serial_ids:
                            raise serializers.ValidationError(f"Serial already used: {s.serial_no}")

                        if isinstance(s, BatchSerialNumber) and s.id in used_batch_ids:
                            raise serializers.ValidationError(f"Batch serial already used: {s.serial_no}")

                    item.serial_numbers.all().delete()

                    DeliveryNoteSerial.objects.bulk_create([
                        DeliveryNoteSerial(
                            delivery_note_item=item,
                            serial=s if isinstance(s, SerialNumber) else None,
                            batch_serial=s if isinstance(s, BatchSerialNumber) else None
                        ) for s in serial_objs
                    ])

        # =========================
        # HANDLE ACKNOWLEDGEMENT
        # =========================
        if acknowledgement_data:
            ack_obj, created = DeliveryNoteCustomerAcknowledgement.objects.get_or_create(
                delivery_note=instance
            )

            for attr, value in acknowledgement_data.items():
                setattr(ack_obj, attr, value)

            ack_obj.updated_by = self.context['request'].user
            ack_obj.save()

        return instance