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

from crm.models.invoice_return_models import InvoiceReturn

from crm.models.delivery_note_return_models import (
    DeliveryNoteReturn,
    DeliveryNoteReturnItem,
    DeliveryNoteReturnSerial,
    DeliveryNoteReturnAttachment,
    DeliveryNoteReturnHistory,
)

from crm.serializers.delivery_note_return_serializers import (
    DeliveryNoteReturnSerializer,
    DeliveryNoteReturnWriteSerializer,
    DeliveryNoteReturnAttachmentSerializer,
    DeliveryNoteReturnCommentSerializer,
    DeliveryNoteReturnHistorySerializer,
)


class GenerateDeliveryNoteReturnFromInvoiceReturnView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)

        if ir.dn_returns.exists():
            return Response({
                "message": "Delivery Note Return already exists for this Invoice Return"
            }, status=status.HTTP_400_BAD_REQUEST)

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

        for ir_item in ir.items.all():
            if ir_item.returned_qty_cus <= 0:
                continue

            dnr_item = DeliveryNoteReturnItem.objects.create(
                delivery_note_return=dnr,
                invoice_return_item=ir_item,
            )

            for ir_serial in ir_item.serial_numbers.all():
                DeliveryNoteReturnSerial.objects.create(
                    delivery_note_return_item=dnr_item,
                    serial_no=ir_serial.serial_no
                )

        DeliveryNoteReturnHistory.objects.create(
            delivery_note_return=dnr,
            event_type="Generated from Invoice Return",
            action_by=request.user,
            details=f"Created from Invoice Return {ir.invoice_return_id}"
        )

        return Response({
            "message": f"Delivery Note Return generated successfully from Invoice Return {ir.invoice_return_id}",
            "data": DeliveryNoteReturnSerializer(dnr).data
        }, status=status.HTTP_201_CREATED)


class DeliveryNoteReturnListCreateView(generics.ListCreateAPIView):
    queryset = DeliveryNoteReturn.objects.select_related(
        'invoice_return',
        'customer'
    ).order_by('-created_at')

    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return DeliveryNoteReturnWriteSerializer
        return DeliveryNoteReturnSerializer
    
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
            "message": "Delivery Note Returns fetched successfully",
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

        dnr = serializer.save()

        return Response({
            "message": "Delivery Note Return created successfully",
            "data": DeliveryNoteReturnSerializer(dnr).data
        }, status=status.HTTP_201_CREATED)


class DeliveryNoteReturnDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DeliveryNoteReturn.objects.select_related(
        'invoice_return',
        'customer'
    )

    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DeliveryNoteReturnSerializer
        return DeliveryNoteReturnWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        return Response({
            "message": "Delivery Note Return fetched successfully",
            "data": DeliveryNoteReturnSerializer(instance).data
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
            "message": "Delivery Note Return updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Delivery Note Return deleted successfully"
        })


class DeliveryNoteReturnActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel']:
            return Response({
                "message": "Invalid action"
            }, status=400)

        old_status = dnr.status

        if action == 'save_draft':
            dnr.status = 'Draft'
            message = "Delivery Note Return saved as draft"

        elif action == 'submit':
            dnr.status = 'Submitted'
            message = "Delivery Note Return submitted successfully"

        elif action == 'cancel':
            dnr.status = 'Cancelled'
            message = "Delivery Note Return cancelled successfully"

        dnr.updated_by = request.user
        dnr.save()

        DeliveryNoteReturnHistory.objects.create(
            delivery_note_return=dnr,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {dnr.status}"
        )

        return Response({
            "message": message
        })


class DeliveryNoteReturnCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        comments = dnr.comments.all().order_by('-timestamp')

        serializer = DeliveryNoteReturnCommentSerializer(
            comments,
            many=True
        )

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)

        serializer = DeliveryNoteReturnCommentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            delivery_note_return=dnr,
            created_by=request.user
        )

        DeliveryNoteReturnHistory.objects.create(
            delivery_note_return=dnr,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": DeliveryNoteReturnCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class DeliveryNoteReturnAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        attachments = dnr.attachments.all()

        serializer = DeliveryNoteReturnAttachmentSerializer(
            attachments,
            many=True
        )

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)

        serializer = DeliveryNoteReturnAttachmentSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            delivery_note_return=dnr,
            uploaded_by=request.user
        )

        DeliveryNoteReturnHistory.objects.create(
            delivery_note_return=dnr,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": DeliveryNoteReturnAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)

        attachment = get_object_or_404(
            DeliveryNoteReturnAttachment,
            pk=attach_pk,
            delivery_note_return=dnr
        )

        file_name = attachment.file.name
        attachment.delete()

        DeliveryNoteReturnHistory.objects.create(
            delivery_note_return=dnr,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({
            "message": "Attachment deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)


class DeliveryNoteReturnHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        history = dnr.history.all().order_by('-timestamp')

        serializer = DeliveryNoteReturnHistorySerializer(
            history,
            many=True
        )

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


class DeliveryNoteReturnPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)

        context = {
            'dnr': dnr,
            'items': dnr.items.all(),
            'now': timezone.now(),
            'request': request,
        }

        html_string = render_to_string(
            'delivery_note_return_pdf.html',
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
            f'attachment; filename="DNR_{dnr.dnr_id}.pdf"'
        )
        response.write(pdf_buffer.getvalue())

        return response


class DeliveryNoteReturnEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        recipient = request.data.get('email')

        if not recipient:
            return Response({
                "message": "Email is required"
            }, status=400)

        context = {
            'dnr': dnr,
            'items': dnr.items.all(),
        }

        html_message = render_to_string(
            'delivery_note_return_email.html',
            context
        )

        email = EmailMessage(
            subject=f'Delivery Note Return {dnr.dnr_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )

        email.content_subtype = 'html'
        email.send()

        return Response({
            "message": "Email sent successfully"
        })
