from rest_framework import serializers
from django.db import transaction
from django.apps import apps

from ..models.contra_voucher import (
    ContraVoucherLineItem,
    ContraVoucherAttachment,
    ContraVoucherComment,
    ContraVoucherHistory,
    Requester,Approver,Preparer
)

ContraVoucher = apps.get_model('finance', 'ContraVoucher')

class RequesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requester
        fields = '__all__'

class ApproverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Approver
        fields = '__all__'


class PreparerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preparer
        fields = '__all__'


class ContraVoucherLineItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    delete = serializers.BooleanField(
        required=False,
        write_only=True,
        default=False
    )

    class Meta:
        model = ContraVoucherLineItem
        fields = [
            'id',
            'account_ledger',
            'debit_amount',
            'credit_amount',
            'instrument_no',
            'bank_name',
            'remarks',
            'delete'
        ]


class ContraVoucherAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ContraVoucherAttachment
        fields = [
            'id',
            'file',
            'uploaded_by',
            'uploaded_at',
            'description'
        ]


class ContraVoucherCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ContraVoucherComment
        fields = [
            'id',
            'comment',
            'created_by',
            'timestamp'
        ]


class ContraVoucherHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ContraVoucherHistory
        fields = [
            'id',
            'event_type',
            'action_by',
            'details',
            'timestamp'
        ]


class ContraVoucherSerializer(serializers.ModelSerializer):
    line_items = ContraVoucherLineItemSerializer(many=True, read_only=True)
    attachments = ContraVoucherAttachmentSerializer(many=True, read_only=True)
    comments = ContraVoucherCommentSerializer(many=True, read_only=True)
    history = ContraVoucherHistorySerializer(many=True, read_only=True)

    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ContraVoucher
        fields = '__all__'

        read_only_fields = [
            'contra_id',
            'created_at',
            'updated_at'
        ]


class ContraVoucherWriteSerializer(serializers.ModelSerializer):
    line_items = ContraVoucherLineItemSerializer(
        many=True,
        required=False,
        allow_empty=True
    )

    class Meta:
        model = ContraVoucher
        fields = [
            'voucher_date',
            'posting_date',
            'reference_no',
            'transaction_type',
            'prepared_by',
            'approved_by',
            'narration',
            'status',
            'line_items'
        ]

        read_only_fields = [
            'contra_id'
        ]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('line_items', [])
        user = self.context['request'].user

        voucher = ContraVoucher.objects.create(
            created_by=user,
            updated_by=user,
            **validated_data
        )

        for item_data in items_data:
            delete_flag = item_data.pop('delete', False)
            if not delete_flag:
                ContraVoucherLineItem.objects.create(
                    voucher=voucher,
                    **item_data
                )

        ContraVoucherHistory.objects.create(
            voucher=voucher,
            event_type='Created',
            action_by=user,
            details=f"Contra Voucher created with {len(items_data)} items."
        )

        return voucher

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('line_items', None)
        user = self.context['request'].user

        if instance.status in ['Posted', 'Cancelled'] and items_data is not None:
            raise serializers.ValidationError({
                "status": f"Cannot modify items because the voucher is already {instance.status}."
            })

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = user
        instance.save()

        if items_data is not None:
            existing_items = {item.id: item for item in instance.line_items.all()}
            keep_item_ids = []

            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)

                if item_id and item_id in existing_items:
                    item = existing_items[item_id]
                    if delete_flag:
                        item.delete()
                        continue
                    for it_attr, it_val in item_data.items():
                        setattr(item, it_attr, it_val)
                    item.save()
                    keep_item_ids.append(item.id)
                else:
                    if not delete_flag:
                        new_item = ContraVoucherLineItem.objects.create(
                            voucher=instance,
                            **item_data
                        )
                        keep_item_ids.append(new_item.id)

            instance.line_items.exclude(id__in=keep_item_ids).delete()

        ContraVoucherHistory.objects.create(
            voucher=instance,
            event_type='Updated',
            action_by=user,
            details="Contra Voucher header updated and line items synchronized."
        )

        return instance
