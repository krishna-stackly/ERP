from rest_framework import serializers
from decimal import Decimal

from ..models.bank_cash_receipts import (
    BankCashReceipt,
    BankCashReceiptLineItem,
    BankCashReceiptAttachment,
    BankCashReceiptComment,
    BankCashReceiptHistory,
)
from masters.models import Customer
from core.models import Candidate



# PAYER SEARCH SERIALIZER  (used by popup)

class PayerSearchSerializer(serializers.Serializer):
    """
    Unified serializer for the payer popup table.
    Columns: S.No | Payer Code | Payer Name | Type | Branch
    """
    id         = serializers.IntegerField()
    payer_code = serializers.CharField()
    payer_name = serializers.CharField()
    payer_type = serializers.CharField()            # CUSTOMER / EMPLOYEE / OTHER
    branch     = serializers.CharField(allow_null=True)
    fk_field   = serializers.CharField(allow_null=True)  # "customer" / "employee" / null
    fk_id      = serializers.IntegerField(allow_null=True)


# LINE ITEM SERIALIZER


class BankCashReceiptLineItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = BankCashReceiptLineItem
        fields = [
            "id",
            "ar_voucher",
            "invoice_number",
            "invoice_date",
            "customer_name",
            "invoice_amount",
            "receipt_amount",
            "tds_deducted",
            "net_amount_received",
            "outstanding_amount",
        ]
        read_only_fields = [
            "invoice_number",
            "invoice_date",
            "customer_name",
            "invoice_amount",
            "net_amount_received",
            "outstanding_amount",
        ]

    def validate(self, data):
        receipt_amount = data.get("receipt_amount", Decimal("0.00"))
        tds_deducted   = data.get("tds_deducted",   Decimal("0.00")) or Decimal("0.00")

        if receipt_amount < 0:
            raise serializers.ValidationError({
                "receipt_amount": "Receipt amount cannot be negative."
            })

        if tds_deducted < 0:
            raise serializers.ValidationError({
                "tds_deducted": "TDS deducted cannot be negative."
            })

        if tds_deducted > receipt_amount:
            raise serializers.ValidationError({
                "tds_deducted": "TDS deducted cannot exceed receipt amount."
            })

        return data


# ATTACHMENT SERIALIZER

class BankCashReceiptAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankCashReceiptAttachment
        fields = [
            "id",
            "file",
            "uploaded_by",
            "uploaded_at",
            "description",
        ]
        read_only_fields = ["id", "uploaded_by", "uploaded_at"]


# COMMENT SERIALIZER

class BankCashReceiptCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankCashReceiptComment
        fields = [
            "id",
            "comment",
            "created_by",
            "timestamp",
        ]
        read_only_fields = ["id", "created_by", "timestamp"]


# HISTORY SERIALIZER

class BankCashReceiptHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankCashReceiptHistory
        fields = [
            "id",
            "event_type",
            "action_by",
            "details",
            "timestamp",
        ]
        read_only_fields = ["id", "action_by", "timestamp"]


# READ SERIALIZER

class BankCashReceiptSerializer(serializers.ModelSerializer):
    items        = BankCashReceiptLineItemSerializer(many=True, read_only=True)
    attachments  = BankCashReceiptAttachmentSerializer(many=True, read_only=True)
    comments     = BankCashReceiptCommentSerializer(many=True, read_only=True)
    history      = BankCashReceiptHistorySerializer(many=True, read_only=True)
    created_by   = serializers.StringRelatedField(read_only=True)
    updated_by   = serializers.StringRelatedField(read_only=True)
    cancelled_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankCashReceipt
        fields = '__all__'


# WRITE SERIALIZER

class BankCashReceiptWriteSerializer(serializers.ModelSerializer):
    items = BankCashReceiptLineItemSerializer(many=True, required=False)

    customer = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        required=False,
        allow_null=True
    )
    employee = serializers.PrimaryKeyRelatedField(
        queryset=Candidate.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = BankCashReceipt
        fields = [
            "receipt_date",
            "receipt_mode",
            "receipt_type",
            "payer_type",
            "payer_name",
            "customer",
            "employee",
            "currency",
            "exchange_rate",
            "ar_voucher",
            "invoice_number",
            "invoice_amount",
            "amount_received",
            "tds_deducted",
            "advance_adjustment",
            "bank_account",
            "instrument_type",
            "instrument_number",
            "instrument_date",
            "drawer_bank_name",
            "branch_name",
            "debit_bank_cash_ac",
            "credit_customer_ac",
            "credit_tds_receivable",
            "remarks",
            "status",
            "cancel_reason",
            "items",
        ]
        read_only_fields = [
            "receipt_voucher_no",
            "invoice_date",
            "net_amount_received",
            "outstanding_amount",
        ]

    def validate(self, data):
        payer_type      = data.get("payer_type")
        customer        = data.get("customer")
        employee        = data.get("employee")
        payer_name      = data.get("payer_name", "").strip()
        amount_received = data.get("amount_received", Decimal("0.00"))
        tds_deducted    = data.get("tds_deducted",    Decimal("0.00")) or Decimal("0.00")

        # ── Payer validation ─────────────────────────────────────────────────
        if payer_type == "CUSTOMER" and not customer:
            raise serializers.ValidationError({
                "customer": "Customer is required when payer type is CUSTOMER."
            })

        if payer_type == "EMPLOYEE" and not employee:
            raise serializers.ValidationError({
                "employee": "Employee is required when payer type is EMPLOYEE."
            })

        if payer_type == "OTHER" and not payer_name:
            raise serializers.ValidationError({
                "payer_name": "Payer name is required when payer type is OTHER."
            })

        # ── Amount validation ────────────────────────────────────────────────
        if amount_received < 0:
            raise serializers.ValidationError({
                "amount_received": "Amount received cannot be negative."
            })

        if tds_deducted < 0:
            raise serializers.ValidationError({
                "tds_deducted": "TDS deducted cannot be negative."
            })

        if tds_deducted > amount_received:
            raise serializers.ValidationError({
                "tds_deducted": "TDS deducted cannot exceed amount received."
            })

        return data

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        request    = self.context.get("request")

        receipt = BankCashReceipt.objects.create(
            created_by=request.user if request else None,
            **validated_data
        )

        for item_data in items_data:
            BankCashReceiptLineItem.objects.create(
                receipt=receipt,
                **item_data
            )

        return receipt

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        request    = self.context.get("request")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = request.user if request else None
        instance.save()

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop("id", None)

                # Delete item
                if item_id and item_data.get("delete", False):
                    BankCashReceiptLineItem.objects.filter(
                        id=item_id,
                        receipt=instance
                    ).delete()
                    continue

                # Update item
                if item_id:
                    item = BankCashReceiptLineItem.objects.get(
                        id=item_id,
                        receipt=instance
                    )
                    serializer = BankCashReceiptLineItemSerializer(
                        item,
                        data=item_data,
                        partial=True
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

                # Create new item
                else:
                    BankCashReceiptLineItem.objects.create(
                        receipt=instance,
                        **item_data
                    )

        return instance