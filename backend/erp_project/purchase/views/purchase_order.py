from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination

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
    PurchaseOrder,
    PurchaseOrderHistory,
    PurchaseOrderAttachment,
)

from ..serializers import (
    PurchaseOrderSerializer,
    PurchaseOrderWriteSerializer,
    PurchaseOrderHistorySerializer,
    PurchaseOrderCommentSerializer,
    PurchaseOrderAttachmentSerializer,
)
from ..models import (
    StockReceipt,
    StockReceiptItem,
    SerialNumber,
    BatchNumber,
    BatchSerialNumber,
    StockReceiptHistory,
    StockReceiptAttachment,
)



class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    max_page_size = 100


class PurchaseOrderListCreateView(generics.ListCreateAPIView):
    queryset = PurchaseOrder.objects.select_related('supplier').order_by('-created_at')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    pagination_class = StandardPagination

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PurchaseOrderWriteSerializer
        return PurchaseOrderSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('limit', 10))

        paginator = Paginator(queryset, page_size)
        page = paginator.get_page(page_number)

        serializer = self.get_serializer(page, many=True)

        if paginator.count == 0:
            from_count = 0
            to_count = 0
        else:
            from_count = (page.number - 1) * page_size + 1
            to_count = from_count + len(page.object_list) - 1

        return Response({
            "message": "Purchase Orders fetched successfully",
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

        po = serializer.save()

        return Response({
            "message": "Purchase Order created successfully",
            "data": PurchaseOrderSerializer(po).data
        }, status=status.HTTP_201_CREATED)


class PurchaseOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PurchaseOrder.objects.select_related('supplier')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PurchaseOrderSerializer
        return PurchaseOrderWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response({
            "message": "Purchase Order fetched successfully",
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
            "message": "Purchase Order updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Purchase Order deleted successfully"
        })


class PurchaseOrderActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = po.status

        if action == 'save_draft':
            po.status = 'Draft'
            message = "Purchase Order saved as draft"

        elif action == 'submit':
            po.status = 'Submitted'
            message = "Purchase Order submitted successfully"

        elif action == 'cancel':
            po.status = 'Cancelled'
            message = "Purchase Order cancelled successfully"

        po.updated_by = request.user
        po.save()

        PurchaseOrderHistory.objects.create(
            purchase_order=po,
            action=action,
            performed_by=request.user,
            details=f"Status changed from {old_status} to {po.status}"
        )

        return Response({"message": message})


class PurchaseOrderPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)

        context = {
            'po': po,
            'items': po.items.all(),
            'subtotal': po.subtotal,
            'tax_summary': po.tax_summary,
            'total_order_value': po.total_order_value,
            'notes_comments': po.notes_comments,
            'now': timezone.now(),
            'request': request,
        }

        html_string = render_to_string('purchase_order_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())

        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="PO_{po.PO_ID}.pdf"'
        response.write(pdf_buffer.getvalue())

        return response


class PurchaseOrderEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)
        recipient = request.data.get('email')

        if not recipient:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'po': po,
            'items': po.items.all(),
            'subtotal': po.subtotal,
            'total_order_value': po.total_order_value,
        }

        html_message = render_to_string('purchase_order_email.html', context)

        email = EmailMessage(
            subject=f'Purchase Order {po.PO_ID}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )

        email.content_subtype = 'html'
        email.send()

        return Response({"message": "Email sent successfully"})


class PurchaseOrderCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)
        comments = po.comments.all().order_by('-timestamp')

        serializer = PurchaseOrderCommentSerializer(comments, many=True)

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)

        serializer = PurchaseOrderCommentSerializer(data=request.data)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            purchase_order=po,
            created_by=request.user
        )

        PurchaseOrderHistory.objects.create(
            purchase_order=po,
            action="Comment Added",
            performed_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": PurchaseOrderCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class PurchaseOrderAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)
        attachments = po.attachments.all()

        serializer = PurchaseOrderAttachmentSerializer(attachments, many=True)

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)

        serializer = PurchaseOrderAttachmentSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            purchase_order=po,
            uploaded_by=request.user
        )

        PurchaseOrderHistory.objects.create(
            purchase_order=po,
            action="Attachment Uploaded",
            performed_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": PurchaseOrderAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)

        attachment = get_object_or_404(
            PurchaseOrderAttachment,
            pk=attach_pk,
            purchase_order=po
        )

        file_name = attachment.file.name
        attachment.delete()

        PurchaseOrderHistory.objects.create(
            purchase_order=po,
            action="Attachment Deleted",
            performed_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({
            "message": "Attachment deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)


class PurchaseOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)
        history = po.history.all().order_by('-timestamp')

        serializer = PurchaseOrderHistorySerializer(history, many=True)

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })




class StockReceiptGenerateFromPOView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        po = get_object_or_404(PurchaseOrder, pk=pk)

        if po.status != 'Submitted':
            return Response({"message": "Cannot generate GRN from non-Submitted PO"}, status=400)

        if StockReceipt.objects.filter(po_reference=po).exists():
            return Response({"message": "Stock Receipt already exists for this PO"}, status=400)

        receipt = StockReceipt.objects.create(
            po_reference=po,
            supplier=po.supplier,
            received_date=timezone.now().date(),
            received_by=request.user,
            qc_done_by=request.user,
            status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        for po_item in po.items.all():
            StockReceiptItem.objects.create(
                stock_receipt=receipt,
                product=po_item.product,
                product_name=po_item.product_name,
                uom=po_item.uom,
                qty_ordered=po_item.qty_ordered,
                unit_price=po_item.unit_price,
                tax_rate=po_item.tax_rate,
                discount_rate=po_item.discount_rate,
            )

        PurchaseOrderHistory.objects.create(
            purchase_order=po,
            action="Stock Receipt Generated",
            performed_by=request.user,
            details=f"GRN {receipt.GRN_ID} created from PO"
        )

        return Response({
            "message": "Stock Receipt generated successfully from Purchase Order",
            "data": {
                "grn_id": receipt.id,
                "grn_number": receipt.GRN_ID,
                "url": f"/api/purchases/stock-receipts/{receipt.id}/"
            }
        }, status=status.HTTP_201_CREATED)