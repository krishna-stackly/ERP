from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.paginator import Paginator
 
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response
 
from ..models.expence import (
    ExpenseEntry, ExpenseLineItem, ExpenseAttachment,
    ExpenseComment, ExpenseStatusHistory
)
from ..serializers.expence import (
    ExpenseEntrySerializer, ExpenseEntryWriteSerializer,
    ExpenseAttachmentSerializer, ExpenseCommentSerializer,
    ExpenseStatusHistorySerializer, ExpenseLineItemSerializer
)
 
 
 
class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = ExpenseEntry.objects.select_related(
        'created_by'
    ).prefetch_related('line_items', 'attachments', 'comments', 'status_history').order_by('-expense_date')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
 
    def get_serializer_class(self):
        if self.request.method == "POST":
            return ExpenseEntryWriteSerializer
        return ExpenseEntrySerializer
 
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('limit', 10))
 
        paginator = Paginator(queryset, page_size)
        page = paginator.get_page(page_number)
 
        serializer = self.get_serializer(page, many=True)
 
        from_count = (page.number - 1) * page_size + 1
        to_count = from_count + len(page.object_list) - 1 if page.object_list else 0
 
        return Response({
            "message": "Expenses fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })
 
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return validation_error_response(serializer)
 
        expense_obj = serializer.save()
        return Response({
            "message": "Expense created successfully",
            "data": ExpenseEntrySerializer(expense_obj).data
        }, status=status.HTTP_201_CREATED)
 
 
 
class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExpenseEntry.objects.all()
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'
 
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ExpenseEntrySerializer
        return ExpenseEntryWriteSerializer
 
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Expense fetched successfully",
            "data": serializer.data
        })
 
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
 
        if not serializer.is_valid():
            return validation_error_response(serializer)
 
        self.perform_update(serializer)
        return Response({
            "message": "Expense updated successfully",
            "data": ExpenseEntrySerializer(instance).data
        })
 
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
 
        if instance.status in ['Posted', 'Approved']:
            return Response(
                {"message": f"Cannot delete an expense that is already {instance.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
 
        exp_no = instance.expense_id
        instance.delete()
 
        return Response({
            "message": f"Expense {exp_no} deleted successfully"
        }, status=status.HTTP_200_OK)
 
 
 
class ExpenseActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
 
    def post(self, request, pk):
        expense_obj = get_object_or_404(ExpenseEntry, pk=pk)
        action = request.data.get('action')
 
        valid_actions = ['Draft', 'Submitted', 'Approved', 'Posted', 'Cancelled']
        if action not in valid_actions:
            return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
 
        old_status = expense_obj.status
        expense_obj.status = action
        expense_obj.save()
 
        ExpenseStatusHistory.objects.create(
            expense=expense_obj,
            status_message=f"Status changed from {old_status} to {expense_obj.status}",
            changed_by=request.user
        )
 
        return Response({
            "message": f"Expense status updated to {action}",
            "status": expense_obj.status
        })
 
 
 
class ExpenseCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
 
    def get(self, request, pk):
        expense_obj = get_object_or_404(ExpenseEntry, pk=pk)
        comments = expense_obj.comments.all().order_by('-created_at')
        serializer = ExpenseCommentSerializer(comments, many=True)
        return Response({"data": serializer.data})
 
    def post(self, request, pk):
        expense_obj = get_object_or_404(ExpenseEntry, pk=pk)
        serializer = ExpenseCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(expense=expense_obj, user=request.user)
            return Response({"message": "Comment added", "data": ExpenseCommentSerializer(comment).data}, status=201)
        return validation_error_response(serializer)
 
 
 
class ExpenseAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)
 
    def get(self, request, pk):
        expense_obj = get_object_or_404(ExpenseEntry, pk=pk)
        attachments = expense_obj.attachments.all()
        serializer = ExpenseAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })
 
    def post(self, request, pk):
        expense_obj = get_object_or_404(ExpenseEntry, pk=pk)
        serializer = ExpenseAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
 
        attachment = serializer.save(expense=expense_obj, uploaded_by=request.user)
 
        ExpenseStatusHistory.objects.create(
            expense=expense_obj,
            status_message=f"Attachment uploaded: {attachment.file.name}",
            changed_by=request.user
        )
 
        return Response({
            "message": "Attachment uploaded successfully",
            "data": ExpenseAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)
 
    def delete(self, request, pk, attach_pk):
        expense_obj = get_object_or_404(ExpenseEntry, pk=pk)
        attachment = get_object_or_404(ExpenseAttachment, pk=attach_pk, expense=expense_obj)
 
        file_name = attachment.file.name
        attachment.delete()
 
        ExpenseStatusHistory.objects.create(
            expense=expense_obj,
            status_message=f"Attachment deleted: {file_name}",
            changed_by=request.user
        )
 
        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
 
 
 
class ExpenseHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
 
    def get(self, request, pk):
        expense_obj = get_object_or_404(ExpenseEntry, pk=pk)
        history = expense_obj.status_history.all().order_by('-changed_at')
        serializer = ExpenseStatusHistorySerializer(history, many=True)
        return Response({"data": serializer.data})