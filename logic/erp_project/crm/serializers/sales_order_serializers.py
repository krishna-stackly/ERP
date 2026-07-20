from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import serializers

from masters.models import Customer, Product, UOM, TaxCode
from masters.serializers import CustomerSerializer

from crm.models.sales_order_models import (
    SalesOrder,
    SalesOrderItem,
    SalesOrderComment,
    SalesOrderHistory,
)

User = get_user_model()

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