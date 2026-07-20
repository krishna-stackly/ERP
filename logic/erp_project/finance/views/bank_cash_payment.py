from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from io import BytesIO
from django.core.mail import EmailMessage
from rest_framework.views import APIView, settings, settings
from rest_framework.parsers import MultiPartParser, FormParser



from ..models.bank_cash_payment import BankCashPayment, BankCashPaymentHistory, BankCashPaymentAttachment, BankCashPaymentComment
from ..serializers.bank_cash_payment import (
    BankCashPaymentSerializer,
    BankCashPaymentWriteSerializer,
    BankCashPaymentCommentSerializer,
    BankCashPaymentAttachmentSerializer,
    BankCashPaymentHistorySerializer,
    
)
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response


class BankCashPaymentListCreateView(generics.ListCreateAPIView):
    queryset = BankCashPayment.objects.select_related(
        'ar_voucher', 'created_by', 'updated_by'
    ).order_by('-payment_date')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BankCashPaymentWriteSerializer
        return BankCashPaymentSerializer

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
            "message": "Bank Cash Payments fetched successfully",
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
        payment = serializer.save()
        return Response({
            "message": "Bank Cash Payment created successfully",
            "data": BankCashPaymentSerializer(payment).data
        }, status=status.HTTP_201_CREATED)


class BankCashPaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BankCashPayment.objects.select_related(
        'ar_voucher', 'created_by', 'updated_by'
    )
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BankCashPaymentSerializer
        return BankCashPaymentWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance   = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Bank Cash Payment fetched successfully",
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
            "message": "Bank Cash Payment updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"message": "Bank Cash Payment deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    

class BankCashPaymentActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        payment = get_object_or_404(BankCashPayment, pk=pk)
        action  = request.data.get('action')

        if action not in ['save_draft', 'submit', 'approve', 'post', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = payment.status

        if action == 'save_draft':
            payment.status = 'DRAFT'
            message = "Bank Cash Payment saved as draft"

        elif action == 'submit':
            payment.status = 'SUBMITTED'
            message = "Bank Cash Payment submitted successfully"

        elif action == 'approve':
            payment.status = 'APPROVED'
            message = "Bank Cash Payment approved successfully"

        elif action == 'post':
            payment.status = 'POSTED'
            message = "Bank Cash Payment posted successfully"

        elif action == 'cancel':
            cancel_reason = request.data.get('cancel_reason', '').strip()
            if not cancel_reason:
                return Response({
                    "message": "Cancel reason is required."
                }, status=400)
            payment.status = 'CANCELLED'
            message = "Bank Cash Payment cancelled successfully"

        payment.updated_by = request.user
        payment.updated_at = timezone.now()
        payment.save()

        BankCashPaymentHistory.objects.create(
            payment=payment,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {payment.status}"
        )

        return Response({"message": message})



class BankCashPaymentCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        payment    = get_object_or_404(BankCashPayment, pk=pk)
        comments   = payment.comments.all().order_by('-timestamp')
        serializer = BankCashPaymentCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        payment    = get_object_or_404(BankCashPayment, pk=pk)
        serializer = BankCashPaymentCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            payment=payment,
            created_by=request.user
        )

        BankCashPaymentHistory.objects.create(
            payment=payment,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": BankCashPaymentCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)
    
class BankCashPaymentAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes     = (MultiPartParser, FormParser)

    def get(self, request, pk):
        payment     = get_object_or_404(BankCashPayment, pk=pk)
        attachments = payment.attachments.all()
        serializer  = BankCashPaymentAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        payment    = get_object_or_404(BankCashPayment, pk=pk)
        serializer = BankCashPaymentAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            payment=payment,
            uploaded_by=request.user
        )

        BankCashPaymentHistory.objects.create(
            payment=payment,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": BankCashPaymentAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        payment    = get_object_or_404(BankCashPayment, pk=pk)
        attachment = get_object_or_404(
            BankCashPaymentAttachment,
            pk=attach_pk,
            payment=payment
        )
        file_name = attachment.file.name
        attachment.delete()

        BankCashPaymentHistory.objects.create(
            payment=payment,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response(
            {"message": "Attachment deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    

class BankCashPaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        payment    = get_object_or_404(BankCashPayment, pk=pk)
        history    = payment.history.all().order_by('-timestamp')
        serializer = BankCashPaymentHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })    


class BankCashPaymentPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        payment = get_object_or_404(BankCashPayment, pk=pk)

        context = {
            'payment':  payment,
            'items':    payment.items.all(),
            'now':      timezone.now(),
            'request':  request,
        }

        html_string = render_to_string(
            'bank_cash_payment_pdf.html',
            context
        )
        html = HTML(
            string=html_string,
            base_url=request.build_absolute_uri()
        )
        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = (
            f'attachment; filename="BCP_{payment.payment_voucher_no}.pdf"'
        )
        response.write(pdf_buffer.getvalue())

        BankCashPaymentHistory.objects.create(
            payment=payment,
            event_type="PDF Downloaded",
            action_by=request.user,
            details=f"PDF downloaded for {payment.payment_voucher_no}"
        )

        return response
    
class BankCashPaymentEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        payment   = get_object_or_404(BankCashPayment, pk=pk)
        recipient = request.data.get('email', '').strip()

        if not recipient:
            return Response({
                "message": "Email is required."
            }, status=status.HTTP_400_BAD_REQUEST)

        context = {
            'payment': payment,
            'items':   payment.items.all(),
        }

        html_message = render_to_string(
            'bank_cash_payment_email.html',
            context
        )

        email = EmailMessage(
            subject=f'Bank Cash Payment {payment.payment_voucher_no}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        BankCashPaymentHistory.objects.create(
            payment=payment,
            event_type="Email Sent",
            action_by=request.user,
            details=f"Payment email sent to {recipient}"
        )

        return Response({"message": "Email sent successfully"})

