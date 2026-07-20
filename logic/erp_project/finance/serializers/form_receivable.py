from rest_framework import serializers
from django.db import transaction
from ..models.form_receivable import (
    form_receivable_Department, form_receivable_Supplier, form_receivable_RequestedBy,
    form_receivable_ApprovedBy, form_receivable_WarehouseDet, form_receivable_BatchNo
)
from ..models.form_receivable import (
    FormReceivable, FormReceivableItem,
    FormReceivableAttachment, FormReceivableComment,
    FormReceivableHistory
)


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = form_receivable_Department
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = form_receivable_Supplier
        fields = '__all__'


class RequestedBySerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.dept_name', read_only=True)

    class Meta:
        model = form_receivable_RequestedBy
        fields = '__all__'


class ApprovedBySerializer(serializers.ModelSerializer):
    class Meta:
        model =form_receivable_ApprovedBy
        fields = '__all__'


class WarehouseDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = form_receivable_WarehouseDet
        fields = '__all__'


class BatchNoSerializer(serializers.ModelSerializer):
    warehouse_name = serializers.CharField(source='warehouse.warehouse_name', read_only=True)

    class Meta:
        model = form_receivable_BatchNo
        fields = '__all__'


class FormReceivableItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    delete = serializers.BooleanField(required=False, default=False)

    batch = serializers.PrimaryKeyRelatedField(queryset=form_receivable_BatchNo.objects.all(), allow_null=True, required=False)
    warehouse = serializers.PrimaryKeyRelatedField(queryset=form_receivable_WarehouseDet.objects.all())

    batch_no_display = serializers.CharField(source='batch.batch_no', read_only=True)
    warehouse_name_display = serializers.CharField(source='warehouse.warehouse_name', read_only=True)

    class Meta:
        model = FormReceivableItem
        fields = [
            'id', 'item_code', 'item_name', 'uom',
            'ordered_qty', 'received_qty', 'rejected_qty',
            'warehouse', 'warehouse_name_display',
            'batch', 'batch_no_display',
            'delete'
        ]


class FormReceivableAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FormReceivableAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']


class FormReceivableCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FormReceivableComment
        fields = ['id', 'comment', 'created_by', 'timestamp']


class FormReceivableHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = FormReceivableHistory
        fields = ['id', 'event_type', 'action_by', 'details', 'timestamp']


class FormReceivableSerializer(serializers.ModelSerializer):
    items = FormReceivableItemSerializer(many=True, read_only=True)
    attachments = FormReceivableAttachmentSerializer(many=True, read_only=True)
    comments = FormReceivableCommentSerializer(many=True, read_only=True)
    history = FormReceivableHistorySerializer(many=True, read_only=True)

    supplier = serializers.StringRelatedField()
    requested_by = serializers.StringRelatedField()
    approved_by = serializers.StringRelatedField()
    department = serializers.StringRelatedField()
    created_by = serializers.StringRelatedField()

    class Meta:
        model = FormReceivable
        fields = '__all__'
        read_only_fields = ['generated_on', 'formreceipt_no', 'created_at', 'updated_at']


class FormReceivableWriteSerializer(serializers.ModelSerializer):
    items = FormReceivableItemSerializer(many=True, required=False, allow_empty=True)
    supplier = serializers.PrimaryKeyRelatedField(queryset=form_receivable_Supplier.objects.all())
    requested_by = serializers.PrimaryKeyRelatedField(queryset=form_receivable_RequestedBy.objects.all())
    approved_by = serializers.PrimaryKeyRelatedField(queryset=form_receivable_ApprovedBy.objects.all(), required=False, allow_null=True)
    department = serializers.PrimaryKeyRelatedField(queryset=form_receivable_Department.objects.all())

    class Meta:
        model = FormReceivable
        fields = [
            'date', 'purchase_order_no', 'supplier',
            'requested_by', 'approved_by', 'department',
            'remarks', 'status', 'items'
        ]
        read_only_fields = ['formreceipt_no']

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        user = self.context['request'].user

        form_receivable = FormReceivable.objects.create(
            created_by=user,
            **validated_data
        )

        for item_data in items_data:
            delete_flag = item_data.pop('delete', False)
            if not delete_flag:
                FormReceivableItem.objects.create(form_receivable=form_receivable, **item_data)

        FormReceivableHistory.objects.create(
            form_receivable=form_receivable,
            event_type='Created',
            action_by=user,
            details=f"Form Receivable created with {len(items_data)} items."
        )

        return form_receivable

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        user = self.context['request'].user

        if instance.status in ['Posted', 'Cancelled'] and items_data is not None:
            raise serializers.ValidationError({
                "status": f"Cannot modify items because the form is already {instance.status}."
            })

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            existing_items = {item.id: item for item in instance.items.all()}
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
                        new_item = FormReceivableItem.objects.create(form_receivable=instance, **item_data)
                        keep_item_ids.append(new_item.id)

            instance.items.exclude(id__in=keep_item_ids).delete()

        FormReceivableHistory.objects.create(
            form_receivable=instance,
            event_type='Updated',
            action_by=user,
            details="Form header updated and line items synchronized."
        )

        return instance
