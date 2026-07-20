   

from rest_framework import serializers
from django.db import transaction
from ..models.cashflow import *

class CashFlowLineItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = CashFlowLineItem
        exclude = ["cash_flow"]
class CashFlowWriteSerializer(serializers.ModelSerializer):
    items = CashFlowLineItemSerializer(many=True,required=False)

    class Meta:
        model = CashFlow
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items',[])
        cf = CashFlow.objects.create(**validated_data)

        for item in items_data:
            CashFlowLineItem.objects.create(cash_flow=cf, **item)
        cf.calculate_totals()
        cf.save()

        return cf

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if items_data is not None:
            instance.line_items.all().delete()
            for item in items_data:
                CashFlowLineItem.objects.create(cash_flow=instance, **item)
        instance.calculate_totals()   # ✅ ADD HERE ALSO
        instance.save()

        return instance

class CashFlowCommentSerializer(serializers.ModelSerializer):
    comment_by = serializers.StringRelatedField(source="created_by", read_only=True)

    class Meta:
        model = CashFlowComment
        fields = ["id", "comment", "comment_by", "timestamp"]

class CashFlowHistorySerializer(serializers.ModelSerializer):
    action_by_name = serializers.StringRelatedField(source="action_by", read_only=True)

    class Meta:
        model = CashFlowHistory
        fields = ["id", "event_type", "details", "action_by_name", "timestamp"]

class CashFlowAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.StringRelatedField(source="uploaded_by", read_only=True)

    class Meta:
        model = CashFlowAttachment
        fields = ["id", "file", "uploaded_by_name", "uploaded_at"]


class CashFlowDetailSerializer(serializers.ModelSerializer):
    items = CashFlowLineItemSerializer(source="line_items", many=True, read_only=True)
    comments = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    class Meta:
        model = CashFlow
        fields = "__all__"

    def get_comments(self, obj):
         return CashFlowCommentSerializer(
            obj.comments.all(),
            many=True
    ).data
        

    def get_attachments(self, obj):
           return CashFlowAttachmentSerializer(
              obj.attachments.all(),
              many=True
    ).data
        

    def get_history(self, obj):
       return CashFlowHistorySerializer(
           obj.history.all(),
           many=True
    ).data
    
        

class CashFlowSerializer(serializers.ModelSerializer):
    items = CashFlowLineItemSerializer(source='line_items', many=True, read_only=True)

    class Meta:
        model = CashFlow
        fields = '__all__'

    def create(self, validated_data):
        line_items_data = validated_data.pop('line_items', [])

        cashflow = CashFlow.objects.create(**validated_data)

        for item in line_items_data:
            CashFlowLineItem.objects.create(
            cash_flow=cashflow,
            **item
        )
        cashflow.calculate_totals()
        cashflow.save()

        return cashflow