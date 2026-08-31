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

from crm.models.invoice_return_models import (
    InvoiceReturn,
    InvoiceReturnAttachment,
    InvoiceReturnHistory,
)

from crm.serializers.invoice_return_serializers import (
    InvoiceReturnSerializer,
    InvoiceReturnWriteSerializer,
    InvoiceReturnAttachmentSerializer,
    InvoiceReturnCommentSerializer,
    InvoiceReturnHistorySerializer,
)

from crm.models.delivery_note_return_models import (
    DeliveryNoteReturn,
    DeliveryNoteReturnItem,
    DeliveryNoteReturnSerial,
    DeliveryNoteReturnHistory
)
from crm.serializers.delivery_note_return_serializers import (
    DeliveryNoteReturnSerializer,
)

class InvoiceReturnListCreateView(generics.ListCreateAPIView):
    queryset = InvoiceReturn.objects.select_related(
        'invoice',
        'customer'
    ).order_by('-created_at')

    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return InvoiceReturnWriteSerializer
        return InvoiceReturnSerializer
    
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
            "message": "Invoice Returns fetched successfully",
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

        ir = serializer.save()

        return Response({
            "message": "Invoice Return created successfully",
            "data": InvoiceReturnSerializer(ir).data
        }, status=status.HTTP_201_CREATED)


class InvoiceReturnDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InvoiceReturn.objects.select_related(
        'invoice',
        'customer'
    )

    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return InvoiceReturnSerializer
        return InvoiceReturnWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        return Response({
            "message": "Invoice Return fetched successfully",
            "data": InvoiceReturnSerializer(instance).data
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
            "message": "Invoice Return updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Invoice Return deleted successfully"
        })


class InvoiceReturnActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel']:
            return Response({
                "message": "Invalid action"
            }, status=400)

        old_status = ir.status

        if action == 'save_draft':
            ir.status = 'Draft'
            message = "Invoice Return saved as draft"

        elif action == 'submit':
            ir.status = 'Submitted'
            message = "Invoice Return submitted successfully"

        elif action == 'cancel':
            ir.status = 'Cancelled'
            message = "Invoice Return cancelled successfully"

        ir.updated_by = request.user
        ir.save()

        InvoiceReturnHistory.objects.create(
            invoice_return=ir,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {ir.status}"
        )

        return Response({
            "message": message
        })


class InvoiceReturnCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        comments = ir.comments.all().order_by('-timestamp')

        serializer = InvoiceReturnCommentSerializer(
            comments,
            many=True
        )

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)

        serializer = InvoiceReturnCommentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            invoice_return=ir,
            created_by=request.user
        )

        InvoiceReturnHistory.objects.create(
            invoice_return=ir,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": InvoiceReturnCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class InvoiceReturnAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        attachments = ir.attachments.all()

        serializer = InvoiceReturnAttachmentSerializer(
            attachments,
            many=True
        )

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)

        serializer = InvoiceReturnAttachmentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            invoice_return=ir,
            uploaded_by=request.user
        )

        InvoiceReturnHistory.objects.create(
            invoice_return=ir,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": InvoiceReturnAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)

        attachment = get_object_or_404(
            InvoiceReturnAttachment,
            pk=attach_pk,
            invoice_return=ir
        )

        file_name = attachment.file.name
        attachment.delete()

        InvoiceReturnHistory.objects.create(
            invoice_return=ir,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({
            "message": "Attachment deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)


class InvoiceReturnHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        history = ir.history.all().order_by('-timestamp')

        serializer = InvoiceReturnHistorySerializer(
            history,
            many=True
        )

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


class InvoiceReturnPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)

        context = {
            'ir': ir,
            'items': ir.items.all(),
            'now': timezone.now(),
            'request': request,
        }

        html_string = render_to_string(
            'invoice_return_pdf.html',
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
            f'attachment; filename="INVR_{ir.invoice_return_id}.pdf"'
        )
        response.write(pdf_buffer.getvalue())

        return response


class InvoiceReturnEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        recipient = request.data.get('email')

        if not recipient:
            return Response({
                "message": "Email is required"
            }, status=400)

        context = {
            'ir': ir,
            'items': ir.items.all(),
        }

        html_message = render_to_string(
            'invoice_return_email.html',
            context
        )

        email = EmailMessage(
            subject=f'Invoice Return {ir.invoice_return_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )

        email.content_subtype = 'html'
        email.send()

        return Response({
            "message": "Email sent successfully"
        })


class GenerateDeliveryNoteReturnFromInvoiceReturnView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        # 1. Get the source Invoice Return
        ir = get_object_or_404(InvoiceReturn, pk=pk)

        # 2. Check if already has DNR (optional - prevent duplicates)
        if ir.dn_returns.exists():
            return Response({
                "message": "Delivery Note Return already exists for this Invoice Return"
            }, status=status.HTTP_400_BAD_REQUEST)

        # 3. Create new DNR
        dnr = DeliveryNoteReturn.objects.create(
            invoice_return=ir,
            dnr_date=timezone.now().date(),
            customer_ref_no=f"DNR-REF-{ir.invoice_return_id}",
            customer=ir.customer,
            email_id=ir.email_id,
            phone_number=ir.phone_number,
            contact_person=ir.contact_person,
            status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        # 4. Copy all items from Invoice Return (you can add filter later if needed)
        for ir_item in ir.items.all():
            # Skip items with 0 returned qty
            if ir_item.returned_qty_cus <= 0:
                continue

            dnr_item = DeliveryNoteReturnItem.objects.create(
                delivery_note_return=dnr,
                invoice_return_item=ir_item,
                # Auto-filled by model save()
            )

            # Copy serials from Invoice Return item
            for ir_serial in ir_item.serial_numbers.all():
                DeliveryNoteReturnSerial.objects.create(
                    delivery_note_return_item=dnr_item,
                    serial_no=ir_serial.serial_no
                )

        # 5. Log history
        DeliveryNoteReturnHistory.objects.create(
            delivery_note_return=dnr,
            event_type="Generated from Invoice Return",
            action_by=request.user,
            details=f"Created from Invoice Return {ir.invoice_return_id}"
        )

        # 6. Return new DNR details
        serializer = DeliveryNoteReturnSerializer(dnr)
        return Response({
            "message": f"Delivery Note Return generated successfully from Invoice Return {ir.invoice_return_id}",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)