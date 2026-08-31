from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Q

from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from masters.models import (
    Supplier,
    SupplierComment,
    SupplierAttachment,
    SupplierHistory,
)

from masters.serializers import (
    SupplierSerializer,
    SupplierCreateUpdateSerializer,
    SupplierCommentSerializer,
    SupplierAttachmentSerializer,
    SupplierHistorySerializer,
)

from masters.views.pagination import StandardPagination


class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all().order_by('-created_at')

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    pagination_class = StandardPagination

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SupplierCreateUpdateSerializer

        return SupplierSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        status_value = self.request.query_params.get(
            'status'
        )

        workflow_status = self.request.query_params.get(
            'workflow_status'
        )

        supplier_type = self.request.query_params.get(
            'supplier_type'
        )

        risk_rating = self.request.query_params.get(
            'risk_rating'
        )

        search = self.request.query_params.get(
            'search',
            ''
        ).strip()

        if status_value and status_value != 'All':
            qs = qs.filter(status=status_value)

        if workflow_status and workflow_status != 'All':
            qs = qs.filter(
                workflow_status=workflow_status
            )

        if supplier_type and supplier_type != 'All':
            qs = qs.filter(
                supplier_type=supplier_type
            )

        if risk_rating and risk_rating != 'All':
            qs = qs.filter(
                risk_rating=risk_rating
            )

        if search:
            qs = qs.filter(
                Q(supplier_name__icontains=search) |
                Q(supplier_id__icontains=search) |
                Q(tax_id__icontains=search) |
                Q(primary_contact_email__icontains=search) |
                Q(primary_contact_phone__icontains=search)
            )

        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page_number = int(
            request.query_params.get('page', 1)
        )

        page_size = int(
            request.query_params.get('limit', 10)
        )

        paginator = Paginator(
            queryset,
            page_size
        )

        page = paginator.get_page(page_number)

        serializer = self.get_serializer(
            page,
            many=True
        )

        from_count = (
            (page.number - 1) * page_size
        ) + 1

        to_count = (
            from_count + len(page.object_list) - 1
            if page.object_list else 0
        )

        return Response({
            "message": "Suppliers fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(
                serializer
            )

        self.perform_create(serializer)

        instance = serializer.instance

        SupplierHistory.objects.create(
            supplier=instance,
            changed_by=request.user,
            changes="Supplier created"
        )

        return Response({
            "message": "Supplier created successfully",
            "data": SupplierSerializer(instance).data
        }, status=status.HTTP_201_CREATED)


class SupplierDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Supplier.objects.all()

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method in [
            'PUT',
            'PATCH'
        ]:
            return SupplierCreateUpdateSerializer

        return SupplierSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = SupplierSerializer(instance)

        return Response({
            "message": "Supplier fetched successfully",
            "data": serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop(
            'partial',
            True
        )

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        if not serializer.is_valid():
            return validation_error_response(
                serializer
            )

        self.perform_update(serializer)

        SupplierHistory.objects.create(
            supplier=instance,
            changed_by=request.user,
            changes="Supplier updated"
        )

        return Response({
            "message": "Supplier updated successfully",
            "data": SupplierSerializer(instance).data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()

        return Response({
            "message": "Supplier deleted successfully"
        })


class SupplierCommentView(APIView):
    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def get(self, request, pk):
        supplier = Supplier.objects.get(pk=pk)

        comments = supplier.comments.all().order_by(
            '-timestamp'
        )

        serializer = SupplierCommentSerializer(
            comments,
            many=True
        )

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        supplier = Supplier.objects.get(pk=pk)

        serializer = SupplierCommentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(
                serializer
            )

        comment = serializer.save(
            supplier=supplier,
            commented_by=request.user
        )

        SupplierHistory.objects.create(
            supplier=supplier,
            changed_by=request.user,
            changes="Comment added"
        )

        return Response({
            "message": "Comment added successfully",
            "data": SupplierCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class SupplierAttachmentView(APIView):
    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    parser_classes = (
        MultiPartParser,
        FormParser
    )

    def get(self, request, pk):
        supplier = Supplier.objects.get(pk=pk)

        attachments = supplier.extra_attachments.all()

        serializer = SupplierAttachmentSerializer(
            attachments,
            many=True
        )

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        supplier = Supplier.objects.get(pk=pk)

        serializer = SupplierAttachmentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(
                serializer
            )

        attachment = serializer.save(
            supplier=supplier,
            uploaded_by=request.user
        )

        SupplierHistory.objects.create(
            supplier=supplier,
            changed_by=request.user,
            changes="Attachment uploaded"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": SupplierAttachmentSerializer(
                attachment
            ).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        supplier = Supplier.objects.get(pk=pk)

        attachment = SupplierAttachment.objects.get(
            pk=attach_pk,
            supplier=supplier
        )

        attachment.delete()

        SupplierHistory.objects.create(
            supplier=supplier,
            changed_by=request.user,
            changes="Attachment deleted"
        )

        return Response({
            "message": "Attachment deleted successfully"
        })


class SupplierHistoryView(APIView):
    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def get(self, request, pk):
        supplier = Supplier.objects.get(pk=pk)

        history = supplier.history.all().order_by(
            '-changed_at'
        )

        serializer = SupplierHistorySerializer(
            history,
            many=True
        )

        return Response({
            "message": "Supplier history fetched successfully",
            "data": serializer.data
        })


class SupplierWorkflowActionView(APIView):
    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    @transaction.atomic
    def post(self, request, pk):
        supplier = Supplier.objects.get(pk=pk)

        action = request.data.get('action')

        valid_actions = [
            'save_draft',
            'submit',
            'approve',
            'reject',
            'blacklist'
        ]

        if action not in valid_actions:
            return Response({
                "error": "Invalid action"
            }, status=400)

        previous_status = supplier.workflow_status

        if action == 'save_draft':
            supplier.workflow_status = 'Draft'

        elif action == 'submit':
            supplier.workflow_status = 'Submitted'

        elif action == 'approve':
            supplier.status = 'Active'

        elif action == 'reject':
            supplier.status = 'Inactive'

        elif action == 'blacklist':
            supplier.status = 'Blacklisted'

        supplier.updated_by = request.user
        supplier.save()

        SupplierHistory.objects.create(
            supplier=supplier,
            changed_by=request.user,
            changes=(
                f"Workflow action '{action}' "
                f"performed. "
                f"Workflow changed from "
                f"{previous_status} to "
                f"{supplier.workflow_status}"
            )
        )

        return Response({
            "message": f"{action} action completed successfully",
            "data": SupplierSerializer(supplier).data
        })
