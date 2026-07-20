import re
from unittest import result
from rest_framework import serializers
from django.db import transaction
from .models import Enquiry, EnquiryItem
from purchase.models import SerialNumber, BatchSerialNumber, StockReceiptItem, StockReceiptItem
from purchase.serializers import SerialNumberSerializer


class EnquiryItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    class Meta:
        model = EnquiryItem
        fields = ['id', 'delete','item_code', 'product_description', 'cost_price', 'selling_price', 'quantity', 'total_amount']
        read_only_fields = ['total_amount']

    def validate_item_code(self, value):
        if not value:
            return value

        enquiry = self.context.get('enquiry')
        if not enquiry:
            return value  # skip if no context

        if self.instance:
            if EnquiryItem.objects.filter(
                enquiry=enquiry,
                item_code=value
            ).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(
                    "Product item with this item code already exists in this enquiry."
                )
        else:
            if EnquiryItem.objects.filter(
                enquiry=enquiry,
                item_code=value
            ).exists():
                raise serializers.ValidationError(
                    "Product item with this item code already exists in this enquiry."
                )


        if value and not re.match(r'^[A-Za-z0-9\-]+$', value):
            raise serializers.ValidationError("Item Code can only contain letters, numbers and hyphens.")

        return value

    def validate_product_description(self, value):
 
        if value and not re.match(r'^[A-Za-z0-9\s.,\-]+$', value):
            raise serializers.ValidationError("Product Description can only contain letters, numbers, spaces and basic punctuation.")
        return value

    def validate(self, data):
        if data.get('selling_price', 0) <= 0:
            raise serializers.ValidationError({"selling_price": "Must be positive"})
        if data.get('quantity', 0) < 1:
            raise serializers.ValidationError({"quantity": "Must be at least 1"})
        return data


