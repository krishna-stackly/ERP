from django.urls import path
from. import views

urlpatterns = [

    path('purchase-orders/', views.PurchaseOrderListCreateView.as_view(), name='purchase-order-list-create'),
    path('purchase-orders/<int:pk>/', views.PurchaseOrderDetailView.as_view(), name='purchase-order-detail'),
    path('purchase-orders/<int:pk>/action/', views.PurchaseOrderActionView.as_view(), name='purchase-order-action'),
    path('purchase-orders/<int:pk>/pdf/', views.PurchaseOrderPDFView.as_view(), name='purchase-order-pdf'),
    path('purchase-orders/<int:pk>/email/', views.PurchaseOrderEmailView.as_view(), name='purchase-order-email'),
    path('purchase-orders/<int:pk>/comments/', views.PurchaseOrderCommentView.as_view(), name='purchase-order-comments'),
    path('purchase-orders/<int:pk>/attachments/', views.PurchaseOrderAttachmentView.as_view(), name='purchase-order-attachments'),
    path('purchase-orders/<int:pk>/attachments/<int:attach_pk>/', views.PurchaseOrderAttachmentView.as_view(), name='purchase-order-attachment-delete'),
    path('purchase-orders/<int:pk>/history/', views.PurchaseOrderHistoryView.as_view(), name='purchase-order-history'),
    path('purchase-orders/<int:pk>/generate-receipt/', views.StockReceiptGenerateFromPOView.as_view(), name='generate-receipt-from-po'),

    path('stock-receipts/', views.StockReceiptListCreateView.as_view(), name='stock-receipt-list-create'),
    path('stock-receipts/<int:pk>/', views.StockReceiptDetailView.as_view(), name='stock-receipt-detail'),
    path('stock-receipts/<int:pk>/action/', views.StockReceiptActionView.as_view(), name='stock-receipt-action'),
    path('stock-receipts/<int:pk>/comments/', views.StockReceiptCommentView.as_view(), name='stock-receipt-comments'),
    path('stock-receipts/<int:pk>/attachments/', views.StockReceiptAttachmentView.as_view(), name='stock-receipt-attachments'),
    path('stock-receipts/<int:pk>/history/', views.StockReceiptHistoryView.as_view(), name='stock-receipt-history'),
    path('stock-receipts/<int:pk>/pdf/', views.StockReceiptPDFView.as_view(), name='stock-receipt-pdf'),
    path('stock-receipts/<int:pk>/email/', views.StockReceiptEmailView.as_view(), name='stock-receipt-email'),
    # Serial Numbers
    path('stock-receipts/<int:receipt_pk>/items/<int:item_pk>/serial-numbers/', views.SerialNumberView.as_view(), name='serial-number-list-create'),
    # Batch Numbers
    path('stock-receipts/<int:receipt_pk>/items/<int:item_pk>/batch-numbers/', views.BatchNumberView.as_view(), name='batch-number-list-create'),
    # Batch Serials (for a specific batch)
    path('stock-receipts/<int:receipt_pk>/items/<int:item_pk>/batch-numbers/<int:batch_pk>/serials/', views.BatchSerialView.as_view(), name='batch-serial-list-create'),
    path('stock-receipts/<int:pk>/generate-return/', views.StockReturnGenerateFromReceiptView.as_view(), name='generate-return-from-grn'),

    # Stock Return URLs
    path('stock-returns/', views.StockReturnListCreateView.as_view(), name='stock-return-list-create'),
    path('stock-returns/<int:pk>/', views.StockReturnDetailView.as_view(), name='stock-return-detail'),
    path('stock-returns/<int:pk>/action/', views.StockReturnActionView.as_view(), name='stock-return-action'),
    path('stock-returns/<int:pk>/comments/', views.StockReturnCommentView.as_view(), name='stock-return-comments'),
    path('stock-returns/<int:pk>/attachments/', views.StockReturnAttachmentView.as_view(), name='stock-return-attachments'),
    path('stock-returns/<int:pk>/attachments/<int:attach_pk>/', views.StockReturnAttachmentView.as_view(), name='stock-return-attachment-delete'),
    path('stock-returns/<int:pk>/history/', views.StockReturnHistoryView.as_view(), name='stock-return-history'),
    path('stock-returns/<int:pk>/pdf/', views.StockReturnPDFView.as_view(), name='stock-return-pdf'),
    path('stock-returns/<int:pk>/email/', views.StockReturnEmailView.as_view(), name='stock-return-email'),
]