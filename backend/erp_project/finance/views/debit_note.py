
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
from ..models.debit_note import DebitNote, DebitNoteItem, DebitNoteAttachment, DebitNoteComment, DebitNoteHistory
from ..serializers.debit_note import DebitNoteSerializer, DebitNoteWriteSerializer, DebitNoteAttachmentSerializer, DebitNoteCommentSerializer, DebitNoteHistorySerializer
from weasyprint import HTML
from io import BytesIO
from django.http import HttpResponse
from django.core.mail import EmailMessage
from django.conf import settings
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response
from django.core.paginator import Paginator
from rest_framework.permissions import IsAuthenticated

class DebitNoteListCreateView(generics.ListCreateAPIView):
    queryset = DebitNote.objects.select_related('purchase_order', 'supplier').order_by('-created_at')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return DebitNoteWriteSerializer
        return DebitNoteSerializer

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
            "message": "Debit Notes fetched successfully",
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
        dbn = serializer.save()
        return Response({
            "message": "Debit Note created successfully",
            "data": DebitNoteSerializer(dbn).data
        }, status=status.HTTP_201_CREATED)


class DebitNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DebitNote.objects.select_related('purchase_order', 'supplier')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DebitNoteSerializer
        return DebitNoteWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Debit Note fetched successfully",
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
            "message": "Debit Note updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Debit Note deleted successfully"})


class DebitNoteActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'mark_settled', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = dbn.payment_status

        if action == 'save_draft':
            dbn.payment_status = 'Draft'
            message = "Debit Note saved as draft"
        elif action == 'mark_settled':
            dbn.payment_status = 'Settled'
            message = "Debit Note marked as settled"
        elif action == 'cancel':
            dbn.payment_status = 'Cancelled'
            message = "Debit Note cancelled successfully"

        dbn.updated_by = request.user
        dbn.save()

        DebitNoteHistory.objects.create(
            debit_note=dbn,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {dbn.payment_status}"
        )

        return Response({"message": message})


class DebitNoteCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        comments = dbn.comments.all().order_by('-timestamp')
        serializer = DebitNoteCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        serializer = DebitNoteCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(debit_note=dbn, created_by=request.user)

        DebitNoteHistory.objects.create(
            debit_note=dbn,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": DebitNoteCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class DebitNoteAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        attachments = dbn.attachments.all()
        serializer = DebitNoteAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        serializer = DebitNoteAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(debit_note=dbn, uploaded_by=request.user)

        DebitNoteHistory.objects.create(
            debit_note=dbn,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": DebitNoteAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        attachment = get_object_or_404(DebitNoteAttachment, pk=attach_pk, debit_note=dbn)
        file_name = attachment.file.name
        attachment.delete()

        DebitNoteHistory.objects.create(
            debit_note=dbn,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class DebitNoteHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        history = dbn.history.all().order_by('-timestamp')
        serializer = DebitNoteHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


class DebitNotePDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        context = {
            'dbn': dbn,
            'items': dbn.items.all(),
            'now': timezone.now(),
            'request': request,
        }
        html_string = render_to_string('debit_note_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="DBN_{dbn.dbn_id}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


class DebitNoteEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dbn = get_object_or_404(DebitNote, pk=pk)
        recipient = request.data.get('email')
        if not recipient:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'dbn': dbn,
            'items': dbn.items.all(),
        }

        html_message = render_to_string('debit_note_email.html', context)

        email = EmailMessage(
            subject=f'Debit Note {dbn.dbn_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        return Response({"message": "Email sent successfully"})
    