class EnquirySerializer(serializers.ModelSerializer):
    items = EnquiryItemSerializer(many=True, read_only=True)
    grand_total = serializers.SerializerMethodField()
    user = serializers.StringRelatedField()
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Enquiry
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by']

    def get_grand_total(self, obj):
        return sum(item.total_amount for item in obj.items.all())
    
    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class EnquiryWriteSerializer(serializers.ModelSerializer):
    # Make items read-only here — we handle sync manually in update/create
    items = EnquiryItemSerializer(many=True, read_only=True)

    class Meta:
        model = Enquiry
        fields = [
            'first_name', 'last_name', 'email', 'phone_number',
            'street_address', 'apartment', 'city', 'state', 'postal', 'country',
            'enquiry_type', 'enquiry_description',
            'enquiry_channel', 'social_media_platform',
            'source', 'source_social_media',
            'how_heard', 'urgency_level', 'enquiry_status', 'priority',
            'items'  # still include in fields for response
        ]

    def validate_email(self, value):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError("Invalid email format (local part contains invalid characters).")
        return value

    def validate(self, data):
        if self.instance is None:
            required = ['first_name', 'email', 'phone_number', 'enquiry_type', 'enquiry_status']
            for field in required:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"{field.replace('_', ' ').title()} is required"})

        channel = data.get('enquiry_channel')
        if channel == 'Social Media' and not data.get('social_media_platform'):
            raise serializers.ValidationError({
                'social_media_platform': 'Required when channel is Social Media'
            })

        source = data.get('source')
        if source == 'Social Media' and not data.get('source_social_media'):
            raise serializers.ValidationError({
                'source_social_media': 'Required when source is Social Media'
            })

        return data

    @transaction.atomic
    def create(self, validated_data):
        # Create main enquiry
        user = self.context['request'].user
        enquiry = Enquiry.objects.create(
            user=user,
            created_by=user,
            updated_by=user,
            **validated_data
        )

        # Items are read-only here — but frontend can send them
        # So manually create if sent
        items_data = self.initial_data.get('items', [])
        if items_data:
            item_serializer = EnquiryItemSerializer(data=items_data, many=True, context={'enquiry': enquiry})
            item_serializer.is_valid(raise_exception=True)
            item_serializer.save(enquiry=enquiry)

        return enquiry

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # Update parent
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)

                # 🚫 Skip invalid delete (no id)
                if delete_flag and not item_id:
                    continue

                # DELETE
                if item_id and delete_flag:
                    EnquiryItem.objects.filter(
                        id=item_id,
                        enquiry=instance
                    ).delete()
                    continue

                # UPDATE
                if item_id:
                    try:
                        item = EnquiryItem.objects.get(
                            id=item_id,
                            enquiry=instance
                        )
                    except EnquiryItem.DoesNotExist:
                        raise serializers.ValidationError(
                            f"Item {item_id} not found."
                        )

                    serializer = EnquiryItemSerializer(
                        item,
                        data=item_data,
                        partial=True,
                        context={'enquiry': instance}
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

                # CREATE
                else:
                    serializer = EnquiryItemSerializer(
                        data=item_data,
                        context={'enquiry': instance}
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save(enquiry=instance)

        return instance


from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model

from masters.models import Product, UOM, TaxCode, Customer
from masters.serializers import ProductSerializer, UOMSerializer, TaxCodeSerializer, CustomerSerializer

from .models import (
    Quotation, QuotationItem, QuotationAttachment,
    QuotationComment, QuotationHistory, QuotationRevision
)

User = get_user_model()

from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model

from masters.models import Product, UOM, TaxCode, Customer
from masters.serializers import ProductSerializer, UOMSerializer, TaxCodeSerializer, CustomerSerializer

from .models import (
    Quotation, QuotationItem, QuotationAttachment,
    QuotationComment, QuotationHistory, QuotationRevision
)

User = get_user_model()


# Child Serializers
class QuotationItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id_display = serializers.CharField(source='product.product_id', read_only=True)
    uom = serializers.PrimaryKeyRelatedField(queryset=UOM.objects.all())
    tax = serializers.PrimaryKeyRelatedField(queryset=TaxCode.objects.all(), allow_null=True, required=False)

    class Meta:
        model = QuotationItem
        fields = [
            'id', 'delete', 'product', 'product_name', 'product_id_display', 'uom',
            'unit_price', 'discount', 'tax', 'tax_rate', 'quantity', 'total'
        ]
        read_only_fields = ['product_name', 'product_id_display', 'tax_rate', 'total']

    def validate_product(self, value):
        quotation = self.context.get('quotation')
        if not quotation:
            return value

        if self.instance:
            if QuotationItem.objects.filter(
                quotation=quotation,
                product=value
            ).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(
                    "This product is already added in this quotation. You cannot add it again."
                )
        else:
            if QuotationItem.objects.filter(
                quotation=quotation,
                product=value
            ).exists():
                raise serializers.ValidationError(
                    "This product is already added in this quotation. You cannot add it again."
                )

        return value

    def validate(self, data):
        if 'unit_price' in data and data['unit_price'] <= 0:
            raise serializers.ValidationError({"unit_price": "Must be positive"})

        if 'quantity' in data and data['quantity'] < 1:
            raise serializers.ValidationError({"quantity": "Must be at least 1"})

        return data


class QuotationAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuotationAttachment
        fields = ['id', 'file', 'uploaded_by', 'timestamp']


class QuotationCommentSerializer(serializers.ModelSerializer):
    comment_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuotationComment
        fields = ['id', 'comment_by', 'comment', 'timestamp']


class QuotationHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuotationHistory
        fields = ['id', 'event_type', 'status', 'extra_info', 'action_by', 'timestamp']


class QuotationRevisionSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = QuotationRevision
        fields = ['id', 'revision_no', 'revision_date', 'created_by', 'comment', 'status']


# Main Serializers
class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    attachments = QuotationAttachmentSerializer(many=True, read_only=True)
    comments = QuotationCommentSerializer(many=True, read_only=True)
    history = QuotationHistorySerializer(many=True, read_only=True)
    revisions = QuotationRevisionSerializer(many=True, read_only=True)

    customer = CustomerSerializer(read_only=True)
    sales_rep = serializers.StringRelatedField(read_only=True)

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    subtotal = serializers.ReadOnlyField()
    tax_summary = serializers.ReadOnlyField()
    grand_total = serializers.ReadOnlyField()

    class Meta:
        model = Quotation
        fields = '__all__'

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None

class QuotationWriteSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, required=False, allow_empty=True)

    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    sales_rep = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__role='Sales Representative'),
        allow_null=True
    )

    class Meta:
        model = Quotation
        fields = [
            'customer', 'customer_po_reference', 'sales_rep',
            'quotation_type', 'quotation_date', 'expiry_date',
            'currency', 'payment_terms', 'expected_delivery',
            'status', 'global_discount', 'shipping_charges',
            'items'  
        ]

    def validate(self, data):
        if self.instance is None:
            required = ['customer', 'quotation_type', 'quotation_date', 'status']
            for field in required:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"{field.replace('_', ' ').title()} is required"})
        return data

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        # REMOVED: comments_data = validated_data.pop('comments', [])

        quotation = Quotation.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:
            item_data.pop("delete", None)
            QuotationItem.objects.create(
                quotation=quotation,
                **item_data
            )


        return quotation

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # Update parent
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)

                # 🚫 Skip invalid delete
                if delete_flag and not item_id:
                    continue

                # -------- DELETE --------
                if item_id and delete_flag:
                    QuotationItem.objects.filter(
                        id=item_id,
                        quotation=instance
                    ).delete()
                    continue

                # -------- UPDATE --------
                if item_id:
                    try:
                        item = QuotationItem.objects.get(
                            id=item_id,
                            quotation=instance
                        )
                    except QuotationItem.DoesNotExist:
                        raise serializers.ValidationError(
                            f"Quotation item {item_id} not found."
                        )

                    for attr, value in item_data.items():
                        if attr != "id":
                            setattr(item, attr, value)

                    item.save()

                # -------- CREATE --------
                else:
                    item_data.pop("delete", None)
                    QuotationItem.objects.create(
                    quotation=instance,
                    **item_data
                )

        return instance




