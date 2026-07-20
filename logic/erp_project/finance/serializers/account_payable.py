  
    
from rest_framework import serializers
from decimal import Decimal

from ..models.account_payable import (
    AccountsPayableVoucher,
    AccountsPayableVoucherItem,
    AccountsPayableVoucherAttachment,
    AccountsPayableVoucherComment,
    AccountsPayableVoucherHistory,
)

from masters.models import Supplier
from masters.serializers import SupplierSerializer


class AccountsPayableVoucherItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = AccountsPayableVoucherItem
        fields = [
            "id",
            "item_description",
            "quantity",
            "unit_price",
            "tax_amount",
            "tax_type",
            "line_total",
            "department_cost_center",
        ]
        read_only_fields = ["tax_amount", "line_total"]

    def validate(self, data):
        if data.get("quantity", 0) <= 0:
            raise serializers.ValidationError({"quantity": "Must be > 0"})
        if data.get("unit_price", 0) < 0:
            raise serializers.ValidationError({"unit_price": "Cannot be negative"})
        return data


class AccountsPayableVoucherAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AccountsPayableVoucherAttachment
        fields = ["id", "file", "uploaded_by", "uploaded_at"]
        read_only_fields = ["uploaded_by", "uploaded_at"]



class AccountsPayableVoucherCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AccountsPayableVoucherComment
        fields = ["id", "comment", "created_by", "timestamp"]
        read_only_fields = ["created_by", "timestamp"]



class AccountsPayableVoucherHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AccountsPayableVoucherHistory
        fields = ["id", "event_type", "action_by", "details", "timestamp"]
        read_only_fields = ["action_by", "timestamp"]



class AccountsPayableVoucherSerializer(serializers.ModelSerializer):
    items = AccountsPayableVoucherItemSerializer(many=True, read_only=True)
    attachments = AccountsPayableVoucherAttachmentSerializer(many=True, read_only=True)
    comments = AccountsPayableVoucherCommentSerializer(many=True, read_only=True)
    history = AccountsPayableVoucherHistorySerializer(many=True, read_only=True)

    supplier_name = SupplierSerializer(read_only=True)

    class Meta:
        model = AccountsPayableVoucher
        fields = "__all__"



class AccountsPayableVoucherWriteSerializer(serializers.ModelSerializer):
    items = AccountsPayableVoucherItemSerializer(many=True, required=False)

    supplier_name = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all()
    )

    class Meta:
        model = AccountsPayableVoucher
        fields = [
            "supplier_name",
            "purchase_order_no",
            "grn_no",
            "invoice_no",
            "invoice_date",
            "voucher_date",
            "currency",
            "exchange_rate",
            "department_cost_center",
            "discount",
            "debit_account",
            "credit_account",
            "tax_payable_account",
            "tds_payable",
            "remarks",
            "approval_status",
            "items",
        ]
        read_only_fields = ["voucher_no", "subtotal", "tax_amount", "grand_total"]

    def validate(self, data):
        if data.get("discount", 0) < 0:
            raise serializers.ValidationError("Discount cannot be negative")
        return data

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        request = self.context.get("request")

        voucher = AccountsPayableVoucher.objects.create(
            created_by=request.user if request else None,
            **validated_data
        )

        for item in items_data:
            AccountsPayableVoucherItem.objects.create(
                voucher=voucher,
                **item
            )

        voucher.calculate_totals()
        voucher.save()

        return voucher

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop("id", None)

                if item_id:
                    item = AccountsPayableVoucherItem.objects.get(id=item_id, voucher=instance)
                    for attr, val in item_data.items():
                        setattr(item, attr, val)
                    item.save()
                else:
                    AccountsPayableVoucherItem.objects.create(
                        voucher=instance,
                        **item_data
                    )

        instance.calculate_totals()
        instance.save()

        instance.update_totals()  # 🔥 IMPORTANT


        return instance


# serializers for Accounts Receivable 


# from rest_framework import serializers
# from decimal import Decimal

# from .models import (
#     AccountsReceivableVoucherItem,
#     AccountsReceivableVoucher,
#     AccountsReceivableVoucherHistory,
#     AccountsReceivableVoucherComment,
#     AccountsReceivableVoucherAttachment,
# )
# from masters.models import Customer
# from masters.serializers import CustomerSerializer


# class AccountsReceivableVoucherItemSerializer(serializers.ModelSerializer):
#     id = serializers.IntegerField(required=False)

#     class Meta:
#         model = AccountsReceivableVoucherItem
#         fields = [
#             "id",
            
#             "item_description",
#             "quantity",
#             "unit_price",
#             "discount",
#             "tax_type",
#             "tax_amount",
#             "line_total",
#             "customer_invoice_ref",
#         ]
#         read_only_fields = ["tax_amount", "line_total"]

