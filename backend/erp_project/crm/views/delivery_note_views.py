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

from crm.models.delivery_note_models import (
    DeliveryNote,
    DeliveryNoteItem,
    DeliveryNoteAttachment,
    DeliveryNoteHistory,
)

from crm.models.invoice_models import (
    Invoice,
    InvoiceItem,
)

from crm.serializers.delivery_note_serializers import (
    DeliveryNoteSerializer,
    DeliveryNoteWriteSerializer,
    DeliveryNoteAttachmentSerializer,
    DeliveryNoteCommentSerializer,
    DeliveryNoteHistorySerializer,
)


class DeliveryNoteListCreateView(generics.ListCreateAPIView):
    queryset = DeliveryNote.objects.select_related(
        'sales_order',
        'customer'
    ).order_by('-created_at')

    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return DeliveryNoteWriteSerializer
        return DeliveryNoteSerializer
    
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
            "message": "Delivery Notes fetched successfully",
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

        dn = serializer.save()

        return Response({
            "message": "Delivery Note created successfully",
            "data": DeliveryNoteSerializer(dn).data
        }, status=status.HTTP_201_CREATED)


class DeliveryNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DeliveryNote.objects.select_related(
        'sales_order',
        'customer'
    )

    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DeliveryNoteSerializer
        return DeliveryNoteWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        return Response({
            "message": "Delivery Note fetched successfully",
            "data": DeliveryNoteSerializer(instance).data
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
            "message": "Delivery Note updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Delivery Note deleted successfully"
        })


class DeliveryNoteActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel_dn']:
            return Response({
                "message": "Invalid action"
            }, status=400)

        old_status = dn.status

        if action == 'save_draft':
            dn.status = 'Draft'
            message = "Delivery Note saved as draft"

        elif action == 'submit':
            dn.status = 'Submitted'
            message = "Delivery Note submitted successfully"

        elif action == 'cancel_dn':
            dn.status = 'Cancelled'
            message = "Delivery Note cancelled successfully"

        dn.updated_by = request.user
        dn.save()

        DeliveryNoteHistory.objects.create(
            delivery_note=dn,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {dn.status}"
        )

        return Response({
            "message": message
        })


class DeliveryNoteCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)
        comments = dn.comments.all().order_by('-timestamp')

        serializer = DeliveryNoteCommentSerializer(comments, many=True)

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)

        serializer = DeliveryNoteCommentSerializer(data=request.data)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            delivery_note=dn,
            created_by=request.user
        )

        DeliveryNoteHistory.objects.create(
            delivery_note=dn,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": DeliveryNoteCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class DeliveryNoteAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)
        attachments = dn.attachments.all()

        serializer = DeliveryNoteAttachmentSerializer(
            attachments,
            many=True
        )

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)

        serializer = DeliveryNoteAttachmentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            delivery_note=dn,
            uploaded_by=request.user
        )

        DeliveryNoteHistory.objects.create(
            delivery_note=dn,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": DeliveryNoteAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)

        attachment = get_object_or_404(
            DeliveryNoteAttachment,
            pk=attach_pk,
            delivery_note=dn
        )

        file_name = attachment.file.name
        attachment.delete()

        DeliveryNoteHistory.objects.create(
            delivery_note=dn,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({
            "message": "Attachment deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)


class DeliveryNoteHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)
        history = dn.history.all().order_by('-timestamp')

        serializer = DeliveryNoteHistorySerializer(history, many=True)

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


class DeliveryNotePDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)

        context = {
            'dn': dn,
            'items': dn.items.all(),
            'acknowledgement': getattr(dn, 'acknowledgement', None),
            'now': timezone.now(),
            'request': request,
        }

        html_string = render_to_string('delivery_note_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())

        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = (
            f'attachment; filename="DN_{dn.dn_id}.pdf"'
        )
        response.write(pdf_buffer.getvalue())

        return response


class DeliveryNoteEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)
        recipient = request.data.get('email')

        if not recipient:
            return Response({
                "message": "Email is required"
            }, status=400)

        context = {
            'dn': dn,
            'items': dn.items.all(),
        }

        html_message = render_to_string(
            'delivery_note_email.html',
            context
        )

        email = EmailMessage(
            subject=f'Delivery Note {dn.dn_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )

        email.content_subtype = 'html'
        email.send()

        return Response({
            "message": "Email sent successfully"
        })


class GenerateInvoiceFromDeliveryNoteView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        delivery_note = get_object_or_404(DeliveryNote, pk=pk)

        if delivery_note.status not in [
            'Submitted',
            'Partially Delivered',
            'Delivered'
        ]:
            return Response({
                "message": "Cannot generate Invoice from this Delivery Note status"
            }, status=status.HTTP_400_BAD_REQUEST)

        if Invoice.objects.filter(
            sales_order=delivery_note.sales_order
        ).exists():
            return Response({
                "message": "Invoice already generated for the related Sales Order"
            }, status=status.HTTP_400_BAD_REQUEST)

        invoice = Invoice.objects.create(
            sales_order=delivery_note.sales_order,
            customer=delivery_note.customer,
            invoice_date=timezone.now().date(),
            due_date=timezone.now().date() + timezone.timedelta(days=30),
            billing_address=delivery_note.destination_address,
            shipping_address=delivery_note.destination_address,
            currency='INR',
            payment_terms='Net 30',
            invoice_status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        for dn_item in delivery_note.items.all():
            InvoiceItem.objects.create(
                invoice=invoice,
                product=dn_item.product,
                quantity=dn_item.quantity,
                unit_price=dn_item.product.unit_price or 0.00,
                tax_rate=0.00,
                discount_rate=0.00,
                uom=dn_item.uom,
                returned_qty_cus=0
            )

        return Response({
            "message": f"Invoice {invoice.invoice_id} generated successfully from Delivery Note {delivery_note.dn_id}",
            "data": {
                "invoice_id": invoice.id,
                "invoice_number": invoice.invoice_id,
                "invoice_url": f"/api/invoices/{invoice.id}/"
            }
        }, status=status.HTTP_201_CREATED)