from rest_framework import serializers
from .models import SalesOrder, SalesOrderItem, SalesOrderComment, SalesOrderHistory, DeliveryNote, DeliveryNoteItem, DeliveryNoteCustomerAcknowledgement, DeliveryNoteAttachment,  Invoice, InvoiceItem, InvoiceAttachment
from masters.serializers import CustomerSerializer, ProductSerializer,TaxCodeSerializer
from masters.models import TaxCode
from purchase.serializers import SerialNumberSerializer
# serializers.py

from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model

from masters.models import Customer, Product, UOM, TaxCode
from masters.serializers import CustomerSerializer

from .models import SalesOrder, SalesOrderItem, SalesOrderComment, SalesOrderHistory

User = get_user_model()

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    SalesOrder, SalesOrderItem, SalesOrderComment,
  SalesOrderHistory
)
from masters.serializers import CustomerSerializer
from masters.models import Product, UOM, TaxCode


User = get_user_model()


# ────────────────────────────────────────────────
# Item Serializer 
# ────────────────────────────────────────────────
class SalesOrderItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    delete = serializers.BooleanField(required=False, default=False, write_only=True)

    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        required=False
    )
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    product_id_display = serializers.CharField(
        source='product.product_id',
        read_only=True
    )
    in_stock = serializers.IntegerField(
        source='product.quantity_in_stock',
        read_only=True
    )

    uom = serializers.PrimaryKeyRelatedField(
        queryset=UOM.objects.all(),
        required=False
    )

    tax = serializers.PrimaryKeyRelatedField(
        queryset=TaxCode.objects.all(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = SalesOrderItem
        fields = [
            'id',
            'delete',
            'product',
            'product_name',
            'product_id_display',
            'in_stock',
            'uom',
            'unit_price',
            'discount',
            'tax',
            'tax_rate',
            'quantity',
            'total'
        ]
        read_only_fields = [
            'product_name',
            'product_id_display',
            'in_stock',
            'tax_rate',
            'total'
        ]

    def validate_product(self, value):
        sales_order = self.context.get('sales_order')

        # Skip duplicate check if no sales order context
        if not sales_order:
            return value

        # Skip duplicate check during delete requests
        if self.initial_data.get("delete", False):
            return value

        if self.instance:
            exists = SalesOrderItem.objects.filter(
                sales_order=sales_order,
                product=value
            ).exclude(id=self.instance.id).exists()
        else:
            exists = SalesOrderItem.objects.filter(
                sales_order=sales_order,
                product=value
            ).exists()

        if exists:
            raise serializers.ValidationError(
                "This product is already added in this sales order."
            )

        return value

    def validate(self, data):
        # Skip validations for delete request
        if data.get("delete", False):
            return data

        if 'unit_price' in data and data['unit_price'] <= 0:
            raise serializers.ValidationError({
                "unit_price": "Must be positive"
            })

        if 'quantity' in data and data['quantity'] < 1:
            raise serializers.ValidationError({
                "quantity": "Must be at least 1"
            })

        return data
    def create(self, validated_data):
        # 🔥 REMOVE NON-MODEL FIELD
        validated_data.pop('delete', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # 🔥 REMOVE NON-MODEL FIELD
        validated_data.pop('delete', None)
        return super().update(instance, validated_data)


# ────────────────────────────────────────────────
# Comment, History 
# ────────────────────────────────────────────────
class SalesOrderCommentSerializer(serializers.ModelSerializer):
    comment_by = serializers.StringRelatedField(read_only=True)  # shows username or full name

    class Meta:
        model = SalesOrderComment
        fields = ['id', 'comment', 'comment_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'comment_by']


class SalesOrderHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = SalesOrderHistory
        fields = ['id', 'event_type', 'status', 'extra_info', 'action_by', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'action_by']


# ────────────────────────────────────────────────
# Main Read Serializer (GET) – Includes nested comments/history/attachments
# ────────────────────────────────────────────────
class SalesOrderSerializer(serializers.ModelSerializer):
    items = SalesOrderItemSerializer(many=True, read_only=True)
    comments = SalesOrderCommentSerializer(many=True, read_only=True)
    history = SalesOrderHistorySerializer(many=True, read_only=True)
    

    customer = CustomerSerializer(read_only=True)
    sales_rep = serializers.StringRelatedField(read_only=True)

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    subtotal = serializers.ReadOnlyField()
    tax_summary = serializers.ReadOnlyField()
    grand_total = serializers.ReadOnlyField()

    class Meta:
        model = SalesOrder
        fields = '__all__'

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


# ────────────────────────────────────────────────
# Write Serializer (POST/PATCH) 
# ────────────────────────────────────────────────
class SalesOrderWriteSerializer(serializers.ModelSerializer):
    items = SalesOrderItemSerializer(many=True, required=False)

    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    sales_rep = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__role='Sales Representative'),
        allow_null=True
    )

    class Meta:
        model = SalesOrder
        fields = [
            'order_date', 'sales_rep', 'order_type', 'customer',
            'payment_method', 'currency', 'due_date', 'terms_conditions',
            'shipping_method', 'expected_delivery', 'tracking_number',
            'internal_notes', 'customer_notes', 'global_discount',
            'shipping_charges', 'status', 'items'
        ]

    def validate(self, data):
        if self.instance is None:
            required = ['order_date', 'order_type', 'customer', 'status']
            for field in required:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"{field.replace('_', ' ').title()} is required"})
        return data

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])

        sales_order = SalesOrder.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:
            item_data.pop("delete", None)

            SalesOrderItem.objects.create(
                sales_order=sales_order,
                **item_data
            )

        return sales_order


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

                #  Skip invalid delete
                if delete_flag and not item_id:
                    continue

                # -------- DELETE --------
                if item_id and delete_flag:
                    SalesOrderItem.objects.filter(
                        id=item_id,
                        sales_order=instance
                    ).delete()
                    continue

                # -------- UPDATE --------
                if item_id:
                    try:
                        item = SalesOrderItem.objects.get(
                            id=item_id,
                            sales_order=instance
                        )
                    except SalesOrderItem.DoesNotExist:
                        raise serializers.ValidationError(
                            f"Sales order item {item_id} not found."
                        )

                    for attr, value in item_data.items():
                        if attr != "id":
                            setattr(item, attr, value)

                    item.save()

                # -------- CREATE --------
                else:
                    item_data.pop("delete", None)
                    SalesOrderItem.objects.create(
                        sales_order=instance,
                        **item_data
                    )

        return instance



