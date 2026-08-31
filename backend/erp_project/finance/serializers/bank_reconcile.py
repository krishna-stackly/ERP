# Bank Reconciliation serializer:


from rest_framework import serializers
from django.db import transaction

from ..models import (
    BankReconciliation,
    BankReconciliationItem,
    BankReconciliationComment,
    BankReconciliationAttachment,
    BankReconciliationHistory
)


class BankReconciliationItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = BankReconciliationItem
        exclude = ['reconciliation']



class BankReconciliationWriteSerializer(serializers.ModelSerializer):

    items = BankReconciliationItemSerializer(
        many=True,
        required=False
    )

    class Meta:
        model = BankReconciliation
        fields = "__all__"

        read_only_fields = [
            'difference_amount',
            'created_by',
            'approved_by'
        ]

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop('items', [])

        reconciliation = BankReconciliation.objects.create(
            **validated_data
        )

        for item in items_data:

            BankReconciliationItem.objects.create(
                reconciliation=reconciliation,
                **item
            )

        return reconciliation

    @transaction.atomic
    def update(self, instance, validated_data):

        items_data = validated_data.pop('items', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if items_data is not None:

            instance.items.all().delete()

            for item in items_data:

                BankReconciliationItem.objects.create(
                    reconciliation=instance,
                    **item
                )

        return instance



class BankReconciliationDetailSerializer(serializers.ModelSerializer):

    items = BankReconciliationItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = BankReconciliation
        fields = "__all__"


class BankReconciliationCommentSerializer(serializers.ModelSerializer):

    comment_by = serializers.StringRelatedField(
        source="created_by",
        read_only=True
    )

    class Meta:
        model = BankReconciliationComment
        fields = [
            "id",
            "comment",
            "comment_by",
            "timestamp"
        ]



class BankReconciliationAttachmentSerializer(serializers.ModelSerializer):

    uploaded_by_name = serializers.StringRelatedField(
        source="uploaded_by",
        read_only=True,
    )

    class Meta:
        model = BankReconciliationAttachment
        fields = [
            "id",
            "file",
            "description",
            "uploaded_by_name",
            "uploaded_at"
        ]


class BankReconciliationHistorySerializer(serializers.ModelSerializer):

    action_by_name = serializers.StringRelatedField(
        source="action_by",
        read_only=True,
    )

    class Meta:
        model = BankReconciliationHistory
        fields = [
            "id",
            "event_type",
            "details",
            "action_by_name",
            "timestamp"
        ]