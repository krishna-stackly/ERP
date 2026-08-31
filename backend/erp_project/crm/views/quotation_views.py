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

from crm.models.quotation_models import (
    Quotation,
    QuotationAttachment,
    QuotationComment,
    QuotationHistory,
    QuotationRevision,
)

from crm.serializers.quotation_serializers import (
    QuotationSerializer,
    QuotationWriteSerializer,
    QuotationAttachmentSerializer,
    QuotationCommentSerializer,
    QuotationHistorySerializer,
)


class QuotationListCreateView(generics.ListCreateAPIView):
    queryset = Quotation.objects.select_related(
        'customer',
        'sales_rep'
    ).order_by('-created_at')

    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_queryset(self):
        expired = self.queryset.filter(
            expiry_date__lt=timezone.now().date(),
            status__in=['Draft', 'Submitted', 'Approved']
        )
        expired.update(status='Expired')
        return self.queryset

    def get_serializer_class(self):
        if self.request.method == "POST":
            return QuotationWriteSerializer
        return QuotationSerializer
    
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
            "message": "Quotations fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    def create(self, request, *args, **kwargs):
        serializer = QuotationWriteSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        quotation = serializer.save()

        return Response({
            "message": "Quotation created successfully",
            "data": QuotationSerializer(quotation).data
        }, status=status.HTTP_201_CREATED)


class QuotationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quotation.objects.select_related('customer', 'sales_rep')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return QuotationSerializer
        return QuotationWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        return Response({
            "message": "Quotation fetched successfully",
            "data": QuotationSerializer(instance).data
        })

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = QuotationWriteSerializer(
            instance,
            data=request.data,
            partial=True,
            context={'request': request}
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        serializer.save()

        return Response({
            "message": "Quotation updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Quotation deleted successfully"
        })


class QuotationCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        quotation = get_object_or_404(Quotation, pk=pk)
        comments = quotation.comments.all().order_by('-timestamp')

        serializer = QuotationCommentSerializer(comments, many=True)

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        quotation = get_object_or_404(Quotation, pk=pk)

        serializer = QuotationCommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        comment = serializer.save(
            quotation=quotation,
            comment_by=request.user
        )

        QuotationHistory.objects.create(
            quotation=quotation,
            event_type='comment_added',
            action_by=request.user,
            extra_info=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": QuotationCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class QuotationHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        quotation = get_object_or_404(Quotation, pk=pk)
        history = quotation.history.all().order_by('-timestamp')

        serializer = QuotationHistorySerializer(history, many=True)

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


class QuotationActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        quotation = get_object_or_404(Quotation, id=pk)
        action = request.data.get('action')

        allowed_transitions = {
            'Draft': ['save_draft', 'submit'],
            'Submitted': ['approve', 'reject', 'revise'],
            'Approved': ['convert_to_so'],
            'Rejected': [],
            'Converted to SO': [],
            'Expired': [],
        }

        if action not in allowed_transitions.get(quotation.status, []):
            return Response({
                'message': f'Action {action} not allowed in {quotation.status} state'
            }, status=400)

        old_status = quotation.status
        message = "Action performed successfully"

        if action == 'save_draft':
            quotation.status = 'Draft'
            message = "Quotation saved as draft"

        elif action == 'submit':
            quotation.status = 'Submitted'
            message = "Quotation submitted successfully"

        elif action == 'approve':
            quotation.status = 'Approved'
            message = "Quotation approved successfully"

        elif action == 'reject':
            quotation.status = 'Rejected'
            message = "Quotation rejected successfully"

        elif action == 'convert_to_so':
            quotation.status = 'Converted to SO'
            message = "Quotation converted to Sales Order successfully"

        elif action == 'revise':
            revision_no = quotation.revise_count + 1

            QuotationRevision.objects.create(
                quotation=quotation,
                revision_no=revision_no,
                created_by=request.user,
                comment=request.data.get('comment', ''),
                status='Submitted'
            )

            quotation.revise_count = revision_no
            quotation.status = 'Submitted'
            message = "Quotation revised successfully"

        quotation.updated_by = request.user
        quotation.save()

        if quotation.status != old_status:
            QuotationHistory.objects.create(
                quotation=quotation,
                event_type='status_change',
                status=quotation.status,
                action_by=request.user
            )

        return Response({"message": message})


class QuotationAttachmentView(generics.ListCreateAPIView):
    serializer_class = QuotationAttachmentSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return QuotationAttachment.objects.filter(
            quotation_id=self.kwargs['pk']
        )

    def perform_create(self, serializer):
        quotation = get_object_or_404(Quotation, id=self.kwargs['pk'])

        serializer.save(
            quotation=quotation,
            uploaded_by=self.request.user
        )

    def delete(self, request, pk, attachment_id=None):
        if not attachment_id:
            return Response(
                {"message": "Attachment ID required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        attachment = get_object_or_404(
            QuotationAttachment,
            id=attachment_id,
            quotation_id=pk
        )

        attachment.delete()

        return Response(
            {"message": "Attachment deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


class QuotationPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        quotation = get_object_or_404(Quotation, id=pk)

        context = {
            'quotation': quotation,
            'items': quotation.items.all(),
            'subtotal': quotation.subtotal,
            'tax_summary': quotation.tax_summary,
            'global_discount': quotation.global_discount,
            'shipping_charges': quotation.shipping_charges,
            'rounding_adjustment': quotation.rounding_adjustment,
            'grand_total': quotation.grand_total,
            'comments': quotation.comments.all(),
            'history': quotation.history.all(),
            'revisions': quotation.revisions.all()
        }

        html_string = render_to_string('quotation_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())

        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        QuotationHistory.objects.create(
            quotation=quotation,
            event_type='pdf_generated',
            action_by=request.user
        )

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = (
            f'attachment; filename="Quotation_{quotation.quotation_id}.pdf"'
        )
        response.write(pdf_buffer.getvalue())

        return response


class QuotationMailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        quotation = get_object_or_404(Quotation, id=pk)

        recipient = request.data.get(
            'email',
            quotation.customer.email
        )

        context = {
            'quotation': quotation,
            'items': quotation.items.all(),
            'subtotal': quotation.subtotal,
            'tax_summary': quotation.tax_summary,
            'grand_total': quotation.grand_total
        }

        html_message = render_to_string(
            'quotation_email.html',
            context
        )

        email = EmailMessage(
            subject=f'Quotation {quotation.quotation_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )

        email.content_subtype = 'html'
        email.send()

        QuotationHistory.objects.create(
            quotation=quotation,
            event_type='email_sent',
            extra_info=f"sent to {recipient}",
            action_by=request.user
        )

        return Response({
            'message': 'Email sent successfully'
        }, status=200)
