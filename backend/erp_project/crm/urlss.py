from django.urls import path
from . import views

urlpatterns = [
    path('enquiries/', views.EnquiryListCreateView.as_view(), name='enquiry-list-create'),
    path('enquiries/<int:pk>/', views.EnquiryDetailView.as_view(), name='enquiry-detail'),

    path('quotations/', views.QuotationListCreateView.as_view(), name='quotation-list-create'),
    path('quotations/<int:pk>/', views.QuotationDetailView.as_view(), name='quotation-detail'),
    path('quotations/<int:pk>/action/', views.QuotationActionView.as_view(), name='quotation-action'),
    path('quotations/<int:pk>/attachments/',views.QuotationAttachmentView.as_view(),name='quotation-attachments'),
    path('quotations/<int:pk>/attachments/<int:attachment_id>/', views.QuotationAttachmentView.as_view(),name='quotation-attachment-delete'),
    path('quotations/<int:pk>/comments/', views.QuotationCommentView.as_view(), name='quotation-comments'),
    path('quotations/<int:pk>/history/', views.QuotationHistoryView.as_view(), name='quotation-history'),
    path('quotations/<int:pk>/pdf/', views.QuotationPDFView.as_view(), name='quotation-pdf'),
    path('quotations/<int:pk>/email/', views.QuotationMailView.as_view(), name='quotation-email'),

    # SalesOrder URLs
    path('sales-orders/', views.SalesOrderListCreateView.as_view(), name='sales-order-list-create'),
    path('sales-orders/<int:pk>/', views.SalesOrderDetailView.as_view(), name='sales-order-detail'),
    path('sales-orders/<int:pk>/comments/', views.SalesOrderCommentView.as_view(), name='sales-order-comments'),
    path('sales-orders/<int:pk>/history/', views.SalesOrderHistoryView.as_view(), name='sales-order-history'),
    path('sales-orders/<int:pk>/action/', views.SalesOrderActionView.as_view(), name='sales-order-action'),
    path('sales-orders/<int:pk>/pdf/', views.SalesOrderPDFView.as_view(), name='sales-order-pdf'),
    path('sales-orders/<int:pk>/email/', views.SalesOrderMailView.as_view(), name='sales-order-email'),
    path('sales-orders/<int:pk>/generate-po/', views.GeneratePurchaseOrderFromSalesOrderView.as_view(), name='generate-po-from-so'),
    path('sales-orders/<int:pk>/generate-delivery-note/', views.GenerateDeliveryNoteFromSalesOrderView.as_view(), name='generate-delivery-note-from-so'),
    path('sales-orders/<int:pk>/generate-invoice/', views.GenerateInvoiceFromSalesOrderView.as_view(), name='generate-invoice-from-so'),
    
    # DeliveryNote URLs   
    path('delivery-notes/', views.DeliveryNoteListCreateView.as_view(), name='delivery-note-list-create'),
    path('delivery-notes/<int:pk>/', views.DeliveryNoteDetailView.as_view(), name='delivery-note-detail'),
    path('delivery-notes/<int:pk>/action/', views.DeliveryNoteActionView.as_view(), name='delivery-note-action'),
    path('delivery-notes/<int:pk>/comments/', views.DeliveryNoteCommentView.as_view(), name='delivery-note-comments'),
    path('delivery-notes/<int:pk>/attachments/', views.DeliveryNoteAttachmentView.as_view(), name='delivery-note-attachments'),
    path('delivery-notes/<int:pk>/attachments/<int:attach_pk>/', views.DeliveryNoteAttachmentView.as_view(), name='delivery-note-attachment-delete'),
    path('delivery-notes/<int:pk>/history/', views.DeliveryNoteHistoryView.as_view(), name='delivery-note-history'),
    path('delivery-notes/<int:pk>/pdf/', views.DeliveryNotePDFView.as_view(), name='delivery-note-pdf'),
    path('delivery-notes/<int:pk>/email/', views.DeliveryNoteEmailView.as_view(), name='delivery-note-email'),
    path('delivery-notes/<int:pk>/generate-invoice/', views.GenerateInvoiceFromDeliveryNoteView.as_view(), name='generate-invoice-from-dn'),
   
    # Main CRUD
    path('invoices/', views.InvoiceListCreateView.as_view(), name='invoice-list-create'),
    path('invoices/<int:pk>/', views.InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoices/<int:pk>/action/', views.InvoiceActionView.as_view(), name='invoice-action'),
    path('invoices/<int:pk>/comments/', views.InvoiceCommentView.as_view(), name='invoice-comments'),
    path('invoices/<int:pk>/attachments/', views.InvoiceAttachmentView.as_view(), name='invoice-attachments'),
    path('invoices/<int:pk>/attachments/<int:attach_pk>/', views.InvoiceAttachmentView.as_view(), name='invoice-attachment-delete'),
    path('invoices/<int:pk>/history/', views.InvoiceHistoryView.as_view(), name='invoice-history'),
    path('invoices/<int:pk>/pdf/', views.InvoicePDFView.as_view(), name='invoice-pdf'),
    path('invoices/<int:pk>/email/', views.InvoiceEmailView.as_view(), name='invoice-email'),
    path('invoices/<int:pk>/generate-return/', views.GenerateInvoiceReturnFromInvoiceView.as_view(), name='generate-invoice-return'),

    #   invoice return
    path('invoice-returns/', views.InvoiceReturnListCreateView.as_view(), name='invoice-return-list-create'),
    path('invoice-returns/<int:pk>/', views.InvoiceReturnDetailView.as_view(), name='invoice-return-detail'),
    path('invoice-returns/<int:pk>/action/', views.InvoiceReturnActionView.as_view(), name='invoice-return-action'),
    path('invoice-returns/<int:pk>/comments/', views.InvoiceReturnCommentView.as_view(), name='invoice-return-comments'),
    path('invoice-returns/<int:pk>/attachments/', views.InvoiceReturnAttachmentView.as_view(), name='invoice-return-attachments'),
    path('invoice-returns/<int:pk>/attachments/<int:attach_pk>/', views.InvoiceReturnAttachmentView.as_view(), name='invoice-return-attachment-delete'),
    path('invoice-returns/<int:pk>/history/', views.InvoiceReturnHistoryView.as_view(), name='invoice-return-history'),
    path('invoice-returns/<int:pk>/pdf/', views.InvoiceReturnPDFView.as_view(), name='invoice-return-pdf'),
    path('invoice-returns/<int:pk>/email/', views.InvoiceReturnEmailView.as_view(), name='invoice-return-email'),
    path('invoice-returns/<int:pk>/generate-dnr/', views.GenerateDeliveryNoteReturnFromInvoiceReturnView.as_view(), name='generate-dnr-from-ir'),
    
    
    path('delivery-note-returns/', views.DeliveryNoteReturnListCreateView.as_view(), name='dnr-list-create'),
    path('delivery-note-returns/<int:pk>/', views.DeliveryNoteReturnDetailView.as_view(), name='dnr-detail'),
    path('delivery-note-returns/<int:pk>/action/', views.DeliveryNoteReturnActionView.as_view(), name='dnr-action'),
    path('delivery-note-returns/<int:pk>/comments/', views.DeliveryNoteReturnCommentView.as_view(), name='dnr-comments'),
    path('delivery-note-returns/<int:pk>/attachments/', views.DeliveryNoteReturnAttachmentView.as_view(), name='dnr-attachments'),
    path('delivery-note-returns/<int:pk>/attachments/<int:attach_pk>/', views.DeliveryNoteReturnAttachmentView.as_view(), name='dnr-attachment-delete'),
    path('delivery-note-returns/<int:pk>/history/', views.DeliveryNoteReturnHistoryView.as_view(), name='dnr-history'),
    path('delivery-note-returns/<int:pk>/pdf/', views.DeliveryNoteReturnPDFView.as_view(), name='dnr-pdf'),
    path('delivery-note-returns/<int:pk>/email/', views.DeliveryNoteReturnEmailView.as_view(), name='dnr-email'),
]