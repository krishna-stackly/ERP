from rest_framework import serializers
from django.db import transaction
from django.apps import apps

from ..models import (
    RevenueLineItem,
    RevenueAttachment,
    RevenueComment,
    RevenueHistory
)

Revenue = apps.get_model('finance', 'Revenue')


class RevenueLineItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    delete = serializers.BooleanField(
        required=False,
        write_only=True,
        default=False
    )

    class Meta:
        model = RevenueLineItem
        fields = [
            'id',
            'product',
            'item_code',
            'description',
            'quantity',
            'unit_price',
            'amount',
            'tax_type',
            'tax_rate',
            'tax_amount',
            'ledger_posting',
            'delete'
        ]

        read_only_fields = ['amount', 'tax_amount']


class RevenueAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = RevenueAttachment
        fields = [
            'id',
            'file',
            'uploaded_by',
            'uploaded_at',
            'description'
        ]


class RevenueCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = RevenueComment
        fields = [
            'id',
            'comment',
            'created_by',
            'timestamp'
        ]


class RevenueHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = RevenueHistory
        fields = [
            'id',
            'event_type',
            'action_by',
            'details',
            'timestamp'
        ]


class RevenueSerializer(serializers.ModelSerializer):
    line_items = RevenueLineItemSerializer(many=True, read_only=True)
    attachments = RevenueAttachmentSerializer(many=True, read_only=True)
    comments = RevenueCommentSerializer(many=True, read_only=True)
    history = RevenueHistorySerializer(many=True, read_only=True)

    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    gst_summary = serializers.SerializerMethodField()
    vat_summary = serializers.SerializerMethodField()
    tds_summary = serializers.SerializerMethodField()

    class Meta:
        model = Revenue
        fields = '__all__'

        read_only_fields = [
            'revenue_id',
            'amount',
            'created_at',
            'updated_at'
        ]

    def get_gst_summary(self, obj):
        return obj.gst_split_summary()

    def get_vat_summary(self, obj):
        return obj.vat_summary()

    def get_tds_summary(self, obj):
        return obj.tds_summary()


class RevenueWriteSerializer(serializers.ModelSerializer):
    line_items = RevenueLineItemSerializer(
        many=True,
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Revenue

        fields = [
            'revenue_type',
            'customer',
            'invoice',
            'sales_order',
            'branch',
            'revenue_date',
            'tax_type',
            'gst_rate',
            'payment_received',
            'payment_method',
            'payment_status',
            'ledger_posting',
            'remarks',
            'status',
            'line_items'
        ]

        read_only_fields = [
            'revenue_id',
            'amount'
        ]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('line_items', [])
        user = self.context['request'].user

        revenue = Revenue.objects.create(
            created_by=user,
            updated_by=user,
            **validated_data
        )

        for item_data in items_data:
            delete_flag = item_data.pop('delete', False)

            if not delete_flag:
                RevenueLineItem.objects.create(
                    revenue=revenue,
                    **item_data
                )

        revenue.update_totals()

        RevenueHistory.objects.create(
            revenue=revenue,
            event_type='Created',
            action_by=user,
            details=f"Revenue created with {len(items_data)} items."
        )

        return revenue

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('line_items', None)
        user = self.context['request'].user

        if instance.status in ['Posted', 'Cancelled'] and items_data is not None:
            raise serializers.ValidationError({
                "status": f"Cannot modify items because the revenue is already {instance.status}."
            })

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = user
        instance.save()

        if items_data is not None:
            existing_items = {
                item.id: item
                for item in instance.line_items.all()
            }

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
                        new_item = RevenueLineItem.objects.create(
                            revenue=instance,
                            **item_data
                        )

                        keep_item_ids.append(new_item.id)

            instance.line_items.exclude(
                id__in=keep_item_ids
            ).delete()

        instance.update_totals()

        RevenueHistory.objects.create(
            revenue=instance,
            event_type='Updated',
            action_by=user,
            details="Revenue header updated and line items synchronized."
        )

        return instance