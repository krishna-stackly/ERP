from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import get_object_or_404
from django.db import transaction
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from django.core.paginator import Paginator
from io import BytesIO

from weasyprint import HTML

from rest_framework.permissions import IsAuthenticated

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from ..models.asset_sales import (
    AssetSale,
    AssetSaleBuyer,
    AssetSaleApprover,
    AssetSaleItem,
    AssetSaleAttachment,
    AssetSaleComment,
    AssetSaleHistory
)

from ..serializers.asset_sales import (
    AssetSaleSerializer,
    AssetSaleWriteSerializer,

    AssetSaleBuyerSerializer,
    AssetSaleApproverSerializer,

    AssetSaleAttachmentSerializer,
    AssetSaleCommentSerializer,
    AssetSaleHistorySerializer
)


# =========================================================
# ASSET SALE LIST CREATE
# =========================================================

class AssetSaleListCreateView(generics.ListCreateAPIView):

    queryset = AssetSale.objects.select_related(
        'department',
        'requested_by',
        'approved_by'
    ).order_by('-created_at')

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def get_serializer_class(self):

        if self.request.method == 'POST':
            return AssetSaleWriteSerializer

        return AssetSaleSerializer

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
        ) if page.object_list else 0

        return Response({
            "message": "Asset Sales fetched successfully",
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

        serializer = self.get_serializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        asset_sale = serializer.save()

        AssetSaleHistory.objects.create(
            asset_sale=asset_sale,
            event_type='Created',
            action_by=request.user,
            details='Asset Sale created successfully.'
        )

        return Response({
            "message": "Asset Sale created successfully",
            "data": AssetSaleSerializer(asset_sale).data
        }, status=status.HTTP_201_CREATED)


# =========================================================
# ASSET SALE DETAIL
# =========================================================

class AssetSaleDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = AssetSale.objects.select_related(
        'department',
        'requested_by',
        'approved_by'
    )

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def get_serializer_class(self):

        if self.request.method == 'GET':
            return AssetSaleSerializer

        return AssetSaleWriteSerializer

    def retrieve(self, request, *args, **kwargs):

        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "Asset Sale fetched successfully",
            "data": serializer.data
        })

    def update(self, request, *args, **kwargs):

        partial = kwargs.pop('partial', True)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
            context={'request': request}
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_update(serializer)

        AssetSaleHistory.objects.create(
            asset_sale=instance,
            event_type='Updated',
            action_by=request.user,
            details='Asset Sale updated successfully.'
        )

        return Response({
            "message": "Asset Sale updated successfully"
        })

    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()

        instance.delete()

        return Response({
            "message": "Asset Sale deleted successfully"
        })


# =========================================================
# ASSET SALE ACTIONS
# =========================================================

class AssetSaleActionView(APIView):

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def post(self, request, pk):

        asset_sale = get_object_or_404(
            AssetSale,
            pk=pk
        )

        action = request.data.get('action')

        valid_actions = [
            'save_draft',
            'submit',
            'approve',
            'reject',
            'post',
            'cancel'
        ]

        if action not in valid_actions:

            return Response({
                "message": "Invalid action"
            }, status=400)

        old_status = asset_sale.status

        # =============================================
        # SAVE DRAFT
        # =============================================

        if action == 'save_draft':

            asset_sale.status = 'Draft'

            message = "Asset Sale saved as draft"

        # =============================================
        # SUBMIT
        # =============================================

        elif action == 'submit':

            asset_sale.status = 'Submitted'

            message = "Asset Sale submitted successfully"

        # =============================================
        # APPROVE
        # =============================================

        elif action == 'approve':

            asset_sale.status = 'Approved'

            asset_sale.approved_by = request.user

            message = "Asset Sale approved successfully"

        # =============================================
        # REJECT
        # =============================================

        elif action == 'reject':

            asset_sale.status = 'Rejected'

            asset_sale.rejection_reason = request.data.get(
                'rejection_reason',
                ''
            )

            message = "Asset Sale rejected successfully"

        # =============================================
        # POST
        # =============================================

        elif action == 'post':

            asset_sale.status = 'Posted'

            message = "Asset Sale posted successfully"

        # =============================================
        # CANCEL
        # =============================================

        elif action == 'cancel':

            asset_sale.status = 'Cancelled'

            message = "Asset Sale cancelled successfully"

        asset_sale.updated_by = request.user

        asset_sale.save()

        AssetSaleHistory.objects.create(
            asset_sale=asset_sale,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {asset_sale.status}"
        )

        return Response({
            "message": message
        })


