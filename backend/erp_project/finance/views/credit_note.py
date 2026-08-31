from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models.credit_note import CreditNote, CreditNoteItem, CreditNoteAttachment
from ..models.debit_note import DebitNote, DebitNoteItem, DebitNoteAttachment
from ..serializers.credit_note import CreditNoteSerializer, CreditNoteItemSerializer, CreditNoteAttachmentSerializer
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
import io
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from django.template.loader import render_to_string
from weasyprint import HTML
from io import BytesIO
from django.http import HttpResponse
from django.core.mail import EmailMessage
from django.conf import settings
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response
from django.core.paginator import Paginator
from rest_framework.permissions import IsAuthenticated
from ..models.credit_note import CreditNote, CreditNoteItem, CreditNoteAttachment, CreditNoteComment, CreditNoteHistory
from ..serializers.credit_note import CreditNoteSerializer, CreditNoteWriteSerializer, CreditNoteAttachmentSerializer, CreditNoteCommentSerializer, CreditNoteHistorySerializer


class CreditNoteListCreateView(generics.ListCreateAPIView):
    queryset = CreditNote.objects.select_related('invoice', 'customer').order_by('-created_at')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreditNoteWriteSerializer
        return CreditNoteSerializer

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
            "message": "Credit Notes fetched successfully",
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
        crn = serializer.save()
        return Response({
            "message": "Credit Note created successfully",
            "data": CreditNoteSerializer(crn).data
        }, status=status.HTTP_201_CREATED)


class CreditNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CreditNote.objects.select_related('invoice', 'customer')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CreditNoteSerializer
        return CreditNoteWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Credit Note fetched successfully",
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
            "message": "Credit Note updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Credit Note deleted successfully"})


class CreditNoteActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'mark_paid', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = crn.payment_status

        if action == 'save_draft':
            crn.invoice_status = 'Draft'
            message = "Credit Note saved as draft"
        elif action == 'mark_paid':
            crn.payment_status = 'Paid'
            message = "Credit Note marked as paid"
        elif action == 'cancel':
            crn.invoice_status = 'Cancelled'
            message = "Credit Note cancelled successfully"

        crn.updated_by = request.user
        crn.save()

        CreditNoteHistory.objects.create(
            credit_note=crn,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {crn.payment_status}"
        )

        return Response({"message": message})


class CreditNoteCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        comments = crn.comments.all().order_by('-timestamp')
        serializer = CreditNoteCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        serializer = CreditNoteCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(credit_note=crn, created_by=request.user)

        CreditNoteHistory.objects.create(
            credit_note=crn,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": CreditNoteCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class CreditNoteAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        attachments = crn.attachments.all()
        serializer = CreditNoteAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        serializer = CreditNoteAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(credit_note=crn, uploaded_by=request.user)

        CreditNoteHistory.objects.create(
            credit_note=crn,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": CreditNoteAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        attachment = get_object_or_404(CreditNoteAttachment, pk=attach_pk, credit_note=crn)
        file_name = attachment.file.name
        attachment.delete()

        CreditNoteHistory.objects.create(
            credit_note=crn,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class CreditNoteHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        history = crn.history.all().order_by('-timestamp')
        serializer = CreditNoteHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


class CreditNotePDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        context = {
            'crn': crn,
            'items': crn.items.all(),
            'now': timezone.now(),
            'request': request,
        }
        html_string = render_to_string('credit_note_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="CRN_{crn.crn_id}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


class CreditNoteEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        crn = get_object_or_404(CreditNote, pk=pk)
        recipient = request.data.get('email')
        if not recipient:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'crn': crn,
            'items': crn.items.all(),
        }

        html_message = render_to_string('credit_note_email.html', context)

        email = EmailMessage(
            subject=f'Credit Note {crn.crn_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        return Response({"message": "Email sent successfully"})