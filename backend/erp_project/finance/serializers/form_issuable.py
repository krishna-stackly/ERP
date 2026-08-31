from rest_framework import serializers
from django.db import transaction

from ..models.form_issuable import (
    Department,
    RequestedBy,
    ApprovedBy,
    WarehouseDet,
    BatchNo,
    FormIssuable,
    FormIssuableItem,
    FormIssuableAttachment,
    FormIssuableComment,
    FormIssuableHistory
)


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class RequestedBySerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(
        source='department.dept_name',
        read_only=True
    )

    class Meta:
        model = RequestedBy
        fields = '__all__'


class ApprovedBySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovedBy
        fields = '__all__'


class WarehouseDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseDet
        fields = '__all__'


class BatchNoSerializer(serializers.ModelSerializer):
    warehouse_name = serializers.CharField(
        source='warehouse.warehouse_name',
        read_only=True
    )

    class Meta:
        model = BatchNo
        fields = '__all__'


class FormIssuableItemSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=False)

    delete = serializers.SerializerMethodField(read_only=True)

    batch = serializers.PrimaryKeyRelatedField(
        queryset=BatchNo.objects.all()
    )

    warehouse = serializers.PrimaryKeyRelatedField(
        queryset=WarehouseDet.objects.all()
    )

    batch_no_display = serializers.CharField(
        source='batch.batch_no',
        read_only=True
    )

    warehouse_name_display = serializers.CharField(
        source='warehouse.warehouse_name',
        read_only=True
    )

    class Meta:
        model = FormIssuableItem
        fields = [
            'id',
            'item_code',
            'item_name',
            'uom',
            'required_qty',
            'issued_qty',
            'available_stock',
            'batch',
            'batch_no_display',
            'warehouse',
            'warehouse_name_display',
            'delete'
        ]

    def get_delete(self, obj):
        return False

    def validate(self, data):

        available = data.get('available_stock', 0)
        issued = data.get('issued_qty', 0)

        if issued > available:
            raise serializers.ValidationError({
                "issued_qty": "Issued quantity cannot exceed available stock"
            })

        return data


class FormIssuableAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FormIssuableAttachment
        fields = [
            'id',
            'file',
            'uploaded_by',
            'uploaded_at',
            'description'
        ]


class FormIssuableCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FormIssuableComment
        fields = [
            'id',
            'comment',
            'created_by',
            'timestamp'
        ]


class FormIssuableHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FormIssuableHistory
        fields = [
            'id',
            'event_type',
            'action_by',
            'details',
            'timestamp'
        ]


class FormIssuableSerializer(serializers.ModelSerializer):
    items = FormIssuableItemSerializer(many=True, read_only=True)
    attachments = FormIssuableAttachmentSerializer(many=True, read_only=True)
    comments = FormIssuableCommentSerializer(many=True, read_only=True)
    history = FormIssuableHistorySerializer(many=True, read_only=True)

    department = serializers.StringRelatedField()
    requested_by = serializers.StringRelatedField()
    approved_by = serializers.StringRelatedField()
    created_by = serializers.StringRelatedField()

    class Meta:
        model = FormIssuable
        fields = '__all__'
        read_only_fields = [
            'generated_on',
            'formissue_no',
            'created_at',
            'updated_at'
        ]


class FormIssuableWriteSerializer(serializers.ModelSerializer):

    items = FormIssuableItemSerializer(
        many=True,
        required=False,
        allow_empty=True
    )

    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all()
    )

    requested_by = serializers.PrimaryKeyRelatedField(
        queryset=RequestedBy.objects.all()
    )

    approved_by = serializers.PrimaryKeyRelatedField(
        queryset=ApprovedBy.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = FormIssuable
        fields = [
            'date',
            'job_order_no',
            'department',
            'requested_by',
            'approved_by',
            'remarks',
            'status',
            'items'
        ]

        read_only_fields = ['formissue_no']

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop('items', [])

        user = self.context['request'].user

        form_issue = FormIssuable.objects.create(
            created_by=user,
            **validated_data
        )

        for item_data in items_data:

            item_data.pop('delete', False)

            FormIssuableItem.objects.create(
                form_issuable=form_issue,
                **item_data
            )

        FormIssuableHistory.objects.create(
            form_issuable=form_issue,
            event_type='Created',
            action_by=user,
            details=f'Form created with {len(items_data)} items'
        )

        return form_issue

    @transaction.atomic
    def update(self, instance, validated_data):

        items_data = validated_data.pop('items', None)

        user = self.context['request'].user

        if instance.status in ['Posted', 'Cancelled'] and items_data is not None:
            raise serializers.ValidationError({
                "status": f"Cannot modify items because form is already {instance.status}"
            })

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if items_data is not None:

            existing_items = {
                item.id: item
                for item in instance.items.all()
            }

            keep_item_ids = []

            for item_data in items_data:

                item_id = item_data.pop('id', None)

                delete_flag =  False

                if item_id and item_id in existing_items:

                    item = existing_items[item_id]

                    if delete_flag:
                        item.delete()
                        continue

                    for attr, value in item_data.items():
                        setattr(item, attr, value)

                    item.save()

                    keep_item_ids.append(item.id)

                else:

                    if not delete_flag:

                        new_item = FormIssuableItem.objects.create(
                            form_issuable=instance,
                            **item_data
                        )

                        keep_item_ids.append(new_item.id)

            instance.items.exclude(id__in=keep_item_ids).delete()

        FormIssuableHistory.objects.create(
            form_issuable=instance,
            event_type='Updated',
            action_by=user,
            details='Form updated successfully'
        )

        return instance