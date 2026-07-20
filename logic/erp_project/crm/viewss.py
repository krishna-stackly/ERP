# =======================
# DRF
# =======================
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

# =======================
# Django Core
# =======================
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMessage
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

# =======================
# Third-Party
# =======================
from weasyprint import HTML
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

# =======================
# Python Standard Library
# =======================
from io import BytesIO
import io

# =======================
# Core App
# =======================
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

# =======================
# Purchase App
# =======================
from purchase.models import PurchaseOrder, PurchaseOrderItem
from purchase.serializers import PurchaseOrderSerializer

# =======================
# CRM / Sales Models
# =======================
from .models import (
    Enquiry, EnquiryItem,
    Quotation, QuotationItem, QuotationAttachment, QuotationComment,
    QuotationHistory, QuotationRevision,
    SalesOrder, SalesOrderItem, SalesOrderComment, SalesOrderHistory,
    DeliveryNote, DeliveryNoteItem, DeliveryNoteAttachment,
    DeliveryNoteCustomerAcknowledgement, DeliveryNoteComment, DeliveryNoteHistory,
    DeliveryNoteReturn, DeliveryNoteReturnItem, DeliveryNoteReturnAttachment,
    DeliveryNoteReturnHistory, DeliveryNoteReturnComment, DeliveryNoteReturnSerial,
    Invoice, InvoiceItem, InvoiceAttachment, InvoiceComment, InvoiceHistory,
    InvoiceReturn, InvoiceReturnItem, InvoiceReturnAttachment,
    InvoiceReturnComment, InvoiceReturnHistory
)

# =======================
# CRM / Sales Serializers
# =======================
from .serializers import (
    EnquirySerializer, EnquiryWriteSerializer,
    QuotationSerializer, QuotationWriteSerializer,
    QuotationRevisionSerializer, QuotationCommentSerializer,
    QuotationHistorySerializer,
    QuotationAttachmentSerializer,

    SalesOrderSerializer, SalesOrderWriteSerializer,
    SalesOrderCommentSerializer, SalesOrderHistorySerializer,

    DeliveryNoteSerializer, DeliveryNoteWriteSerializer,
    DeliveryNoteItemSerializer, DeliveryNoteAttachmentSerializer,
    DeliveryNoteCustomerAcknowledgementSerializer,
    DeliveryNoteCommentSerializer, DeliveryNoteHistorySerializer,

    InvoiceSerializer, InvoiceWriteSerializer,
    InvoiceItemSerializer, InvoiceAttachmentSerializer,
    InvoiceCommentSerializer, InvoiceHistorySerializer,

    InvoiceReturnSerializer, InvoiceReturnWriteSerializer,
    InvoiceReturnItemSerializer, InvoiceReturnAttachmentSerializer,
    InvoiceReturnCommentSerializer, InvoiceReturnHistorySerializer,

    DeliveryNoteReturnSerializer, DeliveryNoteReturnWriteSerializer,
    DeliveryNoteReturnItemSerializer, DeliveryNoteReturnAttachmentSerializer,
    DeliveryNoteReturnHistorySerializer, DeliveryNoteReturnCommentSerializer
)

class EnquiryListCreateView(generics.ListCreateAPIView):
    queryset = Enquiry.objects.select_related('user').order_by('-created_at')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EnquirySerializer
        return EnquiryWriteSerializer

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.role.role.lower() == 'admin':
            return Enquiry.objects.all()
        return Enquiry.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('limit', 10))

        paginator = Paginator(queryset, page_size)
        page = paginator.get_page(page_number)

        serializer = self.get_serializer(page, many=True)

        from_count = (page.number - 1) * page_size + 1
        to_count = from_count + len(page.object_list) - 1 if page.object_list else 0

        # Proper "No Data Found"
        if not page.object_list:
            return Response({
                "message": "No Data Found",
                "data": {
                    "from": 0,
                    "to": 0,
                    "totalCount": 0,
                    "totalPages": 0,
                    "data": []
                }
            })

        return Response({
            "message": "Enquiries fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    #Clean error response
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=400)   # Field-level errors

        self.perform_create(serializer)
        instance = serializer.instance
        detail_serializer = EnquirySerializer(instance, context={'request': request})
        return Response({
            "message": "Enquiry created successfully",
            "data": detail_serializer.data
        }, status=status.HTTP_201_CREATED)


class EnquiryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Enquiry.objects.select_related('user')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EnquirySerializer
        return EnquiryWriteSerializer

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.role.role.lower() == 'admin':
            return Enquiry.objects.all()
        return Enquiry.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Enquiry fetched successfully",
            "data": serializer.data
        })

    # Clean error response 
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=400)   # Field-level errors

        self.perform_update(serializer)
        return Response({
            "message": "Enquiry updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "message": "Enquiry deleted successfully"
        })




