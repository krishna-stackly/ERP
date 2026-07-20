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
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from weasyprint import HTML

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from purchase.models import PurchaseOrder, PurchaseOrderItem

from crm.models.sales_order_models import (
    SalesOrder,
    SalesOrderItem,
    SalesOrderComment,
    SalesOrderHistory,
)

from crm.models.delivery_note_models import (
    DeliveryNote,
    DeliveryNoteItem,
)

from crm.models.invoice_models import (
    Invoice,
    InvoiceItem,
)

from crm.serializers.sales_order_serializers import (
    SalesOrderSerializer,
    SalesOrderWriteSerializer,
    SalesOrderCommentSerializer,
    SalesOrderHistorySerializer,
)


class SalesOrderListCreateView(generics.ListCreateAPIView):
    queryset = SalesOrder.objects.select_related(
        'customer',
        'sales_rep'
    ).order_by('-created_at')

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
        serializer = SalesOrderWriteSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        sales_order = serializer.save()

        return Response({
            "message": "Sales Order created successfully",
            "data": SalesOrderSerializer(sales_order).data
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

        return Response({
            "message": "Sales Order fetched successfully",
            "data": SalesOrderSerializer(instance).data
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

        serializer.save()

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
            'Submitted': ['convert_to_invoice', 'cancel'],
            'Submitted(PD)': ['convert_to_invoice', 'cancel'],
            'Partially Delivered': ['convert_to_invoice'],
            'Delivered': [],
            'Cancelled': [],
        }

        if action not in allowed_transitions.get(sales_order.status, []):
            return Response({
                'error': f'Action "{action}" not allowed in status "{sales_order.status}"'
            }, status=status.HTTP_400_BAD_REQUEST)

        old_status = sales_order.status

        if action == 'save_draft':
            sales_order.status = 'Draft'

        elif action == 'submit':
            insufficient = []

            for item in sales_order.items.all():
                available = item.product.quantity

                if available < item.quantity:
                    insufficient.append({
                        'product': item.product.id,
                        'required': item.quantity,
                        'available': available
                    })

            if insufficient:
                return Response({
                    'error': 'insufficient_stock',
                    'details': insufficient
                }, status=status.HTTP_400_BAD_REQUEST)

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

        return Response(SalesOrderSerializer(sales_order).data)


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
        }, status=status.HTTP_201_CREATED)


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

        html_string = render_to_string('sales_order_pdf.html', context)
        html = HTML(string=html_string, base_url=request.build_absolute_uri())

        pdf_buffer = BytesIO()
        html.write_pdf(pdf_buffer)

        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='pdf_generated',
            action_by=request.user
        )

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = (
            f'attachment; filename="SalesOrder_{sales_order.sales_order_id}.pdf"'
        )
        response.write(pdf_buffer.getvalue())

        return response


class SalesOrderMailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, id=pk)

        recipient = request.data.get(
            'email',
            sales_order.customer.email
        )

        context = {
            'sales_order': sales_order,
            'items': sales_order.items.all(),
            'subtotal': sales_order.subtotal,
            'tax_summary': sales_order.tax_summary,
            'grand_total': sales_order.grand_total
        }

        html_message = render_to_string(
            'sales_order_email.html',
            context
        )

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

        return Response({
            'message': 'Email sent successfully'
        })


