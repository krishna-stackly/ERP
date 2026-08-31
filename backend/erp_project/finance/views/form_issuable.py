
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.paginator import Paginator

from ..models.form_issuable import Department, RequestedBy, ApprovedBy,WarehouseDet,BatchNo
from ..serializers.form_issuable import DepartmentSerializer, RequestedBySerializer, ApprovedBySerializer,WarehouseDetSerializer,BatchNoSerializer
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


from ..models.form_issuable import (
    FormIssuable, FormIssuableItem, FormIssuableAttachment,
    FormIssuableComment, FormIssuableHistory
)
from ..serializers.form_issuable import (
    FormIssuableSerializer, FormIssuableWriteSerializer,
    FormIssuableAttachmentSerializer, FormIssuableCommentSerializer,
    FormIssuableHistorySerializer
)


class DepartmentListCreateView(ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    

class DepartmentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    


class RequestedByListCreateView(ListCreateAPIView):
    queryset = RequestedBy.objects.all()
    serializer_class = RequestedBySerializer

class RequestedByDetailView(RetrieveUpdateDestroyAPIView):
    queryset = RequestedBy.objects.all()
    serializer_class = RequestedBySerializer


class ApprovedByListCreateView(ListCreateAPIView):
    queryset = ApprovedBy.objects.all()
    serializer_class = ApprovedBySerializer

class ApprovedByDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ApprovedBy.objects.all()
    serializer_class = ApprovedBySerializer

class WarehouseDetListCreateView(ListCreateAPIView):
    queryset = WarehouseDet.objects.all()
    serializer_class = WarehouseDetSerializer


class WarehouseDetDetailView(RetrieveUpdateDestroyAPIView):
    queryset = WarehouseDet.objects.all()
    serializer_class = WarehouseDetSerializer


class BatchNoListCreateView(ListCreateAPIView):
    queryset = BatchNo.objects.select_related('warehouse').all()
    serializer_class = BatchNoSerializer


class BatchNoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = BatchNo.objects.select_related('warehouse').all()
    serializer_class = BatchNoSerializer


class FormIssuableListCreateView(generics.ListCreateAPIView):
    queryset = FormIssuable.objects.select_related(
        'department',
        'requested_by',
        'approved_by',
        'created_by'
    ).prefetch_related(
        'items'
    ).order_by('-generated_on')

    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return FormIssuableWriteSerializer
        return FormIssuableSerializer

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
            "message": "Form Issuables fetched successfully",
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
            "message": "Form Issuable created successfully",
            "data": FormIssuableSerializer(form_obj).data
        }, status=status.HTTP_201_CREATED)

class FormIssuableDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormIssuable.objects.select_related(
        'department',
        'requested_by',
        'approved_by',
        'created_by'
    ).prefetch_related(
        'items'
    )

    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FormIssuableSerializer
        return FormIssuableWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Form Issuable fetched successfully",
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
            "message": "Form Issuable updated successfully",
            "data": FormIssuableSerializer(instance).data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status in ['Posted', 'Approved']:
            return Response(
                {"message": f"Cannot delete a form that is already {instance.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        form_no = instance.formissue_no
        instance.delete()

        return Response({
            "message": f"Form {form_no} deleted successfully"
        }, status=status.HTTP_200_OK)


class FormIssuableActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        form_obj = get_object_or_404(FormIssuable, pk=pk)
        action = request.data.get('action')

        valid_actions = ['Draft', 'Submitted', 'Approved', 'Posted', 'Cancelled']
        if action not in valid_actions:
            return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        old_status = form_obj.status
        form_obj.status = action
        form_obj.save()

        FormIssuableHistory.objects.create(
            form_issuable=form_obj,
            event_type=f"Status Change: {action}",
            action_by=request.user,
            details=f"Status changed from {old_status} to {form_obj.status}"
        )

        return Response({
            "message": f"Form status updated to {action}",
            "status": form_obj.status
        })


class FormIssuableCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        form_obj = get_object_or_404(FormIssuable, pk=pk)
        comments = form_obj.comments.all().order_by('-timestamp')
        serializer = FormIssuableCommentSerializer(comments, many=True)
        return Response({"data": serializer.data})

    def post(self, request, pk):
        form_obj = get_object_or_404(FormIssuable, pk=pk)
        serializer = FormIssuableCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(form_issuable=form_obj, created_by=request.user)
            return Response({"message": "Comment added", "data": serializer.data}, status=201)
        return validation_error_response(serializer)


class FormIssuableAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        form_obj = get_object_or_404(FormIssuable, pk=pk)
        attachments = form_obj.attachments.all()
        serializer = FormIssuableAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        form_obj = get_object_or_404(FormIssuable, pk=pk)
        serializer = FormIssuableAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(form_issuable=form_obj, uploaded_by=request.user)

        FormIssuableHistory.objects.create(
            form_issuable=form_obj,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": FormIssuableAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        form_obj = get_object_or_404(FormIssuable, pk=pk)
        attachment = get_object_or_404(FormIssuableAttachment, pk=attach_pk, form_issuable=form_obj)

        file_name = attachment.file.name
        attachment.delete()

        FormIssuableHistory.objects.create(
            form_issuable=form_obj,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class FormIssuableHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        form_obj = get_object_or_404(FormIssuable, pk=pk)
        history = form_obj.history.all().order_by('-timestamp')
        serializer = FormIssuableHistorySerializer(history, many=True)
        return Response({"data": serializer.data})