class QuotationListCreateView(generics.ListCreateAPIView):
    queryset = Quotation.objects.select_related('customer', 'sales_rep').order_by('-created_at')
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
        write_serializer = QuotationWriteSerializer(
            data=request.data,
            context={'request': request}
        )
        if not write_serializer.is_valid():
            return validation_error_response(write_serializer)
        quotation = write_serializer.save()

        read_serializer = QuotationSerializer(quotation)
        return Response({
            "message": "Quotation created successfully",
            "data": read_serializer.data
        }, status=201)


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
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Quotation fetched successfully",
            "data": serializer.data
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
        quotation = serializer.save()

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

        # Auto-log to history
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
        try:
            quotation = Quotation.objects.get(id=pk)
            action = request.data.get('action')

            allowed_transitions = {
                'Draft': ['save_draft', 'submit'],
                'Submitted': ['approve', 'reject', 'revise'],
                'Approved': ['convert_to_so'],
                'Rejected': [],
                'Converted to SO': [],
                'Expired': []
            }

            if action not in allowed_transitions.get(quotation.status, []):
                return Response({'message': f'Action {action} not allowed in {quotation.status} state'}, status=400)

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
        except Quotation.DoesNotExist:
            return Response({'message': 'Quotation not found'}, status=404)



class QuotationAttachmentView(generics.ListCreateAPIView):
    serializer_class = QuotationAttachmentSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        quotation_id = self.kwargs['pk']
        return QuotationAttachment.objects.filter(quotation_id=quotation_id)

    def perform_create(self, serializer):
        quotation = get_object_or_404(Quotation, id=self.kwargs['pk'])
        serializer.save(
            quotation=quotation,
            uploaded_by=self.request.user
        )

    def delete(self, request, pk, attachment_id=None):
        """
        Delete single attachment belonging to this quotation
        """
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
        try:
            quotation = Quotation.objects.get(id=pk)
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

            # Log PDF generation
            QuotationHistory.objects.create(
                quotation=quotation,
                event_type='pdf_generated',
                action_by=request.user
            )

            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="Quotation_{quotation.quotation_id}.pdf"'
            response.write(pdf_buffer.getvalue())
            return response
        except Quotation.DoesNotExist:
            return Response({'error': 'Quotation not found'}, status=404)


class QuotationMailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        try:
            quotation = Quotation.objects.get(id=pk)
            recipient = request.data.get('email', quotation.customer.email)

            context = {
                'quotation': quotation,
                'items': quotation.items.all(),
                'subtotal': quotation.subtotal,
                'tax_summary': quotation.tax_summary,
                'grand_total': quotation.grand_total
            }

            html_message = render_to_string('quotation_email.html', context)

            email = EmailMessage(
                subject=f'Quotation {quotation.quotation_id}',
                body=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient]
            )
            email.content_subtype = 'html'
            email.send()

            # Log email sent
            QuotationHistory.objects.create(
                quotation=quotation,
                event_type='email_sent',
                extra_info=f"sent to {recipient}",
                action_by=request.user
            )

            return Response({'message': 'Email sent successfully'}, status=200)
        except Quotation.DoesNotExist:
            return Response({'error': 'Quotation not found'}, status=404)