class GeneratePurchaseOrderFromSalesOrderView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request, pk):
        sales_order = get_object_or_404(SalesOrder, pk=pk)

        if sales_order.status not in [
            'Submitted',
            'Submitted(PD)',
            'Partially Delivered'
        ]:
            return Response({
                "message": "Cannot generate PO from this Sales Order status"
            }, status=status.HTTP_400_BAD_REQUEST)

        partial = request.data.get('partial', False)

        insufficient_items = []

        for so_item in sales_order.items.all():
            available = so_item.product.quantity
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
            return Response({
                "message": "All items are in stock — no Purchase Order needed"
            })

        po = PurchaseOrder.objects.create(
            supplier=sales_order.customer.supplier,
            po_date=timezone.now().date(),
            delivery_date=sales_order.expected_delivery,
            status='Draft',
            currency=sales_order.currency,
            payment_terms=sales_order.payment_method,
            notes_comments=f"Auto-generated from Sales Order {sales_order.sales_order_id}",
            created_by=request.user,
            updated_by=request.user
        )

        for item_data in insufficient_items:
            PurchaseOrderItem.objects.create(
                purchase_order=po,
                product=item_data['product'],
                qty_ordered=item_data['qty_ordered'],
                unit_price=item_data['unit_price'],
                tax_rate=item_data['tax_rate'],
                discount_rate=item_data['discount_rate'],
            )

        po.calculate_summary()

        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='po_generated',
            extra_info=f"PO {po.PO_ID} created (partial={partial})",
            action_by=request.user
        )

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

        if sales_order.status not in [
            'Submitted',
            'Submitted(PD)',
            'Partially Delivered'
        ]:
            return Response({
                "message": "Cannot generate Delivery Note from this Sales Order status"
            }, status=status.HTTP_400_BAD_REQUEST)

        if DeliveryNote.objects.filter(sales_order=sales_order).exists():
            return Response({
                "message": "Delivery Note already generated for this Sales Order"
            }, status=status.HTTP_400_BAD_REQUEST)

        dn = DeliveryNote.objects.create(
            sales_order=sales_order,
            customer=sales_order.customer,
            delivery_date=sales_order.expected_delivery or timezone.now().date(),
            destination_address=sales_order.customer.address or "N/A",
            delivered_by=request.user.get_full_name(),
            delivery_type='Regular',
            status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        for so_item in sales_order.items.all():
            DeliveryNoteItem.objects.create(
                delivery_note=dn,
                product=so_item.product,
                quantity=so_item.quantity,
                uom=so_item.uom,
            )

        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='delivery_note_generated',
            extra_info=f"DN {dn.dn_id} created from SO {sales_order.sales_order_id}",
            action_by=request.user
        )

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

        if sales_order.status not in [
            'Submitted',
            'Submitted(PD)',
            'Partially Delivered',
            'Delivered'
        ]:
            return Response({
                "message": "Cannot generate Invoice from this Sales Order status"
            }, status=status.HTTP_400_BAD_REQUEST)

        if Invoice.objects.filter(sales_order=sales_order).exists():
            return Response({
                "message": "Invoice already generated for this Sales Order"
            }, status=status.HTTP_400_BAD_REQUEST)

        invoice = Invoice.objects.create(
            sales_order=sales_order,
            customer=sales_order.customer,
            invoice_date=timezone.now().date(),
            due_date=sales_order.due_date or (
                timezone.now().date() + timezone.timedelta(days=30)
            ),
            billing_address=sales_order.customer.address or "N/A",
            shipping_address=sales_order.customer.address or "N/A",
            currency=sales_order.currency,
            payment_terms='Net 30',
            invoice_status='Draft',
            created_by=request.user,
            updated_by=request.user
        )

        for so_item in sales_order.items.all():
            InvoiceItem.objects.create(
                invoice=invoice,
                product=so_item.product,
                quantity=so_item.quantity,
                unit_price=so_item.unit_price,
                tax_rate=so_item.tax_rate,
                discount_rate=so_item.discount,
                uom=so_item.uom,
            )

        SalesOrderHistory.objects.create(
            sales_order=sales_order,
            event_type='invoice_generated',
            extra_info=f"INV {invoice.invoice_id} created from SO {sales_order.sales_order_id}",
            action_by=request.user
        )

        return Response({
            "message": f"Invoice {invoice.invoice_id} generated successfully",
            "data": {
                "invoice_id": invoice.id,
                "invoice_number": invoice.invoice_id,
                "invoice_url": f"/api/invoices/{invoice.id}/",
                "sales_order_id": sales_order.id
            }
        }, status=status.HTTP_201_CREATED)
