from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model
from ..models.expence import (
    ExpenseEntry, ExpenseLineItem, ExpenseAttachment,
    ExpenseComment, ExpenseStatusHistory
)
 
User = get_user_model()
 
class ExpenseLineItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    delete = serializers.BooleanField(write_only=True, required=False)
 
    class Meta:
        model = ExpenseLineItem
        fields = [
            'id', 'delete',
            'item_code', 'description',
            'quantity', 'unit_price', 'amount',
            'tax_rate', 'tax_amount', 'ledger_posting'
        ]
        read_only_fields = ['amount', 'tax_amount']
 
    def validate(self, data):
        # Ensure quantity is positive
        qty = data.get('quantity', getattr(self.instance, 'quantity', 0))
        if qty <= 0:
            raise serializers.ValidationError({"quantity": "Quantity must be greater than zero."})
        return data
 
 
class ExpenseAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)
 
    class Meta:
        model = ExpenseAttachment
        fields = ['id', 'file', 'original_filename', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['uploaded_by', 'uploaded_at']
 
 
 
class ExpenseCommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
 
    class Meta:
        model = ExpenseComment
        fields = ['id', 'comment', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
 
 
class ExpenseStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField(read_only=True)
 
    class Meta:
        model = ExpenseStatusHistory
        fields = ['id', 'status_message', 'changed_by', 'changed_at']
        read_only_fields = ['id', 'changed_by', 'changed_at']
 
 
class ExpenseEntrySerializer(serializers.ModelSerializer):
    line_items = ExpenseLineItemSerializer(many=True, read_only=True)
    attachments = ExpenseAttachmentSerializer(many=True, read_only=True)
    comments = ExpenseCommentSerializer(many=True, read_only=True)
    status_history = ExpenseStatusHistorySerializer(many=True, read_only=True)
 
    class Meta:
        model = ExpenseEntry
        fields = '__all__'
 
 
class ExpenseEntryWriteSerializer(serializers.ModelSerializer):
    line_items = ExpenseLineItemSerializer(many=True, required=False)
 
    class Meta:
        model = ExpenseEntry
        fields = [
            'expense_type', 'vendor_name', 'invoice_number',
            'expense_date', 'tax_components', 'payment_status',
            'payment_method', 'expense_account', 'department',
            'remarks', 'status', 'line_items'
        ]
 
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('line_items', [])
 
        expense = ExpenseEntry.objects.create(
            **validated_data
        )
 
        for item_data in items_data:
            item_data.pop('delete', None)
            ExpenseLineItem.objects.create(expense=expense, **item_data)
 
       
        total_amount = sum(item.amount for item in expense.line_items.all())
        expense.amount = total_amount
        expense.save()
 
        ExpenseStatusHistory.objects.create(
            expense=expense,
            status_message=f"Expense created with status {expense.status}",
            changed_by=self.context['request'].user
        )
 
        return expense
 
    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('line_items', None)
 
       
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
 
        if items_data is not None:
            for item_data in items_data:
                item_id = item_data.pop('id', None)
                delete_flag = item_data.pop('delete', False)
 
                #  DELETE
                if item_id and delete_flag:
                    ExpenseLineItem.objects.filter(id=item_id, expense=instance).delete()
                    continue
 
                # UPDATE
                if item_id:
                    item = ExpenseLineItem.objects.get(id=item_id, expense=instance)
                    serializer = ExpenseLineItemSerializer(item, data=item_data, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
 
                #  CREATE
                else:
                    ExpenseLineItem.objects.create(expense=instance, **item_data)
 
       
        total_amount = sum(item.amount for item in instance.line_items.all())
        instance.amount = total_amount
        instance.save()
 
        ExpenseStatusHistory.objects.create(
            expense=instance,
            status_message=f"Expense updated with status {instance.status}",
            changed_by=self.context['request'].user
        )
 
        return instance