from io import BytesIO

from django.conf import settings
from django.core.mail import EmailMessage
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils import timezone
from django.core.paginator import Paginator
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from weasyprint import HTML

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from crm.models.invoice_models import (
    Invoice,
    InvoiceAttachment,
    InvoiceHistory,
)

from crm.serializers.invoice_serializers import (
    InvoiceSerializer,
    InvoiceWriteSerializer,
    InvoiceAttachmentSerializer,
    InvoiceCommentSerializer,
    InvoiceHistorySerializer,
)


class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.select_related(
        'sales_order',
        'customer'
    ).order_by('-created_at')

    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return InvoiceWriteSerializer
        return InvoiceSerializer
    
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
            "message": "Invoices fetched successfully",
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

        invoice = serializer.save()

        return Response({
            "message": "Invoice created successfully",
            "data": InvoiceSerializer(invoice).data
        }, status=status.HTTP_201_CREATED)


class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.select_related(
        'sales_order',
        'customer'
    )

    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return InvoiceSerializer
        return InvoiceWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        return Response({
            "message": "Invoice fetched successfully",
            "data": InvoiceSerializer(instance).data
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

        return Response({
            "message": "Invoice updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Invoice deleted successfully"
        })


class InvoiceActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)
        action = request.data.get('action')

        if action not in [
            'save_draft',
            'send_invoice',
            'mark_as_paid',
            'cancel_invoice'
        ]:
            return Response({
                "message": "Invalid action"
            }, status=400)

        old_status = invoice.invoice_status

        if action == 'save_draft':
            invoice.invoice_status = 'Draft'
            message = "Invoice saved as draft"

        elif action == 'send_invoice':
            invoice.invoice_status = 'Sent'
            message = "Invoice sent successfully"

        elif action == 'mark_as_paid':
            invoice.payment_status = 'Paid'
            message = "Invoice marked as paid"

        elif action == 'cancel_invoice':
            invoice.invoice_status = 'Cancelled'
            message = "Invoice cancelled successfully"

        invoice.updated_by = request.user
        invoice.save()

        InvoiceHistory.objects.create(
            invoice=invoice,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {invoice.invoice_status}"
        )

        return Response({
            "message": message
        })


class InvoiceCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)
        comments = invoice.comments.all().order_by('-timestamp')

        serializer = InvoiceCommentSerializer(comments, many=True)

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)

        serializer = InvoiceCommentSerializer(data=request.data)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            invoice=invoice,
            created_by=request.user
        )

        InvoiceHistory.objects.create(
            invoice=invoice,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": InvoiceCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class InvoiceAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)
        attachments = invoice.attachments.all()

        serializer = InvoiceAttachmentSerializer(
            attachments,
            many=True
        )

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)

        serializer = InvoiceAttachmentSerializer(data=request.data)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            invoice=invoice,
            uploaded_by=request.user
        )

        InvoiceHistory.objects.create(
            invoice=invoice,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": InvoiceAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        invoice = get_object_or_404(Invoice, pk=pk)

        attachment = get_object_or_404(
            InvoiceAttachment,
            pk=attach_pk,
            invoice=invoice
        )

        file_name = attachment.file.name
        attachment.delete()

        InvoiceHistory.objects.create(
            invoice=invoice,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({
            "message": "Attachment deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)


class InvoiceHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)
        history = invoice.history.all().order_by('-timestamp')

        serializer = InvoiceHistorySerializer(history, many=True)

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


class InvoicePDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)

        context = {
            'invoice': invoice,
            'items': invoice.items.all(),
            'now': timezone.now(),
            'request': request,
        }

        html_string = render_to_string('invoice_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())

        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = (
            f'attachment; filename="INV_{invoice.invoice_id}.pdf"'
        )
        response.write(pdf_buffer.getvalue())

        return response


class InvoiceEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)
        recipient = request.data.get('email')

        if not recipient:
            return Response({
                "message": "Email is required"
            }, status=400)

        context = {
            'invoice': invoice,
            'items': invoice.items.all(),
        }

        html_message = render_to_string(
            'invoice_email.html',
            context
        )

        email = EmailMessage(
            subject=f'Invoice {invoice.invoice_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )

        email.content_subtype = 'html'
        email.send()

        return Response({
            "message": "Email sent successfully"
        })


class GenerateInvoiceReturnFromInvoiceView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)

        return Response({
            "message": f"Invoice Return generated from Invoice {invoice.invoice_id} placeholder",
            "data": {
                "invoice_return_id": "IR-0001",
                "url": "/api/invoice-returns/1/"
            }
        }, status=status.HTTP_201_CREATED)
