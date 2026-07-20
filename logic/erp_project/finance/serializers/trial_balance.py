from rest_framework import serializers

from ..models.trial_balance import (
    Company,
    TrialBalance,
    TrialBalanceLineItem,
    LedgerEntry,
    TrialBalanceAttachment,
    TrialBalanceComment,
    TrialBalanceHistory,
)


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "company_code",
            "company_name",
            "group_name",
            ]


class LedgerEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerEntry
        fields = "__all__"


class TrialBalanceLineItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    ledger_entries = LedgerEntrySerializer(many=True, read_only=True)

    class Meta:
        model = TrialBalanceLineItem
        fields = "__all__"
        read_only_fields = ["trial_balance"]


class TrialBalanceAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TrialBalanceAttachment
        fields = [
            "trial_balance",
            "file",
            "uploaded_by",
            "uploaded_at",
        ]
        read_only_fields = ["uploaded_by", "uploaded_at"]


class TrialBalanceCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TrialBalanceComment
        fields = [
            "trial_balance",
            "comment ",
            "created_by",
            "timestamp",
        ] 
        read_only_fields = ["created_by"]


class TrialBalanceHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TrialBalanceHistory
        fields = [
            "trial_balance",
            "event_type",
            "action_by",
            "details",
            "timestamp",
        ] 
        read_only_fields = ["action_by"]


class TrialBalanceSerializer(serializers.ModelSerializer):
    line_items = TrialBalanceLineItemSerializer(many=True, read_only=True)
    attachments = TrialBalanceAttachmentSerializer(many=True, read_only=True)
    comments = TrialBalanceCommentSerializer(many=True, read_only=True)
    history = TrialBalanceHistorySerializer(many=True, read_only=True)

    class Meta:
        model = TrialBalance
        fields = "__all__"


class TrialBalanceWriteSerializer(serializers.ModelSerializer):
    line_items = TrialBalanceLineItemSerializer(many=True, required=False)

    class Meta:
        model = TrialBalance
        fields = "__all__"

    def create(self, validated_data):
        line_items_data = validated_data.pop("line_items", [])

        trial_balance = TrialBalance.objects.create(
            **validated_data
        )

        for item in line_items_data:
            TrialBalanceLineItem.objects.create(
                trial_balance=trial_balance,
                **item
            )

        return trial_balance

    def update(self, instance, validated_data):
        line_items_data = validated_data.pop("line_items", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if line_items_data is not None:
            for item_data in line_items_data:
                item_id = item_data.pop("id", None)

                if item_id:
                    item = TrialBalanceLineItem.objects.get(
                        id=item_id,
                        trial_balance=instance
                    )

                    for attr, val in item_data.items():
                        setattr(item, attr, val)

                    item.save()

                else:
                    TrialBalanceLineItem.objects.create(
                        trial_balance=instance,
                        **item_data
                    )

        return instance