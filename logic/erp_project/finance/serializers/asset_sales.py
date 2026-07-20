from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model

from ..models.asset_sales import (
    AssetSale,
    AssetSaleBuyer,
    AssetSaleApprover,
    AssetSaleItem,
    AssetSaleAttachment,
    AssetSaleComment,
    AssetSaleHistory
)

from masters.models import (
    Branch,
    Department,
    Product
)

from masters.serializers import (
    BranchSerializer,
    DepartmentDropdownSerializer,
    ProductSerializer
)

User = get_user_model()


# =========================================================
# BUYER SERIALIZER
# =========================================================

class AssetSaleBuyerSerializer(serializers.ModelSerializer):

    class Meta:
        model = AssetSaleBuyer
        fields = '__all__'


# =========================================================
# APPROVER SERIALIZER
# =========================================================

class AssetSaleApproverSerializer(serializers.ModelSerializer):

    approver_name_display = serializers.StringRelatedField(
        source='approver_name',
        read_only=True
    )

    class Meta:
        model = AssetSaleApprover
        fields = [
            'id',
            'employee_id',
            'approver_role',
            'approver_name',
            'approver_name_display',
            'role',
            'approval_level'
        ]


# =========================================================
# ITEM SERIALIZER
# =========================================================

class AssetSaleItemSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=False)

    delete = serializers.BooleanField(
        write_only=True,
        required=False
    )

    class Meta:
        model = AssetSaleItem
        fields = [
            'id',
            'delete',
            'asset_id',
            'asset_name',
            'original_cost',
            'accumulated_depreciation',
            'nbv',
            'asset_condition',
            'sale_value',
            'mode_of_sale'
        ]
        read_only_fields = ['nbv']

    def validate(self, data):

        original_cost = data.get('original_cost', 0)
        accumulated_depreciation = data.get('accumulated_depreciation', 0)

        if accumulated_depreciation > original_cost:
            raise serializers.ValidationError({
                "accumulated_depreciation":
                "Accumulated depreciation cannot exceed original cost."
            })

        return data


# =========================================================
# ATTACHMENT SERIALIZER
# =========================================================

class AssetSaleAttachmentSerializer(serializers.ModelSerializer):

    uploaded_by = serializers.StringRelatedField(
        read_only=True
    )

    class Meta:
        model = AssetSaleAttachment
        fields = [
            'id',
            'file',
            'uploaded_by',
            'uploaded_at'
        ]
        read_only_fields = [
            'uploaded_by',
            'uploaded_at'
        ]


# =========================================================
# COMMENT SERIALIZER
# =========================================================

class AssetSaleCommentSerializer(serializers.ModelSerializer):

    created_by = serializers.StringRelatedField(
        read_only=True
    )

    class Meta:
        model = AssetSaleComment
        fields = [
            'id',
            'comment',
            'created_by',
            'timestamp'
        ]
        read_only_fields = [
            'id',
            'timestamp',
            'created_by'
        ]


# =========================================================
# HISTORY SERIALIZER
# =========================================================

class AssetSaleHistorySerializer(serializers.ModelSerializer):

    action_by = serializers.StringRelatedField(
        read_only=True
    )

    class Meta:
        model = AssetSaleHistory
        fields = [
            'id',
            'event_type',
            'action_by',
            'details',
            'timestamp'
        ]
        read_only_fields = [
            'id',
            'timestamp',
            'action_by'
        ]


# =========================================================
# READ SERIALIZER
# =========================================================

class AssetSaleSerializer(serializers.ModelSerializer):

    items = AssetSaleItemSerializer(
        many=True,
        read_only=True
    )

    attachments = AssetSaleAttachmentSerializer(
        many=True,
        read_only=True
    )

    comments = AssetSaleCommentSerializer(
        many=True,
        read_only=True
    )

    history = AssetSaleHistorySerializer(
        many=True,
        read_only=True
    )

    department = DepartmentDropdownSerializer(
        read_only=True
    )

    approved_by = serializers.StringRelatedField(
        read_only=True
    )

    requested_by = serializers.StringRelatedField(
        read_only=True
    )

    created_by = serializers.StringRelatedField(
        read_only=True
    )

    updated_by = serializers.StringRelatedField(
        read_only=True
    )

    class Meta:
        model = AssetSale
        fields = '__all__'


# =========================================================
# WRITE SERIALIZER
# =========================================================

class AssetSaleWriteSerializer(serializers.ModelSerializer):

    items = AssetSaleItemSerializer(
        many=True,
        required=False
    )

    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        required=False,
        allow_null=True
    )

    requested_by = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    approved_by = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = AssetSale
        fields = [
            'date',
            'department',
            'requested_by',

            'asset_id',
            'asset_name',
            'original_cost',
            'accumulated_depreciation',
            'net_book_value',
            'asset_condition',

            'buyer_name',
            'sale_date',
            'sale_value',
            'mode_of_sale',
            'invoice_no',

            'gain_loss_on_sale',
            'reason_for_sale',

            'approved_by',
            'remarks',

            'status',

            'items'
        ]

    def validate(self, data):

        original_cost = data.get('original_cost', 0)
        accumulated_depreciation = data.get('accumulated_depreciation', 0)

        if accumulated_depreciation > original_cost:
            raise serializers.ValidationError({
                "accumulated_depreciation":
                "Accumulated depreciation cannot exceed original cost."
            })

        return data

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop('items', [])

        asset_sale = AssetSale.objects.create(
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
            **validated_data
        )

        for item_data in items_data:

            item_data.pop('delete', None)

            AssetSaleItem.objects.create(
                asset_sale=asset_sale,
                **item_data
            )

        AssetSaleHistory.objects.create(
            asset_sale=asset_sale,
            event_type='Created',
            action_by=self.context['request'].user,
            details='Asset Sale created.'
        )

        return asset_sale

    @transaction.atomic
    def update(self, instance, validated_data):

        items_data = validated_data.pop('items', None)

        # =============================================
        # UPDATE MAIN FIELDS
        # =============================================

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user

        instance.save()

        # =============================================
        # HANDLE ITEMS
        # =============================================

        if items_data is not None:

            for item_data in items_data:

                item_id = item_data.pop('id', None)

                delete_flag = item_data.pop('delete', False)

                # =====================================
                # DELETE
                # =====================================

                if item_id and delete_flag:

                    AssetSaleItem.objects.filter(
                        id=item_id,
                        asset_sale=instance
                    ).delete()

                    continue

                # =====================================
                # UPDATE
                # =====================================

                if item_id:

                    item = AssetSaleItem.objects.get(
                        id=item_id,
                        asset_sale=instance
                    )

                    serializer = AssetSaleItemSerializer(
                        item,
                        data=item_data,
                        partial=True
                    )

                    serializer.is_valid(raise_exception=True)

                    serializer.save()

                # =====================================
                # CREATE
                # =====================================

                else:

                    AssetSaleItem.objects.create(
                        asset_sale=instance,
                        **item_data
                    )

        # =============================================
        # HISTORY
        # =============================================

        AssetSaleHistory.objects.create(
            asset_sale=instance,
            event_type='Updated',
            action_by=self.context['request'].user,
            details='Asset Sale updated.'
        )

        return instance