from rest_framework import serializers
from django.db import transaction
from decimal import Decimal
from .models import (
    DeliveryNote, DeliveryNoteItem, DeliveryNoteSerial,
    DeliveryNoteCustomerAcknowledgement, DeliveryNoteAttachment,
    DeliveryNoteComment, DeliveryNoteHistory
)
from purchase.models import SerialNumberReturn
from masters.serializers import CustomerSerializer, ProductSerializer, UOMSerializer
from purchase.serializers import SerialNumberSerializer
from purchase.models import SerialNumber



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
            'acknowledgement'  # ✅ ONLY USED IN UPDATE
        ]

    def validate_sales_order(self, value):
        self.context['customer'] = value.customer
        return value

    # 🔥 SERIAL VALIDATION
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

from rest_framework import serializers
from django.db import transaction
from .models import Invoice, InvoiceItem, InvoiceAttachment, InvoiceComment, InvoiceHistory
from masters.serializers import CustomerSerializer, ProductSerializer, UOMSerializer
from crm.serializers import SalesOrderSerializer  # adjust if needed


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


from .models import InvoiceReturn, InvoiceReturnItem, InvoiceReturnAttachment, InvoiceReturnHistory, InvoiceReturnComment
from masters.serializers import CustomerSerializer, ProductSerializer
from crm.serializers import  SalesOrderSerializer
from purchase.serializers import SerialNumberSerializer  
from rest_framework import serializers
from django.db import transaction
from .models import InvoiceReturn,InvoiceReturnSerial, InvoiceReturnItem, InvoiceReturnAttachment, InvoiceReturnComment, InvoiceReturnHistory
from masters.serializers import CustomerSerializer, ProductSerializer, UOMSerializer
from crm.serializers import InvoiceSerializer



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
    


from .models import DeliveryNoteReturn, DeliveryNoteReturnItem, DeliveryNoteReturnAttachment, DeliveryNoteReturnSerial, DeliveryNoteReturnHistory, DeliveryNoteReturnComment
from masters.serializers import CustomerSerializer, ProductSerializer
from purchase.serializers import SerialNumberSerializer  
from .serializers import InvoiceReturnSerializer 

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