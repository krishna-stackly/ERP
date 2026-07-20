
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.paginator import Paginator
from django.db import transaction, models
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.utils import timezone
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings
from io import BytesIO
from weasyprint import HTML

from ..models.bank_cash_receipts import (
    BankCashReceipt,
    BankCashReceiptLineItem,
    BankCashReceiptAttachment,
    BankCashReceiptComment,
    BankCashReceiptHistory,
)
from ..serializers.bank_cash_receipts import (
    BankCashReceiptSerializer,
    BankCashReceiptWriteSerializer,
    BankCashReceiptAttachmentSerializer,
    BankCashReceiptCommentSerializer,
    BankCashReceiptHistorySerializer,
    PayerSearchSerializer,
)
from core.models import Candidate
from masters.models import Customer
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response


# LIST + CREATE

class BankCashReceiptListCreateView(generics.ListCreateAPIView):
    queryset = BankCashReceipt.objects.select_related(
        'customer', 'employee', 'ar_voucher',
        'created_by', 'updated_by', 'cancelled_by'
    ).order_by('-receipt_date')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BankCashReceiptWriteSerializer
        return BankCashReceiptSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page_number = int(request.query_params.get('page', 1))
        page_size   = int(request.query_params.get('limit', 10))
        paginator   = Paginator(queryset, page_size)
        page        = paginator.get_page(page_number)
        serializer  = self.get_serializer(page, many=True)
        from_count  = (page.number - 1) * page_size + 1
        to_count    = from_count + len(page.object_list) - 1 if page.object_list else 0
        return Response({
            "message": "Bank Cash Receipts fetched successfully",
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
        receipt = serializer.save()
        return Response({
            "message": "Bank Cash Receipt created successfully",
            "data": BankCashReceiptSerializer(receipt).data
        }, status=status.HTTP_201_CREATED)


# RETRIEVE + UPDATE + DELETE

class BankCashReceiptDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BankCashReceipt.objects.select_related(
        'customer', 'employee', 'ar_voucher',
        'created_by', 'updated_by', 'cancelled_by'
    )
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BankCashReceiptSerializer
        return BankCashReceiptWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance   = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Bank Cash Receipt fetched successfully",
            "data": serializer.data
        })

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial    = kwargs.pop('partial', True)
        instance   = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        self.perform_update(serializer)
        return Response({
            "message": "Bank Cash Receipt updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Bank Cash Receipt deleted successfully"})


# ACTION VIEW  (status transitions)

class BankCashReceiptActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        receipt = get_object_or_404(BankCashReceipt, pk=pk)
        action  = request.data.get('action')

        if action not in ['save_draft', 'submit', 'approve', 'post', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = receipt.status

        if action == 'save_draft':
            receipt.status = 'DRAFT'
            message = "Bank Cash Receipt saved as draft"

        elif action == 'submit':
            receipt.status = 'SUBMITTED'
            message = "Bank Cash Receipt submitted successfully"

        elif action == 'approve':
            receipt.status = 'APPROVED'
            message = "Bank Cash Receipt approved successfully"

        elif action == 'post':
            receipt.status = 'POSTED'
            message = "Bank Cash Receipt posted successfully"

        elif action == 'cancel':
            cancel_reason = request.data.get('cancel_reason', '').strip()
            if not cancel_reason:
                return Response({
                    "message": "Cancel reason is required."
                }, status=400)
            receipt.status        = 'CANCELLED'
            receipt.cancel_reason = cancel_reason
            receipt.cancelled_by  = request.user
            receipt.cancelled_at  = timezone.now()
            message = "Bank Cash Receipt cancelled successfully"

        receipt.updated_by = request.user
        receipt.save()

        BankCashReceiptHistory.objects.create(
            receipt=receipt,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {receipt.status}"
        )

        return Response({"message": message})


# COMMENT VIEW

class BankCashReceiptCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        receipt  = get_object_or_404(BankCashReceipt, pk=pk)
        comments = receipt.comments.all().order_by('-timestamp')
        serializer = BankCashReceiptCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        receipt    = get_object_or_404(BankCashReceipt, pk=pk)
        serializer = BankCashReceiptCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(receipt=receipt, created_by=request.user)

        BankCashReceiptHistory.objects.create(
            receipt=receipt,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": BankCashReceiptCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


# ATTACHMENT VIEW

class BankCashReceiptAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes     = (MultiPartParser, FormParser)

    def get(self, request, pk):
        receipt     = get_object_or_404(BankCashReceipt, pk=pk)
        attachments = receipt.attachments.all()
        serializer  = BankCashReceiptAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        receipt    = get_object_or_404(BankCashReceipt, pk=pk)
        serializer = BankCashReceiptAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(receipt=receipt, uploaded_by=request.user)

        BankCashReceiptHistory.objects.create(
            receipt=receipt,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": BankCashReceiptAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        receipt    = get_object_or_404(BankCashReceipt, pk=pk)
        attachment = get_object_or_404(BankCashReceiptAttachment, pk=attach_pk, receipt=receipt)
        file_name  = attachment.file.name
        attachment.delete()

        BankCashReceiptHistory.objects.create(
            receipt=receipt,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# HISTORY VIEW

class BankCashReceiptHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        receipt    = get_object_or_404(BankCashReceipt, pk=pk)
        history    = receipt.history.all().order_by('-timestamp')
        serializer = BankCashReceiptHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


# PDF VIEW

class BankCashReceiptPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        receipt = get_object_or_404(BankCashReceipt, pk=pk)
        context = {
            'receipt': receipt,
            'items':   receipt.items.all(),
            'now':     timezone.now(),
            'request': request,
        }
        html_string = render_to_string('bank_cash_receipt_pdf.html', context)
        html        = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_buffer  = BytesIO()
        html.write_pdf(pdf_buffer)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="BCR_{receipt.receipt_voucher_no}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


# EMAIL VIEW

class BankCashReceiptEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        receipt   = get_object_or_404(BankCashReceipt, pk=pk)
        recipient = request.data.get('email', '').strip()

        if not recipient:
            return Response({"message": "Email is required."}, status=400)

        context      = {'receipt': receipt}
        html_message = render_to_string('bank_cash_receipt_email.html', context)

        email = EmailMessage(
            subject=f'Bank Cash Receipt {receipt.receipt_voucher_no}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        BankCashReceiptHistory.objects.create(
            receipt=receipt,
            event_type="Email Sent",
            action_by=request.user,
            details=f"Receipt emailed to {recipient}"
        )

        return Response({"message": "Email sent successfully"})


# PAYER SEARCH VIEW  (popup)

class PayerSearchView(APIView):
    """
    GET /bank-cash-receipts/payer-search/

    Query Params:
      - payer_type : CUSTOMER | EMPLOYEE | OTHER  (optional — returns all if omitted)
      - search     : search by name or payer code (optional)

    Response matches popup table columns:
      S.No | Payer Code | Payer Name | Type | Branch
    """
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request):
        payer_type = request.query_params.get("payer_type", "").upper().strip()
        search     = request.query_params.get("search", "").strip()

        results = []

        # ── CUSTOMERS (Candidates) ────────────────────────────────────────────
        if payer_type in ("CUSTOMER", ""):
            customers = Customer.objects.filter(is_active=True)
            if search:
                customers = customers.filter(
                    models.Q(name__icontains=search) |
                    models.Q(customer_id__icontains=search)
                )
            for c in customers:
                results.append({
                    "id":         c.id,
                    "payer_code": c.customer_id,
                    "payer_name": str(c),
                    "payer_type": "CUSTOMER",
                    "branch":     str(c.branch) if getattr(c, "branch", None) else None,
                    "fk_field":   "customer",
                    "fk_id":      c.id,
                })

        # ── EMPLOYEES ─────────────────────────────────────────────────────────
        if payer_type in ("EMPLOYEE", ""):
            employees = Candidate.objects.filter(is_active=True)
            if search:
                employees = employees.filter(
                    models.Q(full_name__icontains=search) |
                    models.Q(employee_id__icontains=search)
                )
            for e in employees:
                results.append({
                    "id":         e.id,
                    "payer_code": e.employee_id,
                    "payer_name": str(e),
                    "payer_type": "EMPLOYEE",
                    "branch":     str(e.branch) if getattr(e, "branch", None) else None,
                    "fk_field":   "employee",
                    "fk_id":      e.id,
                })

        # ── OTHER ─────────────────────────────────────────────────────────────
        # No FK — payer_name is typed manually. Uncomment if OtherPayer model exists.
        # if payer_type in ("OTHER", ""):
        #     others = OtherPayer.objects.filter(is_active=True)
        #     if search:
        #         others = others.filter(
        #             models.Q(name__icontains=search) |
        #             models.Q(code__icontains=search)
        #         )
        #     for o in others:
        #         results.append({
        #             "id":         o.id,
        #             "payer_code": o.code,
        #             "payer_name": str(o),
        #             "payer_type": "OTHER",
        #             "branch":     str(o.branch) if getattr(o, "branch", None) else None,
        #             "fk_field":   None,
        #             "fk_id":      None,
        #         })

        serializer = PayerSearchSerializer(results, many=True)
        return Response({
            "message": "Payers fetched successfully",
            "data":    serializer.data
        })