class GeneratePurchaseOrderFromSalesOrderView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, pk=pk)

        if sales_order.status not in ['Submitted', 'Submitted(PD)', 'Partially Delivered']:
            return Response(
                {"message": "Cannot generate PO from this Sales Order status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        partial = request.data.get('partial', False)  # default full generation

        # Find items with insufficient stock
        insufficient_items = []
        for so_item in sales_order.items.all():
            available = so_item.product.quantity  # adjust field name if different in your Product model
            required = so_item.quantity

            if available < required:
                qty_to_order = required - available if not partial else required
                insufficient_items.append({
                    'product': so_item.product,
                    'qty_ordered': qty_to_order,
                    'unit_price': so_item.unit_price,
                    'tax_rate': so_item.tax_rate,
                    'discount_rate': so_item.discount,
                })

        if not insufficient_items:
            return Response(
                {"message": "All items are in stock — no Purchase Order needed"},
                status=status.HTTP_200_OK
            )

        # Create new Purchase Order
        po = PurchaseOrder.objects.create(
            supplier=sales_order.customer.supplier,  # adjust if Customer has no supplier field
            po_date=timezone.now().date(),
            delivery_date=sales_order.expected_delivery,
            status='Draft',
            currency=sales_order.currency,
            payment_terms=sales_order.payment_method,
            notes_comments=f"Auto-generated from Sales Order {sales_order.sales_order_id}",
            created_by=request.user,
            updated_by=request.user
        )

        # Add items to PO
        for item_data in insufficient_items:
            PurchaseOrderItem.objects.create(
                purchase_order=po,
                product=item_data['product'],
                qty_ordered=item_data['qty_ordered'],
                unit_price=item_data['unit_price'],
                tax_rate=item_data['tax_rate'],
                discount_rate=item_data['discount_rate'],
            )

        # Recalculate PO totals (your existing method)
        po.calculate_summary()

        # Log on Sales Order
        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='po_generated',
            extra_info=f"PO {po.PO_ID} created (partial={partial})",
            action_by=request.user
        )

        # Optional: update SO status if needed
        # sales_order.status = 'Ready for Delivery'  # or whatever fits your flow
        # sales_order.save(update_fields=['status'])

        return Response({
            "message": f"Purchase Order {po.PO_ID} generated successfully",
            "data": {
                "po_id": po.id,
                "po_number": po.PO_ID,
                "status": po.status,
                "items_generated": len(insufficient_items),
                "url": f"/api/purchases/purchase-orders/{po.id}/"
            }
        }, status=status.HTTP_201_CREATED)


class GenerateDeliveryNoteFromSalesOrderView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, pk=pk)

        if sales_order.status not in ['Submitted', 'Submitted(PD)', 'Partially Delivered']:
            return Response(
                {"message": "Cannot generate Delivery Note from this Sales Order status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate generation
        if DeliveryNote.objects.filter(sales_order=sales_order).exists():
            return Response(
                {"message": "Delivery Note already generated for this Sales Order"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Delivery Note
        dn = DeliveryNote.objects.create(
            sales_order=sales_order,
            customer=sales_order.customer,
            delivery_date=sales_order.expected_delivery or timezone.now().date(),
            destination_address=sales_order.customer.address or "N/A",  # adjust field name
            delivered_by=request.user.get_full_name(),
            delivery_type='Regular',
            status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        # Copy all items from Sales Order
        for so_item in sales_order.items.all():
            DeliveryNoteItem.objects.create(
                delivery_note=dn,
                product=so_item.product,
                quantity=so_item.quantity,
                uom=so_item.uom,
                # serial_numbers start empty — user adds later via PATCH
            )

        # Log history on Sales Order
        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='delivery_note_generated',
            extra_info=f"DN {dn.dn_id} created from SO {sales_order.sales_order_id}",
            action_by=request.user
        )

        # Optional: update Sales Order status
        # sales_order.status = 'Partially Delivered'  # or 'Ready for Delivery'
        # sales_order.save(update_fields=['status'])

        return Response({
            "message": f"Delivery Note {dn.dn_id} generated successfully",
            "data": {
                "delivery_note_id": dn.id,
                "delivery_note_number": dn.dn_id,
                "delivery_note_url": f"/api/delivery-notes/{dn.id}/",
                "sales_order_id": sales_order.id
            }
        }, status=status.HTTP_201_CREATED)

class GenerateInvoiceFromSalesOrderView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, pk=pk)

        # Only allow from Submitted or later statuses
        if sales_order.status not in ['Submitted', 'Submitted(PD)', 'Partially Delivered', 'Delivered']:
            return Response(
                {"message": "Cannot generate Invoice from this Sales Order status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate
        if Invoice.objects.filter(sales_order=sales_order).exists():
            return Response(
                {"message": "Invoice already generated for this Sales Order"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Invoice
        invoice = Invoice.objects.create(
            sales_order=sales_order,
            customer=sales_order.customer,
            invoice_date=timezone.now().date(),
            due_date=sales_order.due_date or (timezone.now().date() + timezone.timedelta(days=30)),
            billing_address=sales_order.customer.address or "N/A",  # adjust field
            shipping_address=sales_order.customer.address or "N/A",
            currency=sales_order.currency,
            payment_terms='Net 30',  # default, can be overridden
            invoice_status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        # Copy items from Sales Order
        for so_item in sales_order.items.all():
            InvoiceItem.objects.create(
                invoice=invoice,
                product=so_item.product,
                quantity=so_item.quantity,
                unit_price=so_item.unit_price,
                tax_rate=so_item.tax_rate,
                discount_rate=so_item.discount,
                uom=so_item.uom,
                # returned_qty_cus = 0 initially
            )

        # Log on Sales Order
        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='invoice_generated',
            extra_info=f"INV {invoice.invoice_id} created from SO {sales_order.sales_order_id}",
            action_by=request.user
        )

        # Optional: update SO status
        # sales_order.status = 'Invoiced'
        # sales_order.save(update_fields=['status'])

        return Response({
            "message": f"Invoice {invoice.invoice_id} generated successfully",
            "data": {
                "invoice_id": invoice.id,
                "invoice_number": invoice.invoice_id,
                "invoice_url": f"/api/invoices/{invoice.id}/",
                "sales_order_id": sales_order.id
            }
        }, status=status.HTTP_201_CREATED)

class SalesOrderListCreateView(generics.ListCreateAPIView):
    queryset = SalesOrder.objects.select_related('customer', 'sales_rep').order_by('-created_at')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return SalesOrderWriteSerializer
        return SalesOrderSerializer

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
            "message": "Sales Orders fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    def create(self, request, *args, **kwargs):
        write_serializer = SalesOrderWriteSerializer(
            data=request.data,
            context={'request': request}
        )
        if not write_serializer.is_valid():
            return validation_error_response(write_serializer)
        sales_order = write_serializer.save()

        read_serializer = SalesOrderSerializer(sales_order)
        return Response({
            "message": "Sales Order created successfully",
            "data": read_serializer.data
        }, status=status.HTTP_201_CREATED)


class SalesOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalesOrder.objects.select_related('customer', 'sales_rep')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return SalesOrderSerializer
        return SalesOrderWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Sales Order fetched successfully",
            "data": serializer.data
        })

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = SalesOrderWriteSerializer(
            instance,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return validation_error_response(serializer)
        sales_order = serializer.save()
        return Response({
            "message": "Sales Order updated successfully"
        })


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "message": "Sales Order deleted successfully"
        })

class SalesOrderActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, id=pk)
        action = request.data.get('action')

        allowed_transitions = {
            'Draft': ['save_draft', 'submit', 'submit_pd', 'cancel'],
            'Ready to Submit': ['submit', 'submit_pd', 'cancel'],
            'Submitted': [ 'convert_to_invoice', 'cancel'],
            'Submitted(PD)': [ 'convert_to_invoice', 'cancel'],
            'Partially Delivered': [ 'convert_to_invoice'],
            'Delivered': [],
            'Cancelled': [],
        }

        if action not in allowed_transitions.get(sales_order.status, []):
            return Response(
                {'error': f'Action "{action}" not allowed in status "{sales_order.status}"'},
                status=status.HTTP_400_BAD_REQUEST
            )

        old_status = sales_order.status

        if action == 'save_draft':
            sales_order.status = 'Draft'
        elif action == 'submit':
            insufficient = []
            for item in sales_order.items.all():
                available = item.product.quantity  # adjust field name if needed
                if available < item.quantity:
                    insufficient.append({
                        'product': item.product.id,
                        'required': item.quantity,
                        'available': available
                    })
            if insufficient:
                return Response(
                    {'error': 'insufficient_stock', 'details': insufficient},
                    status=status.HTTP_400_BAD_REQUEST
                )
            sales_order.status = 'Submitted'
        elif action == 'submit_pd':
            sales_order.status = 'Submitted(PD)'
        elif action == 'cancel':
            sales_order.status = 'Cancelled'

        sales_order.updated_by = request.user
        sales_order.save()

        if sales_order.status != old_status:
            SalesOrderHistory.objects.create(
                sales_order=sales_order,
                event_type='status_change',
                status=sales_order.status,
                action_by=request.user
            )

        return Response(SalesOrderSerializer(sales_order).data, status=200)


class SalesOrderPDFView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, id=pk)
        context = {
            'sales_order': sales_order,
            'items': sales_order.items.all(),
            'subtotal': sales_order.subtotal,
            'tax_summary': sales_order.tax_summary,
            'global_discount': sales_order.global_discount,
            'shipping_charges': sales_order.shipping_charges,
            'rounding_adjustment': sales_order.rounding_adjustment,
            'grand_total': sales_order.grand_total,
            'comments': sales_order.comments.all(),
            'history': sales_order.history.all()
        }

        html_string = render_to_string('sales_order_pdf.html', context)  # Assume template exists
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='pdf_generated',
            action_by=request.user
        )

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="SalesOrder_{sales_order.sales_order_id}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


class SalesOrderMailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, id=pk)
        recipient = request.data.get('email', sales_order.customer.email)  # Assume customer has email

        context = {
            'sales_order': sales_order,
            'items': sales_order.items.all(),
            'subtotal': sales_order.subtotal,
            'tax_summary': sales_order.tax_summary,
            'grand_total': sales_order.grand_total
        }

        html_message = render_to_string('sales_order_email.html', context)  # Assume template

        email = EmailMessage(
            subject=f'Sales Order {sales_order.sales_order_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='email_sent',
            extra_info=f"sent to {recipient}",
            action_by=request.user
        )

        return Response({'message': 'Email sent successfully'}, status=200)





class SalesOrderCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, pk=pk)
        comments = sales_order.comments.all().order_by('-timestamp')
        serializer = SalesOrderCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, pk=pk)

        serializer = SalesOrderCommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        comment = serializer.save(
            sales_order=sales_order,
            comment_by=request.user
        )

        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='comment_added',
            action_by=request.user,
            extra_info=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": SalesOrderCommentSerializer(comment).data
        }, status=201)



class SalesOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, pk=pk)
        history = sales_order.history.all().order_by('-timestamp')
        serializer = SalesOrderHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })



class DeliveryNoteListCreateView(generics.ListCreateAPIView):
    queryset = DeliveryNote.objects.select_related('sales_order', 'customer').order_by('-created_at')
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
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        dn = serializer.save()
        return Response({
            "message": "Delivery Note created successfully",
            "data": DeliveryNoteSerializer(dn).data
        }, status=status.HTTP_201_CREATED)


class DeliveryNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DeliveryNote.objects.select_related('sales_order', 'customer')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DeliveryNoteSerializer
        return DeliveryNoteWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Delivery Note fetched successfully",
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
            "message": "Delivery Note updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Delivery Note deleted successfully"})


class DeliveryNoteActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel_dn']:
            return Response({"message": "Invalid action"}, status=400)

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

        return Response({"message": message})


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

        comment = serializer.save(delivery_note=dn, created_by=request.user)

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
        serializer = DeliveryNoteAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)
        serializer = DeliveryNoteAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(delivery_note=dn, uploaded_by=request.user)

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
        attachment = get_object_or_404(DeliveryNoteAttachment, pk=attach_pk, delivery_note=dn)

        file_name = attachment.file.name
        attachment.delete()

        DeliveryNoteHistory.objects.create(
            delivery_note=dn,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


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
        response['Content-Disposition'] = f'attachment; filename="DN_{dn.dn_id}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


class DeliveryNoteEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dn = get_object_or_404(DeliveryNote, pk=pk)
        recipient = request.data.get('email')
        if not recipient:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'dn': dn,
            'items': dn.items.all(),
        }

        html_message = render_to_string('delivery_note_email.html', context)

        email = EmailMessage(
            subject=f'Delivery Note {dn.dn_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        return Response({"message": "Email sent successfully"})


class GenerateInvoiceFromDeliveryNoteView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        delivery_note = get_object_or_404(DeliveryNote, pk=pk)

        # Only allow from Submitted or later
        if delivery_note.status not in ['Submitted', 'Partially Delivered', 'Delivered']:
            return Response(
                {"message": "Cannot generate Invoice from this Delivery Note status (must be Submitted or later)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate (optional: check if already invoiced)
        if Invoice.objects.filter(sales_order=delivery_note.sales_order).exists():
            return Response(
                {"message": "Invoice already generated for the related Sales Order"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Invoice from Delivery Note
        invoice = Invoice.objects.create(
            sales_order=delivery_note.sales_order,
            customer=delivery_note.customer,
            invoice_date=timezone.now().date(),
            due_date=timezone.now().date() + timezone.timedelta(days=30),
            billing_address=delivery_note.destination_address,
            shipping_address=delivery_note.destination_address,
            currency='INR',  # default or from SO
            payment_terms='Net 30',
            invoice_status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        # Copy items from Delivery Note
        for dn_item in delivery_note.items.all():
            InvoiceItem.objects.create(
                invoice=invoice,
                product=dn_item.product,
                quantity=dn_item.quantity,
                unit_price=dn_item.product.unit_price or 0.00,  # adjust field
                tax_rate=0.00,  # add logic if you have tax
                discount_rate=0.00,
                uom=dn_item.uom,
                returned_qty_cus=0
            )

        # Log on Delivery Note (if you have history model)
        # DeliveryNoteHistory.objects.create(... 'invoice_generated' ...)

        return Response({
            "message": f"Invoice {invoice.invoice_id} generated successfully from Delivery Note {delivery_note.dn_id}",
            "data": {
                "invoice_id": invoice.id,
                "invoice_number": invoice.invoice_id,
                "invoice_url": f"/api/invoices/{invoice.id}/"
            }
        }, status=status.HTTP_201_CREATED)



class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.select_related('sales_order', 'customer').order_by('-created_at')
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
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        invoice = serializer.save()
        return Response({
            "message": "Invoice created successfully",
            "data": InvoiceSerializer(invoice).data
        }, status=status.HTTP_201_CREATED)


class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.select_related('sales_order', 'customer')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return InvoiceSerializer
        return InvoiceWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Invoice fetched successfully",
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
            "message": "Invoice updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Invoice deleted successfully"})


class InvoiceActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'send_invoice', 'mark_as_paid', 'cancel_invoice']:
            return Response({"message": "Invalid action"}, status=400)

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

        return Response({"message": message})


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

        comment = serializer.save(invoice=invoice, created_by=request.user)

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
        serializer = InvoiceAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)
        serializer = InvoiceAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(invoice=invoice, uploaded_by=request.user)

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
        attachment = get_object_or_404(InvoiceAttachment, pk=attach_pk, invoice=invoice)

        file_name = attachment.file.name
        attachment.delete()

        InvoiceHistory.objects.create(
            invoice=invoice,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


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
        response['Content-Disposition'] = f'attachment; filename="INV_{invoice.invoice_id}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


class InvoiceEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)
        recipient = request.data.get('email')
        if not recipient:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'invoice': invoice,
            'items': invoice.items.all(),
        }

        html_message = render_to_string('invoice_email.html', context)

        email = EmailMessage(
            subject=f'Invoice {invoice.invoice_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        return Response({"message": "Email sent successfully"})       

class GenerateInvoiceReturnFromInvoiceView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        invoice = get_object_or_404(Invoice, pk=pk)

        # Placeholder logic - later create real InvoiceReturn model
        return Response({
            "message": f"Invoice Return generated from Invoice {invoice.invoice_id} (placeholder)",
            "data": {
                "invoice_return_id": "IR-0001 (placeholder)",
                "url": "/api/invoice-returns/1/"
            }
        }, status=status.HTTP_201_CREATED)




class InvoiceReturnListCreateView(generics.ListCreateAPIView):
    queryset = InvoiceReturn.objects.select_related('invoice', 'customer').order_by('-created_at')
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
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        ir = serializer.save()
        return Response({
            "message": "Invoice Return created successfully",
            "data": InvoiceReturnSerializer(ir).data
        }, status=status.HTTP_201_CREATED)


class InvoiceReturnDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InvoiceReturn.objects.select_related('invoice', 'customer')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return InvoiceReturnSerializer
        return InvoiceReturnWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Invoice Return fetched successfully",
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
            "message": "Invoice Return updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Invoice Return deleted successfully"})


class InvoiceReturnActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

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

        return Response({"message": message})


class InvoiceReturnCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        comments = ir.comments.all().order_by('-timestamp')
        serializer = InvoiceReturnCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        serializer = InvoiceReturnCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(invoice_return=ir, created_by=request.user)

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
        serializer = InvoiceReturnAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        serializer = InvoiceReturnAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(invoice_return=ir, uploaded_by=request.user)

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
        attachment = get_object_or_404(InvoiceReturnAttachment, pk=attach_pk, invoice_return=ir)

        file_name = attachment.file.name
        attachment.delete()

        InvoiceReturnHistory.objects.create(
            invoice_return=ir,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class InvoiceReturnHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        history = ir.history.all().order_by('-timestamp')
        serializer = InvoiceReturnHistorySerializer(history, many=True)
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

        html_string = render_to_string('invoice_return_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="INVR_{ir.invoice_return_id}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


class InvoiceReturnEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        ir = get_object_or_404(InvoiceReturn, pk=pk)
        recipient = request.data.get('email')
        if not recipient:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'ir': ir,
            'items': ir.items.all(),
        }

        html_message = render_to_string('invoice_return_email.html', context)

        email = EmailMessage(
            subject=f'Invoice Return {ir.invoice_return_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        return Response({"message": "Email sent successfully"})

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


class DeliveryNoteReturnListCreateView(generics.ListCreateAPIView):
    queryset = DeliveryNoteReturn.objects.select_related('invoice_return', 'customer').order_by('-created_at')
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
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        dnr = serializer.save()
        return Response({
            "message": "Delivery Note Return created successfully",
            "data": DeliveryNoteReturnSerializer(dnr).data
        }, status=status.HTTP_201_CREATED)


class DeliveryNoteReturnDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DeliveryNoteReturn.objects.select_related('invoice_return', 'customer')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DeliveryNoteReturnSerializer
        return DeliveryNoteReturnWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Delivery Note Return fetched successfully",
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
            "message": "Delivery Note Return updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Delivery Note Return deleted successfully"})


class DeliveryNoteReturnActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

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

        return Response({"message": message})


class DeliveryNoteReturnCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        comments = dnr.comments.all().order_by('-timestamp')
        serializer = DeliveryNoteReturnCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        serializer = DeliveryNoteReturnCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(delivery_note_return=dnr, created_by=request.user)

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
        serializer = DeliveryNoteReturnAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        serializer = DeliveryNoteReturnAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(delivery_note_return=dnr, uploaded_by=request.user)

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
        attachment = get_object_or_404(DeliveryNoteReturnAttachment, pk=attach_pk, delivery_note_return=dnr)
        file_name = attachment.file.name
        attachment.delete()

        DeliveryNoteReturnHistory.objects.create(
            delivery_note_return=dnr,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class DeliveryNoteReturnHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        history = dnr.history.all().order_by('-timestamp')
        serializer = DeliveryNoteReturnHistorySerializer(history, many=True)
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
        html_string = render_to_string('delivery_note_return_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="DNR_{dnr.dnr_id}.pdf"'
        response.write(pdf_buffer.getvalue())
        return response


class DeliveryNoteReturnEmailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        dnr = get_object_or_404(DeliveryNoteReturn, pk=pk)
        recipient = request.data.get('email')
        if not recipient:
            return Response({"message": "Email is required"}, status=400)

        context = {
            'dnr': dnr,
            'items': dnr.items.all(),
        }

        html_message = render_to_string('delivery_note_return_email.html', context)

        email = EmailMessage(
            subject=f'Delivery Note Return {dnr.dnr_id}',
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient]
        )
        email.content_subtype = 'html'
        email.send()

        return Response({"message": "Email sent successfully"})