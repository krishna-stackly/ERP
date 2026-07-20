from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from django.db import transaction
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.utils import timezone
from django.conf import settings

from io import BytesIO
from weasyprint import HTML

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from ..models import (
    StockReceipt,
    StockReceiptHistory,
    StockReturn,
    StockReturnItem,
    StockReturnHistory,
    StockReturnAttachment,
)

from ..serializers import (
    StockReturnSerializer,
    StockReturnWriteSerializer,
    StockReturnCommentSerializer,
    StockReturnHistorySerializer,
    StockReturnAttachmentSerializer,
)

from .purchase_order import StandardPagination




class StockReturnListCreateView(generics.ListCreateAPIView):
    queryset = StockReturn.objects.select_related(
        'po_reference',
        'grn_reference',
        'supplier'
    ).order_by('-created_at')

    permission_classes = [IsAuthenticated, RoleBasedPermission]
    pagination_class = StandardPagination

    def get_serializer_class(self):
        if self.request.method == "POST":
            return StockReturnWriteSerializer
        return StockReturnSerializer

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
            "message": "Stock Returns fetched successfully",
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

        stock_return = serializer.save()

        return Response({
            "message": "Stock Return created successfully",
            "data": StockReturnSerializer(stock_return).data
        }, status=status.HTTP_201_CREATED)


class StockReturnDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StockReturn.objects.select_related('po_reference', 'grn_reference', 'supplier')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return StockReturnSerializer
        return StockReturnWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response({
            "message": "Stock Return fetched successfully",
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
            "message": "Stock Return updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Stock Return deleted successfully"
        })


class StockReturnActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        sr = get_object_or_404(StockReturn, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = sr.status

        if action == 'save_draft':
            sr.status = 'Draft'
            message = "Stock Return saved as draft"

        elif action == 'submit':
            sr.status = 'Submitted'
            message = "Stock Return submitted successfully"

        elif action == 'cancel':
            sr.status = 'Cancelled'
            message = "Stock Return cancelled successfully"

        sr.updated_by = request.user
        sr.save()

        StockReturnHistory.objects.create(
            stock_return=sr,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {sr.status}"
        )

        return Response({"message": message})


class StockReturnCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        sr = get_object_or_404(StockReturn, pk=pk)
        comments = sr.comments.all().order_by('-timestamp')

        serializer = StockReturnCommentSerializer(comments, many=True)

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        sr = get_object_or_404(StockReturn, pk=pk)

        serializer = StockReturnCommentSerializer(data=request.data)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            stock_return=sr,
            created_by=request.user
        )

        StockReturnHistory.objects.create(
            stock_return=sr,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": StockReturnCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class StockReturnAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        sr = get_object_or_404(StockReturn, pk=pk)
        attachments = sr.attachments.all()

        serializer = StockReturnAttachmentSerializer(attachments, many=True)

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        sr = get_object_or_404(StockReturn, pk=pk)

        serializer = StockReturnAttachmentSerializer(data=request.data)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            stock_return=sr,
            uploaded_by=request.user
        )

        StockReturnHistory.objects.create(
            stock_return=sr,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": StockReturnAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        sr = get_object_or_404(StockReturn, pk=pk)

        attachment = get_object_or_404(
            StockReturnAttachment,
            pk=attach_pk,
            stock_return=sr
        )

        file_name = attachment.file.name
        attachment.delete()

        StockReturnHistory.objects.create(
            stock_return=sr,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({
            "message": "Attachment deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)


class StockReturnHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        sr = get_object_or_404(StockReturn, pk=pk)
        history = sr.history.all().order_by('-timestamp')

        serializer = StockReturnHistorySerializer(history, many=True)

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


class StockReturnPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        sr = get_object_or_404(StockReturn, pk=pk)

        context = {
            'sr': sr,
            'items': sr.items.all(),
            'supplier': sr.supplier,
            'po_reference': sr.po_reference,
            'grn_reference': sr.grn_reference,
            'return_initiated_by': sr.return_initiated_by.get_full_name() if sr.return_initiated_by else 'N/A',
            'now': timezone.now(),
            'request': request,
        }

        html_string = render_to_string('stock_return_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())

        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="SRN_{sr.SRN_ID}.pdf"'
        response.write(pdf_buffer.getvalue())

        return response


class StockReturnEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        sr = get_object_or_404(StockReturn, pk=pk)
        recipient = request.data.get('email')

        if not recipient:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'sr': sr,
            'items': sr.items.all(),
        }

        html_message = render_to_string('stock_return_email.html', context)

        email = EmailMessage(
            subject=f'Stock Return {sr.SRN_ID}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )

        email.content_subtype = 'html'
        email.send()

        return Response({"message": "Email sent successfully"})
