from django.urls import path

from .views import purchase_order
from .views import stock_receipt
from .views import stock_return


urlpatterns = [
    # Purchase Order
    path('purchase-orders/', purchase_order.PurchaseOrderListCreateView.as_view(), name='purchase-order-list-create'),
    path('purchase-orders/<int:pk>/', purchase_order.PurchaseOrderDetailView.as_view(), name='purchase-order-detail'),
    path('purchase-orders/<int:pk>/action/', purchase_order.PurchaseOrderActionView.as_view(), name='purchase-order-action'),
    path('purchase-orders/<int:pk>/pdf/', purchase_order.PurchaseOrderPDFView.as_view(), name='purchase-order-pdf'),
    path('purchase-orders/<int:pk>/email/', purchase_order.PurchaseOrderEmailView.as_view(), name='purchase-order-email'),
    path('purchase-orders/<int:pk>/comments/', purchase_order.PurchaseOrderCommentView.as_view(), name='purchase-order-comments'),
    path('purchase-orders/<int:pk>/attachments/', purchase_order.PurchaseOrderAttachmentView.as_view(), name='purchase-order-attachments'),
    path('purchase-orders/<int:pk>/attachments/<int:attach_pk>/', purchase_order.PurchaseOrderAttachmentView.as_view(), name='purchase-order-attachment-delete'),
    path('purchase-orders/<int:pk>/history/', purchase_order.PurchaseOrderHistoryView.as_view(), name='purchase-order-history'),
    path('purchase-orders/<int:pk>/generate-receipt/', purchase_order.StockReceiptGenerateFromPOView.as_view(), name='generate-receipt-from-po'),

    # Stock Receipt
    path('stock-receipts/', stock_receipt.StockReceiptListCreateView.as_view(), name='stock-receipt-list-create'),
    path('stock-receipts/<int:pk>/', stock_receipt.StockReceiptDetailView.as_view(), name='stock-receipt-detail'),
    path('stock-receipts/<int:pk>/action/', stock_receipt.StockReceiptActionView.as_view(), name='stock-receipt-action'),
    path('stock-receipts/<int:pk>/comments/', stock_receipt.StockReceiptCommentView.as_view(), name='stock-receipt-comments'),
    path('stock-receipts/<int:pk>/attachments/', stock_receipt.StockReceiptAttachmentView.as_view(), name='stock-receipt-attachments'),
    path('stock-receipts/<int:pk>/history/', stock_receipt.StockReceiptHistoryView.as_view(), name='stock-receipt-history'),
    path('stock-receipts/<int:pk>/pdf/', stock_receipt.StockReceiptPDFView.as_view(), name='stock-receipt-pdf'),
    path('stock-receipts/<int:pk>/email/', stock_receipt.StockReceiptEmailView.as_view(), name='stock-receipt-email'),

    # Serial Numbers
    path('stock-receipts/<int:receipt_pk>/items/<int:item_pk>/serial-numbers/', stock_receipt.SerialNumberView.as_view(), name='serial-number-list-create'),

    # Batch Numbers
    path('stock-receipts/<int:receipt_pk>/items/<int:item_pk>/batch-numbers/', stock_receipt.BatchNumberView.as_view(), name='batch-number-list-create'),

    # Batch Serials
    path('stock-receipts/<int:receipt_pk>/items/<int:item_pk>/batch-numbers/<int:batch_pk>/serials/', stock_receipt.BatchSerialView.as_view(), name='batch-serial-list-create'),

    path('stock-receipts/<int:pk>/generate-return/', stock_receipt.StockReturnGenerateFromReceiptView.as_view(), name='generate-return-from-grn'),

    # Stock Return
    path('stock-returns/', stock_return.StockReturnListCreateView.as_view(), name='stock-return-list-create'),
    path('stock-returns/<int:pk>/', stock_return.StockReturnDetailView.as_view(), name='stock-return-detail'),
    path('stock-returns/<int:pk>/action/', stock_return.StockReturnActionView.as_view(), name='stock-return-action'),
    path('stock-returns/<int:pk>/comments/', stock_return.StockReturnCommentView.as_view(), name='stock-return-comments'),
    path('stock-returns/<int:pk>/attachments/', stock_return.StockReturnAttachmentView.as_view(), name='stock-return-attachments'),
    path('stock-returns/<int:pk>/attachments/<int:attach_pk>/', stock_return.StockReturnAttachmentView.as_view(), name='stock-return-attachment-delete'),
    path('stock-returns/<int:pk>/history/', stock_return.StockReturnHistoryView.as_view(), name='stock-return-history'),
    path('stock-returns/<int:pk>/pdf/', stock_return.StockReturnPDFView.as_view(), name='stock-return-pdf'),
    path('stock-returns/<int:pk>/email/', stock_return.StockReturnEmailView.as_view(), name='stock-return-email'),
]