#     def validate(self, data):
#         quantity = data.get("quantity", Decimal("0"))
#         unit_price = data.get("unit_price", Decimal("0"))
#         discount = data.get("discount", Decimal("0"))

#         if quantity <= 0:
#             raise serializers.ValidationError({
#                 "quantity": "Quantity must be greater than zero."
#             })

#         if unit_price < 0:
#             raise serializers.ValidationError({
#                 "unit_price": "Unit price cannot be negative."
#             })

#         if discount < 0:
#             raise serializers.ValidationError({
#                 "discount": "Discount cannot be negative."
#             })

#         subtotal = quantity * unit_price
#         if discount > subtotal:
#             raise serializers.ValidationError({
#                 "discount": "Discount cannot exceed subtotal amount."
#             })

#         return data


# class AccountsReceivableVoucherAttachmentSerializer(serializers.ModelSerializer):
#     uploaded_by = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = AccountsReceivableVoucherAttachment
#         fields = [
#             "id",
#             "file",
#             "uploaded_by",
#             "uploaded_at",
#             "description",
#         ]
#         read_only_fields = ["id", "uploaded_by", "uploaded_at"]


# class AccountsReceivableVoucherCommentSerializer(serializers.ModelSerializer):
#     created_by = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = AccountsReceivableVoucherComment
#         fields = [
#             "id",
#             "comment",
#             "created_by",
#             "timestamp",
#         ]
#         read_only_fields = ["id", "created_by", "timestamp"]


# class AccountsReceivableVoucherHistorySerializer(serializers.ModelSerializer):
#     action_by = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = AccountsReceivableVoucherHistory
#         fields = [
#             "id",
#             "event_type",
#             "action_by",
#             "details",
#             "timestamp",
#         ]
#         read_only_fields = ["id", "action_by", "timestamp"]


# class AccountsReceivableVoucherSerializer(serializers.ModelSerializer):
#     items = AccountsReceivableVoucherItemSerializer(many=True, read_only=True)
#     attachments = AccountsReceivableVoucherAttachmentSerializer(many=True, read_only=True)
#     comments = AccountsReceivableVoucherCommentSerializer(many=True, read_only=True)
#     history = AccountsReceivableVoucherHistorySerializer(many=True, read_only=True)
#     customer_name = CustomerSerializer(read_only=True)
#     sales_order = serializers.StringRelatedField(read_only=True)
#     delivery_note = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = AccountsReceivableVoucher
#         fields = '__all__'


# class AccountsReceivableVoucherWriteSerializer(serializers.ModelSerializer):
#     items = AccountsReceivableVoucherItemSerializer(many=True, required=False)

#     customer_name = serializers.PrimaryKeyRelatedField(
#         queryset=Customer.objects.all(),
#         required=True
#     )

#     class Meta:
#         model = AccountsReceivableVoucher
#         fields = [
#             "customer_name",
#             "sales_order",
#             "delivery_note",
#             "customer_invoice_number",
#             "voucher_date",
#             "invoice_date",
#             "payment_mode",
#             "bank_cash_account",
#             "currency",
#             "exchange_rate",
#             "department",
#             "branch",
#             "invoice_amount",
#             "amount_received",
#             "tds_deducted",
#             "payment_reference",
#             "receipt_date",
#             "customer_receivable_account",
#             "tds_payable",
#             "discount_allowed_account",
#             "remarks",
#             "status",
#             "items",        
#         ]
#         read_only_fields = ["voucher_number", "net_received", "balance_due"]

#     def create(self, validated_data):
#         items_data = validated_data.pop('items', [])
#         request = self.context.get("request")

#         voucher = AccountsReceivableVoucher.objects.create(
#             created_by=request.user if request else None,
#             **validated_data
#         )

#         for item_data in items_data:
#             AccountsReceivableVoucherItem.objects.create(
#                 voucher=voucher,
#                 **item_data
#             )

#         return voucher

#     def update(self, instance, validated_data):
#         items_data = validated_data.pop('items', None)

#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         if items_data is not None:
#             for item_data in items_data:
#                 item_id = item_data.pop('id', None)

#                 # Delete item
#                 if item_id and item_data.get('delete', False):
#                     AccountsReceivableVoucherItem.objects.filter(
#                         id=item_id,
#                         voucher=instance
#                     ).delete()
#                     continue

#                 # Update item
#                 if item_id:
#                     item = AccountsReceivableVoucherItem.objects.get(
#                         id=item_id,
#                         voucher=instance
#                     )
#                     serializer = AccountsReceivableVoucherItemSerializer(
#                         item,
#                         data=item_data,
#                         partial=True
#                     )
#                     serializer.is_valid(raise_exception=True)
#                     serializer.save()

#                 # Create new item
#                 else:
#                     AccountsReceivableVoucherItem.objects.create(
#                         voucher=instance,
#                         **item_data
#                     )

#         return instance