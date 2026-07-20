from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.paginator import Paginator
from django.db import transaction
from django.shortcuts import get_object_or_404

from ..models.journal_voucher import (
    JournalVoucher,
    JournalVoucherApprover,
    JournalVoucherAttachment,
    JournalVoucherHistory,
)
from ..serializers.journal_voucher import (
    JournalVoucherSerializer,
    JournalVoucherWriteSerializer,
    JournalVoucherApproverSerializer,
    JournalVoucherAttachmentSerializer,
    JournalVoucherCommentSerializer,
    JournalVoucherHistorySerializer,
)
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response


# ─────────────────────────────────────────────────────────────────────────────
# APPROVER — LIST + CREATE
# ─────────────────────────────────────────────────────────────────────────────

class JournalVoucherApproverListCreateView(generics.ListCreateAPIView):
    # queryset = JournalVoucherApprover.objects.select_related(
    #     'user'
    # ).order_by('-created_at')
    queryset = JournalVoucherApprover.objects.all()

    permission_classes = [IsAuthenticated, RoleBasedPermission]
    serializer_class   = JournalVoucherApproverSerializer

    def list(self, request, *args, **kwargs):
        queryset   = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "message": "Journal Voucher Approvers fetched successfully",
            "data": serializer.data
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        approver = serializer.save()
        return Response({
            "message": "Journal Voucher Approver created successfully",
            "data": JournalVoucherApproverSerializer(approver).data
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────────────────────────────────────
# APPROVER — RETRIEVE + UPDATE + DELETE
# ─────────────────────────────────────────────────────────────────────────────

class JournalVoucherApproverDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JournalVoucherApprover.objects.select_related('user')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    serializer_class   = JournalVoucherApproverSerializer
    lookup_field       = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance   = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Journal Voucher Approver fetched successfully",
            "data": serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial    = kwargs.pop('partial', True)
        instance   = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        if not serializer.is_valid():
            return validation_error_response(serializer)
        self.perform_update(serializer)
        return Response({
            "message": "Journal Voucher Approver updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"message": "Journal Voucher Approver deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ─────────────────────────────────────────────────────────────────────────────
# JOURNAL VOUCHER — LIST + CREATE
# ─────────────────────────────────────────────────────────────────────────────

class JournalVoucherListCreateView(generics.ListCreateAPIView):
    queryset = JournalVoucher.objects.select_related(
        'prepared_by', 'approved_by',
        'created_by',  'updated_by'
    ).order_by('-voucher_date')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JournalVoucherWriteSerializer
        return JournalVoucherSerializer

    def list(self, request, *args, **kwargs):
        queryset    = self.filter_queryset(self.get_queryset())
        page_number = int(request.query_params.get('page', 1))
        page_size   = int(request.query_params.get('limit', 10))
        paginator   = Paginator(queryset, page_size)
        page        = paginator.get_page(page_number)
        serializer  = self.get_serializer(page, many=True)
        from_count  = (page.number - 1) * page_size + 1
        to_count    = from_count + len(page.object_list) - 1 if page.object_list else 0
        return Response({
            "message": "Journal Vouchers fetched successfully",
            "data": {
                "from":       from_count,
                "to":         to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data":       serializer.data
            }
        })

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        voucher = serializer.save()
        return Response({
            "message": "Journal Voucher created successfully",
            "data": JournalVoucherSerializer(voucher).data
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────────────────────────────────────
# JOURNAL VOUCHER — RETRIEVE + UPDATE + DELETE
# ─────────────────────────────────────────────────────────────────────────────

class JournalVoucherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JournalVoucher.objects.select_related(
        'prepared_by', 'approved_by',
        'created_by',  'updated_by'
    )
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return JournalVoucherSerializer
        return JournalVoucherWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance   = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Journal Voucher fetched successfully",
            "data": serializer.data
        })

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial    = kwargs.pop('partial', True)
        instance   = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        if not serializer.is_valid():
            return validation_error_response(serializer)
        self.perform_update(serializer)
        return Response({
            "message": "Journal Voucher updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"message": "Journal Voucher deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ─────────────────────────────────────────────────────────────────────────────
# ACTION VIEW  (status transitions)
# ─────────────────────────────────────────────────────────────────────────────

class JournalVoucherActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        voucher = get_object_or_404(JournalVoucher, pk=pk)
        action  = request.data.get('action')

        if action not in ['save_draft', 'submit', 'approve', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = voucher.status

        if action == 'save_draft':
            voucher.status = 'Draft'
            message = "Journal Voucher saved as draft"

        elif action == 'submit':
            voucher.status = 'Submitted'
            message = "Journal Voucher submitted successfully"

        elif action == 'approve':
            voucher.status = 'Approved'
            message = "Journal Voucher approved successfully"

        elif action == 'cancel':
            cancel_reason = request.data.get('cancel_reason', '').strip()
            if not cancel_reason:
                return Response({
                    "message": "Cancel reason is required."
                }, status=400)
            voucher.status = 'Cancelled'
            message = "Journal Voucher cancelled successfully"

        voucher.updated_by = request.user
        voucher.save()

        JournalVoucherHistory.objects.create(
            journal_voucher=voucher,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {voucher.status}"
        )

        return Response({"message": message})


# ─────────────────────────────────────────────────────────────────────────────
# COMMENT VIEW
# ─────────────────────────────────────────────────────────────────────────────

class JournalVoucherCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        voucher    = get_object_or_404(JournalVoucher, pk=pk)
        comments   = voucher.comments.all().order_by('-timestamp')
        serializer = JournalVoucherCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        voucher    = get_object_or_404(JournalVoucher, pk=pk)
        serializer = JournalVoucherCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            journal_voucher=voucher,
            created_by=request.user
        )

        JournalVoucherHistory.objects.create(
            journal_voucher=voucher,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": JournalVoucherCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────────────────────────────────────
# ATTACHMENT VIEW
# ─────────────────────────────────────────────────────────────────────────────

class JournalVoucherAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes     = (MultiPartParser, FormParser)

    def get(self, request, pk):
        voucher     = get_object_or_404(JournalVoucher, pk=pk)
        attachments = voucher.attachments.all()
        serializer  = JournalVoucherAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        voucher    = get_object_or_404(JournalVoucher, pk=pk)
        serializer = JournalVoucherAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            journal_voucher=voucher,
            uploaded_by=request.user
        )

        JournalVoucherHistory.objects.create(
            journal_voucher=voucher,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": JournalVoucherAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        voucher    = get_object_or_404(JournalVoucher, pk=pk)
        attachment = get_object_or_404(
            JournalVoucherAttachment,
            pk=attach_pk,
            journal_voucher=voucher
        )
        file_name = attachment.file.name
        attachment.delete()

        JournalVoucherHistory.objects.create(
            journal_voucher=voucher,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response(
            {"message": "Attachment deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ─────────────────────────────────────────────────────────────────────────────
# HISTORY VIEW
# ─────────────────────────────────────────────────────────────────────────────

class JournalVoucherHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        voucher    = get_object_or_404(JournalVoucher, pk=pk)
        history    = voucher.history.all().order_by('-timestamp')
        serializer = JournalVoucherHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })