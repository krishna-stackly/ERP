# DRF Imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination

# Django Imports
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import transaction
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.utils import timezone
from django.conf import settings

# Python Imports
import io
from io import BytesIO

# PDF / Report
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from weasyprint import HTML

# Core Utils & Permissions
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

# Purchase Models
from .models import (
    PurchaseOrder, PurchaseOrderItem, PurchaseOrderHistory,
    PurchaseOrderComment, PurchaseOrderAttachment
)

# Stock Receipt Models
from .models import (
    StockReceipt, StockReceiptItem, SerialNumber, BatchNumber,
    BatchSerialNumber, StockReceiptComment, StockReceiptHistory,
    StockReceiptAttachment
)

# Stock Return Models
from .models import (
    StockReturn, StockReturnItem, SerialNumberReturn,
    StockReturnComment, StockReturnHistory, StockReturnAttachment
)

# Purchase Serializers
from .serializers import (
    PurchaseOrderSerializer, PurchaseOrderWriteSerializer,
    PurchaseOrderItemSerializer, PurchaseOrderHistorySerializer,
    PurchaseOrderCommentSerializer, PurchaseOrderAttachmentSerializer
)

# Stock Receipt Serializers
from .serializers import (
    StockReceiptSerializer, StockReceiptWriteSerializer,
    StockReceiptItemSerializer, StockReceiptCommentSerializer,
    StockReceiptHistorySerializer, StockReceiptAttachmentSerializer,
    SerialNumberSerializer, BatchNumberSerializer,
    BatchSerialNumberSerializer
)

# Stock Return Serializers
from .serializers import (
    StockReturnSerializer, StockReturnWriteSerializer,
    StockReturnItemSerializer, SerialNumberReturnSerializer,
    StockReturnCommentSerializer, StockReturnHistorySerializer,
    StockReturnAttachmentSerializer
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

        # Log history
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

        # Auto-log to history
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
            purchase_order=po,           # ✅ FIX
            uploaded_by=request.user     # ✅ FIX
        )

        # Auto-log to history
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
        attachment = get_object_or_404(PurchaseOrderAttachment, pk=attach_pk, purchase_order=po)

        file_name = attachment.file.name
        attachment.delete()

        # Auto-log to history
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

        # Create new Stock Receipt
        receipt = StockReceipt.objects.create(
            po_reference=po,
            supplier=po.supplier,
            received_date=timezone.now().date(),
            received_by=request.user,
            qc_done_by=request.user,  # or leave null
            status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        # Copy all items from PO
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
                # qty_received / accepted / rejected = 0 initially
            )

        # Log on PO
        PurchaseOrderHistory.objects.create(
            purchase_order=po,
            action="Stock Receipt Generated",
            performed_by=request.user,
            details=f"GRN {receipt.GRN_ID} created from PO"
        )

        # Optional: update PO status
        # po.status = 'Partially Received'
        # po.save(update_fields=['status'])

        return Response({
            "message": "Stock Receipt generated successfully from Purchase Order",
            "data": {
                "grn_id": receipt.id,
                "grn_number": receipt.GRN_ID,
                "url": f"/api/purchases/stock-receipts/{receipt.id}/"
            }
        }, status=status.HTTP_201_CREATED)


        


class StockReceiptListCreateView(generics.ListCreateAPIView):
    queryset = StockReceipt.objects.select_related('po_reference', 'supplier').order_by('-created_at')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    pagination_class = StandardPagination

    def get_serializer_class(self):
        if self.request.method == "POST":
            return StockReceiptWriteSerializer
        return StockReceiptSerializer

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
            "message": "Stock Receipts fetched successfully",
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
        receipt = serializer.save()
        return Response({
            "message": "Stock Receipt created successfully",
            "data": StockReceiptSerializer(receipt).data
        }, status=status.HTTP_201_CREATED)


class StockReceiptDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StockReceipt.objects.select_related('po_reference', 'supplier')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return StockReceiptSerializer
        return StockReceiptWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Stock Receipt fetched successfully",
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
            "message": "Stock Receipt updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "message": "Stock Receipt deleted successfully"
        })


class StockReceiptActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = receipt.status

        if action == 'save_draft':
            receipt.status = 'Draft'
            message = "Stock Receipt saved as draft"
        elif action == 'submit':
            receipt.status = 'Submitted'
            message = "Stock Receipt submitted successfully"
        elif action == 'cancel':
            receipt.status = 'Cancelled'
            message = "Stock Receipt cancelled successfully"

        receipt.updated_by = request.user
        receipt.save()

        # Log history
        StockReceiptHistory.objects.create(
            stock_receipt=receipt,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {receipt.status}"
        )

        return Response({"message": message})


class StockReceiptCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)
        comments = receipt.comments.all().order_by('-timestamp')
        serializer = StockReceiptCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)

        serializer = StockReceiptCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            stock_receipt=receipt,
            created_by=request.user
        )

        StockReceiptHistory.objects.create(
            stock_receipt=receipt,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": StockReceiptCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class StockReceiptAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)
        attachments = receipt.attachments.all()
        serializer = StockReceiptAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)

        serializer = StockReceiptAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            stock_receipt=receipt,
            uploaded_by=request.user
        )

        StockReceiptHistory.objects.create(
            stock_receipt=receipt,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": StockReceiptAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)
        attachment = get_object_or_404(StockReceiptAttachment, pk=attach_pk, stock_receipt=receipt)

        file_name = attachment.file.name
        attachment.delete()

        StockReceiptHistory.objects.create(
            stock_receipt=receipt,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({
            "message": "Attachment deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)



class StockReceiptHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)
        history = receipt.history.all().order_by('-timestamp')
        serializer = StockReceiptHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })


# PDF 
class StockReceiptPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)

        context = {
            'receipt': receipt,
            'items': receipt.items.all(),
            'supplier': receipt.supplier,
            'po_reference': receipt.po_reference,
            'received_by': receipt.received_by.get_full_name() if receipt.received_by else 'N/A',
            'qc_done_by': receipt.qc_done_by.get_full_name() if receipt.qc_done_by else 'N/A',
            'now': timezone.now(),
            'request': request,
        }

        html_string = render_to_string('stock_receipt_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="GRN_{receipt.GRN_ID}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


# Email
class StockReceiptEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)
        email = request.data.get('email')
        if not email:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'receipt': receipt,
            'items': receipt.items.all(),
        }
        html_message = render_to_string('stock_receipt_email.html', context)
        email_msg = EmailMessage(
            subject=f'Stock Receipt {receipt.GRN_ID}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email]
        )
        email_msg.content_subtype = 'html'
        email_msg.send()

        return Response({"message": "Email sent successfully"})
    

# ────────────────────────────────────────────────
# Serial Numbers for Stock Item (when stock_dim = 'Serial')
# ────────────────────────────────────────────────
class SerialNumberView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, receipt_pk, item_pk):
        item = get_object_or_404(StockReceiptItem, pk=item_pk, stock_receipt_id=receipt_pk)
        if item.stock_dim != 'Serial':
            return Response({"message": "Item does not use serial numbers"}, status=400)
        serials = item.serial_numbers.all()
        serializer = SerialNumberSerializer(serials, many=True)
        return Response({
            "message": "Serial numbers fetched successfully",
            "data": serializer.data
        })

    def post(self, request, receipt_pk, item_pk):
        item = get_object_or_404(StockReceiptItem, pk=item_pk, stock_receipt_id=receipt_pk)
        if item.stock_dim != 'Serial':
            return Response({"message": "Item does not use serial numbers"}, status=400)

        serial_nos = request.data.get('serial_nos', [])
        if isinstance(serial_nos, str):
            serial_nos = [s.strip() for s in serial_nos.split(',') if s.strip()]

        created = []
        duplicates = []

        for serial_no in serial_nos:
            if SerialNumber.objects.filter(serial_no=serial_no).exists():
                duplicates.append(serial_no)
            else:
                serial = SerialNumber.objects.create(stock_receipt_item=item, serial_no=serial_no)
                created.append(SerialNumberSerializer(serial).data)

        if duplicates:
            return Response({
                "message": f"Duplicate serial numbers found: {', '.join(duplicates)}",
                "created": created,
                "duplicates": duplicates
            }, status=400)

        return Response({
            "message": f"{len(created)} serial numbers added successfully",
            "data": created
        }, status=status.HTTP_201_CREATED)


# ────────────────────────────────────────────────
# Batch Numbers (when stock_dim = 'Batch')
# ────────────────────────────────────────────────
class BatchNumberView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, receipt_pk, item_pk):
        item = get_object_or_404(StockReceiptItem, pk=item_pk, stock_receipt_id=receipt_pk)
        if item.stock_dim != 'Batch':
            return Response({"message": "Item does not use batch numbers"}, status=400)
        batches = item.batch_numbers.all()
        serializer = BatchNumberSerializer(batches, many=True)
        return Response({
            "message": "Batch numbers fetched successfully",
            "data": serializer.data
        })

    def post(self, request, receipt_pk, item_pk):
        item = get_object_or_404(StockReceiptItem, pk=item_pk, stock_receipt_id=receipt_pk)
        if item.stock_dim != 'Batch':
            return Response({"message": "Item does not use batch numbers"}, status=400)

        serializer = BatchNumberSerializer(data=request.data, context={'stock_receipt_item': item})
        if not serializer.is_valid():
            return validation_error_response(serializer)
        batch = serializer.save()

        return Response({
            "message": "Batch number added successfully",
            "data": BatchNumberSerializer(batch).data
        }, status=status.HTTP_201_CREATED)

class BatchSerialView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, receipt_pk, item_pk, batch_pk):
        item = get_object_or_404(StockReceiptItem, pk=item_pk, stock_receipt_id=receipt_pk)
        batch = get_object_or_404(BatchNumber, pk=batch_pk, stock_receipt_item=item)
        serials = batch.serial_numbers.all()
        serializer = BatchSerialNumberSerializer(serials, many=True)
        return Response({
            "message": "Batch serial numbers fetched successfully",
            "data": serializer.data
        })

    def post(self, request, receipt_pk, item_pk, batch_pk):
        item = get_object_or_404(StockReceiptItem, pk=item_pk, stock_receipt_id=receipt_pk)
        batch = get_object_or_404(BatchNumber, pk=batch_pk, stock_receipt_item=item)

        serial_nos = request.data.get('serial_nos', [])
        if isinstance(serial_nos, str):
            serial_nos = [s.strip() for s in serial_nos.split(',') if s.strip()]

        if not serial_nos:
            return Response({"message": "No serial numbers provided"}, status=400)

        # Current count of serials already linked to this batch
        existing_count = batch.serial_numbers.count()

        # New serials trying to be added
        new_count = len(serial_nos)

        # Total after adding
        total_after = existing_count + new_count

        if total_after > batch.batch_qty:
            return Response({
                "message": f"Cannot add {new_count} serials — total would exceed batch quantity ({batch.batch_qty}). "
                           f"Already have {existing_count}, max allowed: {batch.batch_qty - existing_count}"
            }, status=400)

        created = []
        duplicates = []

        for serial_no in serial_nos:
            if BatchSerialNumber.objects.filter(serial_no=serial_no).exists():
                duplicates.append(serial_no)
            else:
                serial = BatchSerialNumber.objects.create(batch_number=batch, serial_no=serial_no)
                created.append(BatchSerialNumberSerializer(serial).data)

        if duplicates:
            return Response({
                "message": f"Duplicate serial numbers found: {', '.join(duplicates)}",
                "created": created,
                "duplicates": duplicates
            }, status=400)

        return Response({
            "message": f"{len(created)} serial numbers added to batch {batch.batch_no} "
                       f"(total now: {existing_count + len(created)} / {batch.batch_qty})",
            "data": created
        }, status=status.HTTP_201_CREATED)



class StockReturnGenerateFromReceiptView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        receipt = get_object_or_404(StockReceipt, pk=pk)

        if receipt.status not in ['Submitted', 'Partially Returned']:
            return Response({"message": "Cannot generate Return from this receipt status"}, status=400)

        if StockReturn.objects.filter(grn_reference=receipt).exists():
            return Response({"message": "Stock Return already exists for this receipt"}, status=400)

        # Create new Stock Return
        sr = StockReturn.objects.create(
            grn_reference=receipt,
            po_reference=receipt.po_reference,
            supplier=receipt.supplier,
            received_date=receipt.received_date,
            return_date=timezone.now().date(),
            return_initiated_by=request.user,
            status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        # Copy only items with rejected_qty > 0
        for item in receipt.items.filter(rejected_qty__gt=0):
            StockReturnItem.objects.create(
                stock_return=sr,
                stock_receipt_item=item,
                product=item.product,
                product_name=item.product_name,
                uom=item.uom,
                qty_ordered=item.qty_ordered,
                qty_rejected=item.rejected_qty,
                unit_price=item.unit_price,
                tax_rate=item.tax_rate,
                discount_rate=item.discount_rate,
                # qty_returned = 0 initially
            )

        # Log on Receipt
        StockReceiptHistory.objects.create(
            stock_receipt=receipt,
            event_type="Stock Return Generated",
            action_by=request.user,
            details=f"SRN {sr.SRN_ID} created from GRN"
        )

        # Update Receipt status
        receipt.status = 'Partially Returned'
        receipt.save(update_fields=['status'])

        return Response({
            "message": "Stock Return generated successfully from Stock Receipt",
            "data": {
                "srn_id": sr.id,
                "srn_number": sr.SRN_ID,
                "url": f"/api/purchases/stock-returns/{sr.id}/"
            }
        }, status=status.HTTP_201_CREATED)




class StockReturnListCreateView(generics.ListCreateAPIView):
    queryset = StockReturn.objects.select_related('po_reference', 'grn_reference', 'supplier').order_by('-created_at')
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
        attachment = get_object_or_404(StockReturnAttachment, pk=attach_pk, stock_return=sr)

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