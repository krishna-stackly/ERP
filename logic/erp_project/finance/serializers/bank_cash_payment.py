
from rest_framework import serializers
from django.utils import timezone
from decimal import Decimal
from ..models.bank_cash_payment import (
    BankCashPaymentItem,
    BankCashPaymentAttachment,
    BankCashPaymentComment,
    BankCashPaymentHistory,
    BankCashPayment,
)

class BankCashPaymentItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = BankCashPaymentItem
        fields = [
            "id",
            "ar_voucher",
            "invoice_number",
            "invoice_date",
            "vendor_name",
            "invoice_amount",
            "payment_amount",
            "tds_deducted",
            "net_amount",
            "outstanding_amount",
        ]
        read_only_fields = [
            "invoice_number",
            "invoice_date",
            "net_amount",
            "outstanding_amount",
        ]

    def validate(self, data):
        payment_amount = data.get("payment_amount", Decimal("0.00"))
        tds_deducted   = data.get("tds_deducted", Decimal("0.00")) or Decimal("0.00")

        if payment_amount < 0:
            raise serializers.ValidationError({
                "payment_amount": "Payment amount cannot be negative."
            })

        if tds_deducted < 0:
            raise serializers.ValidationError({
                "tds_deducted": "TDS deducted cannot be negative."
            })

        if tds_deducted > payment_amount:
            raise serializers.ValidationError({
                "tds_deducted": "TDS deducted cannot exceed payment amount."
            })

        return data
    

class BankCashPaymentAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankCashPaymentAttachment
        fields = [
            "id",
            "file",
            "uploaded_by",
            "uploaded_at",
            "description",
        ]
        read_only_fields = ["id", "uploaded_by", "uploaded_at"]    


class BankCashPaymentCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankCashPaymentComment
        fields = [
            "id",
            "comment",
            "created_by",
            "timestamp",
        ]
        read_only_fields = ["id", "created_by", "timestamp"]



class BankCashPaymentHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankCashPaymentHistory
        fields = [
            "id",
            "event_type",
            "action_by",
            "details",
            "timestamp",
        ]
        read_only_fields = ["id", "action_by", "timestamp"]


class BankCashPaymentSerializer(serializers.ModelSerializer):
    items       = BankCashPaymentItemSerializer(many=True, read_only=True)
    attachments = BankCashPaymentAttachmentSerializer(many=True, read_only=True)
    comments    = BankCashPaymentCommentSerializer(many=True, read_only=True)
    history     = BankCashPaymentHistorySerializer(many=True, read_only=True)
    created_by  = serializers.StringRelatedField(read_only=True)
    updated_by  = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankCashPayment
        fields = '__all__'


class BankCashPaymentWriteSerializer(serializers.ModelSerializer):
    items = BankCashPaymentItemSerializer(many=True, required=False)

    class Meta:
        model = BankCashPayment
        fields = [
            "payment_date",
            "payment_mode",
            "payment_type",
            "payee_type",
            "payee_name",
            "currency",
            "exchange_rate",
            "ar_voucher",
            "invoice_number",
            
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
            "credit_tds_payable",
            "remarks",
            "status",
            "items",
        ]
        read_only_fields = [
            "payment_voucher_no",
            "invoice_date",
            "net_amount_received",
            "outstanding_amount",
        ]

    def validate(self, data):
        payee_type     = data.get("payee_type")
        payee_name     = data.get("payee_name", "").strip()
        amount_received = data.get("amount_received", Decimal("0.00"))
        tds_deducted    = data.get("tds_deducted", Decimal("0.00")) or Decimal("0.00")

        # ── Payee validation ─────────────────────────────────────────────────
        if payee_type == "OTHER" and not payee_name:
            raise serializers.ValidationError({
                "payee_name": "Payee name is required when payee type is OTHER."
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

        payment = BankCashPayment.objects.create(
            created_by=request.user if request else None,
            **validated_data
        )

        for item_data in items_data:
            BankCashPaymentItem.objects.create(
                payment=payment,
                **item_data
            )

        return payment

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        request    = self.context.get("request")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = request.user if request else None
        instance.updated_at = timezone.now()
        instance.save()

        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop("id", None)

                # Delete item
                if item_id and item_data.get("delete", False):
                    BankCashPaymentItem.objects.filter(
                        id=item_id,
                        payment=instance
                    ).delete()
                    continue

                # Update item
                if item_id:
                    item = BankCashPaymentItem.objects.get(
                        id=item_id,
                        payment=instance
                    )
                    serializer = BankCashPaymentItemSerializer(
                        item,
                        data=item_data,
                        partial=True
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

                # Create new item
                else:
                    BankCashPaymentItem.objects.create(
                        payment=instance,
                        **item_data
                    )

        return instance