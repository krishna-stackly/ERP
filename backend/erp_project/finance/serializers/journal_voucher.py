from rest_framework import serializers
from django.db import transaction
from django.db.models import Sum
from decimal import Decimal
from ..models.journal_voucher import(
    JournalVoucher, 
    JournalVoucherApprover, 
    JournalVoucherItem,
    JournalVoucherHistory,
    JournalVoucherComment,
    JournalVoucherAttachment
)


class JournalVoucherApproverSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = JournalVoucherApprover
        fields = [
            "id",
            # "user",
            "user_name",
            "role",
            "department",
            "email",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]



class JournalVoucherItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = JournalVoucherItem
        fields = [
            "id",
            "account_ledger",
            "debit",
            "credit",
            "cost_center",
            "narration",
        ]

    def validate(self, data):
        debit  = data.get("debit",  Decimal("0"))
        credit = data.get("credit", Decimal("0"))

        if debit < 0:
            raise serializers.ValidationError({
                "debit": "Debit amount cannot be negative."
            })

        if credit < 0:
            raise serializers.ValidationError({
                "credit": "Credit amount cannot be negative."
            })

        # if debit == 0 and credit == 0:
        #     raise serializers.ValidationError(
        #         "Either debit or credit amount must be greater than zero."
        #     )

        # if debit > 0 and credit > 0:
        #     raise serializers.ValidationError(
        #         "A line item cannot have both debit and credit amounts."
        #     )

        return data        
    


class JournalVoucherAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = JournalVoucherAttachment
        fields = [
            "id",
            "file",
            "uploaded_by",
            "uploaded_at",
            "description",
        ]
        read_only_fields = ["id", "uploaded_by", "uploaded_at"]    
    


class JournalVoucherCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = JournalVoucherComment
        fields = [
            "id",
            "comment",
            "created_by",
            "timestamp",
        ]
        read_only_fields = ["id", "created_by", "timestamp"]


class JournalVoucherHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = JournalVoucherHistory
        fields = [
            "id",
            "event_type",
            "action_by",
            "details",
            "timestamp",
        ]
        read_only_fields = ["id", "action_by", "timestamp"]


class JournalVoucherSerializer(serializers.ModelSerializer):
    items       = JournalVoucherItemSerializer(many=True, read_only=True)
    attachments = JournalVoucherAttachmentSerializer(many=True, read_only=True)
    comments    = JournalVoucherCommentSerializer(many=True, read_only=True)
    history     = JournalVoucherHistorySerializer(many=True, read_only=True)
    prepared_by = serializers.StringRelatedField(read_only=True)
    approved_by = JournalVoucherApproverSerializer(read_only=True)
    created_by  = serializers.StringRelatedField(read_only=True)
    updated_by  = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = JournalVoucher
        fields = [
            "id",
            "journal_voucher_no",
            "voucher_date",
            "posting_date",
            "reference_no",
            "narration",
            "journal_type",
            "prepared_by",
            "approved_by",
            "status",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
            "items",
            "attachments",
            "comments",
            "history",
        ]
        read_only_fields = [
            "id",
            "journal_voucher_no",
            "created_at",
            "updated_at",
        ]


class JournalVoucherWriteSerializer(serializers.ModelSerializer):
    items = JournalVoucherItemSerializer(many=True, required=False)
 
    class Meta:
        model = JournalVoucher
        fields = [
            "voucher_date",
            "posting_date",
            "reference_no",
            "narration",
            "journal_type",
            "prepared_by",
            "approved_by",
            "status",
            "items",
        ]
        read_only_fields = [
            "journal_voucher_no",
        ]
 
    def validate(self, data):
        items = data.get("items", [])
 
        total_debit  = sum(item.get("debit",  Decimal("0")) for item in items)
        total_credit = sum(item.get("credit", Decimal("0")) for item in items)
 
        if items and total_debit != total_credit:
            raise serializers.ValidationError({
                "items": f"Total debit ({total_debit}) must equal total credit ({total_credit}). Journal entry must balance."
            })
 
        return data
 
    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        request    = self.context.get("request")
 
        voucher = JournalVoucher.objects.create(
            created_by=request.user if request else None,
            **validated_data
        )
 
        for item_data in items_data:
            JournalVoucherItem.objects.create(
                journal_voucher=voucher,
                **item_data
            )
 
        return voucher
 
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
                    JournalVoucherItem.objects.filter(
                        id=item_id,
                        journal_voucher=instance
                    ).delete()
                    continue
 
                # Update item
                if item_id:
                    item = JournalVoucherItem.objects.get(
                        id=item_id,
                        journal_voucher=instance
                    )
                    serializer = JournalVoucherItemSerializer(
                        item,
                        data=item_data,
                        partial=True
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
 
                # Create new item
                else:
                    JournalVoucherItem.objects.create(
                        journal_voucher=instance,
                        **item_data
                    )
 
        return instance