# =========================================================
# BUYER CRUD
# =========================================================

class AssetSaleBuyerListCreateView(
    generics.ListCreateAPIView
):

    queryset = AssetSaleBuyer.objects.all().order_by(
        'buyer_name'
    )

    serializer_class = AssetSaleBuyerSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]


class AssetSaleBuyerDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = AssetSaleBuyer.objects.all()

    serializer_class = AssetSaleBuyerSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'


# =========================================================
# APPROVER CRUD
# =========================================================

class AssetSaleApproverListCreateView(
    generics.ListCreateAPIView
):

    queryset = AssetSaleApprover.objects.all()

    serializer_class = AssetSaleApproverSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]


class AssetSaleApproverDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = AssetSaleApprover.objects.all()

    serializer_class = AssetSaleApproverSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'


# =========================================================
# COMMENTS
# =========================================================

class AssetSaleCommentView(APIView):

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def get(self, request, pk):

        asset_sale = get_object_or_404(
            AssetSale,
            pk=pk
        )

        comments = asset_sale.comments.all().order_by(
            '-timestamp'
        )

        serializer = AssetSaleCommentSerializer(
            comments,
            many=True
        )

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):

        asset_sale = get_object_or_404(
            AssetSale,
            pk=pk
        )

        serializer = AssetSaleCommentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            asset_sale=asset_sale,
            created_by=request.user
        )

        AssetSaleHistory.objects.create(
            asset_sale=asset_sale,
            event_type='Comment Added',
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": AssetSaleCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


# =========================================================
# ATTACHMENTS
# =========================================================

class AssetSaleAttachmentView(APIView):

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    parser_classes = (
        MultiPartParser,
        FormParser
    )

    def get(self, request, pk):

        asset_sale = get_object_or_404(
            AssetSale,
            pk=pk
        )

        attachments = asset_sale.attachments.all()

        serializer = AssetSaleAttachmentSerializer(
            attachments,
            many=True
        )

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):

        asset_sale = get_object_or_404(
            AssetSale,
            pk=pk
        )

        serializer = AssetSaleAttachmentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            asset_sale=asset_sale,
            uploaded_by=request.user
        )

        AssetSaleHistory.objects.create(
            asset_sale=asset_sale,
            event_type='Attachment Uploaded',
            action_by=request.user,
            details=f"File uploaded: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": AssetSaleAttachmentSerializer(
                attachment
            ).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):

        asset_sale = get_object_or_404(
            AssetSale,
            pk=pk
        )

        attachment = get_object_or_404(
            AssetSaleAttachment,
            pk=attach_pk,
            asset_sale=asset_sale
        )

        file_name = attachment.file.name

        attachment.delete()

        AssetSaleHistory.objects.create(
            asset_sale=asset_sale,
            event_type='Attachment Deleted',
            action_by=request.user,
            details=f"Deleted file: {file_name}"
        )

        return Response({
            "message": "Attachment deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)


# =========================================================
# HISTORY
# =========================================================

class AssetSaleHistoryView(APIView):

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def get(self, request, pk):

        asset_sale = get_object_or_404(
            AssetSale,
            pk=pk
        )

        history = asset_sale.history.all().order_by(
            '-timestamp'
        )

        serializer = AssetSaleHistorySerializer(
            history,
            many=True
        )

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


# =========================================================
# PDF
# =========================================================

class AssetSalePDFView(APIView):

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def get(self, request, pk):

        asset_sale = get_object_or_404(
            AssetSale,
            pk=pk
        )

        context = {
            'asset_sale': asset_sale,
            'items': asset_sale.items.all(),
            'now': timezone.now(),
            'request': request,
        }

        html_string = render_to_string(
            'asset_sale_pdf.html',
            context
        )

        html = HTML(
            string=html_string,
            base_url=request.build_absolute_uri()
        )

        pdf_buffer = BytesIO()

        html.write_pdf(pdf_buffer)

        response = HttpResponse(
            content_type='application/pdf'
        )

        response[
            'Content-Disposition'
        ] = (
            f'attachment; filename="'
            f'{asset_sale.asset_sale_no}.pdf"'
        )

        response.write(pdf_buffer.getvalue())

        return response