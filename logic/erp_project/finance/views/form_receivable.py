from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.paginator import Paginator

from ..models.form_receivable import (
    form_receivable_Department,form_receivable_Supplier,
    form_receivable_RequestedBy,form_receivable_ApprovedBy,
    form_receivable_WarehouseDet, form_receivable_BatchNo
)


from ..serializers.form_receivable import (
    DepartmentSerializer, SupplierSerializer,
    RequestedBySerializer, ApprovedBySerializer,
    WarehouseDetSerializer,BatchNoSerializer,
    FormReceivableSerializer, FormReceivableWriteSerializer,
    FormReceivableAttachmentSerializer, FormReceivableCommentSerializer,
    FormReceivableHistorySerializer
)

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from ..models.form_receivable import (
    FormReceivable, FormReceivableItem,
    FormReceivableAttachment, FormReceivableComment,
    FormReceivableHistory
)



class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset =form_receivable_Department.objects.all()
    serializer_class = DepartmentSerializer

class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset =form_receivable_Department.objects.all()
    serializer_class = DepartmentSerializer


class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = form_receivable_Supplier.objects.all()
    serializer_class = SupplierSerializer

class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = form_receivable_Supplier.objects.all()
    serializer_class = SupplierSerializer


class RequestedByListCreateView(generics.ListCreateAPIView):
    queryset = form_receivable_RequestedBy.objects.all()
    serializer_class = RequestedBySerializer

class RequestedByDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = form_receivable_RequestedBy.objects.all()
    serializer_class = RequestedBySerializer


class ApprovedByListCreateView(generics.ListCreateAPIView):
    queryset = form_receivable_ApprovedBy.objects.all()
    serializer_class = ApprovedBySerializer

class ApprovedByDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = form_receivable_ApprovedBy.objects.all()
    serializer_class = ApprovedBySerializer
    
    
class WarehouseDetListCreateView(generics.ListCreateAPIView):
    queryset = form_receivable_WarehouseDet.objects.all()
    serializer_class = WarehouseDetSerializer
    


class WarehouseDetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = form_receivable_WarehouseDet.objects.all()
    serializer_class = WarehouseDetSerializer
    

class BatchNoListCreateView(generics.ListCreateAPIView):
    queryset = form_receivable_WarehouseDet.objects.all()
    serializer_class =  BatchNoSerializer
    
    

class BatchNoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = form_receivable_BatchNo.objects.all()
    serializer_class = BatchNoSerializer



class FormReceivableListCreateView(generics.ListCreateAPIView):
    queryset = FormReceivable.objects.select_related(
        'supplier', 'requested_by', 'approved_by', 'department', 'created_by'
    ).order_by('-generated_on')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return FormReceivableWriteSerializer
        return FormReceivableSerializer

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
            "message": "Form Receivables fetched successfully",
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
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        form_obj = serializer.save()
        return Response({
            "message": "Form Receivable created successfully",
            "data": FormReceivableSerializer(form_obj).data
        }, status=status.HTTP_201_CREATED)


class FormReceivableDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormReceivable.objects.all()
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FormReceivableSerializer
        return FormReceivableWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Form Receivable fetched successfully",
            "data": serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_update(serializer)
        return Response({
            "message": "Form Receivable updated successfully",
            "data": FormReceivableSerializer(instance).data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status in ['Posted', 'Approved']:
            return Response(
                {"message": f"Cannot delete a form that is already {instance.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        form_no = instance.formreceipt_no
        instance.delete()

        return Response({
            "message": f"Form {form_no} deleted successfully"
        }, status=status.HTTP_200_OK)


class FormReceivableActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        form_obj = get_object_or_404(FormReceivable, pk=pk)
        action = request.data.get('action')

        valid_actions = ['Draft', 'Submitted', 'Approved', 'Posted', 'Cancelled']
        if action not in valid_actions:
            return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        old_status = form_obj.status
        form_obj.status = action
        form_obj.save()

        FormReceivableHistory.objects.create(
            form_receivable=form_obj,
            event_type=f"Status Change: {action}",
            action_by=request.user,
            details=f"Status changed from {old_status} to {form_obj.status}"
        )

        return Response({
            "message": f"Form status updated to {action}",
            "status": form_obj.status
        })


class FormReceivableCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        form_obj = get_object_or_404(FormReceivable, pk=pk)
        comments = form_obj.comments.all().order_by('-timestamp')
        serializer = FormReceivableCommentSerializer(comments, many=True)
        return Response({"data": serializer.data})

    def post(self, request, pk):
        form_obj = get_object_or_404(FormReceivable, pk=pk)
        serializer = FormReceivableCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(form_receivable=form_obj, created_by=request.user)
            return Response({"message": "Comment added", "data": serializer.data}, status=201)
        return validation_error_response(serializer)


class FormReceivableAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        form_obj = get_object_or_404(FormReceivable, pk=pk)
        attachments = form_obj.attachments.all()
        serializer = FormReceivableAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        form_obj = get_object_or_404(FormReceivable, pk=pk)
        serializer = FormReceivableAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(form_receivable=form_obj, uploaded_by=request.user)

        FormReceivableHistory.objects.create(
            form_receivable=form_obj,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": FormReceivableAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        form_obj = get_object_or_404(FormReceivable, pk=pk)
        attachment = get_object_or_404(FormReceivableAttachment, pk=attach_pk, form_receivable=form_obj)

        file_name = attachment.file.name
        attachment.delete()

        FormReceivableHistory.objects.create(
            form_receivable=form_obj,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class FormReceivableHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        form_obj = get_object_or_404(FormReceivable, pk=pk)
        history = form_obj.history.all().order_by('-timestamp')
        serializer = FormReceivableHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })
