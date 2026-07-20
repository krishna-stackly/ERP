from django.urls import path

from ..views import bank_cash_receipts as views

urlpatterns = [
    path('bank-cash-receipts/', views.BankCashReceiptListCreateView.as_view(), name='bank-cash-receipt-list-create'),
    path('bank-cash-receipts/<int:pk>/', views.BankCashReceiptDetailView.as_view(), name='bank-cash-receipt-detail'),
    path('bank-cash-receipts/<int:pk>/action/', views.BankCashReceiptActionView.as_view(), name='bank-cash-receipt-action'),
    path('bank-cash-receipts/<int:pk>/comments/', views.BankCashReceiptCommentView.as_view(), name='bank-cash-receipt-comments'),
    path('bank-cash-receipts/<int:pk>/attachments/', views.BankCashReceiptAttachmentView.as_view(), name='bank-cash-receipt-attachments'),
    path('bank-cash-receipts/<int:pk>/attachments/<int:attach_pk>/', views.BankCashReceiptAttachmentView.as_view(), name='bank-cash-receipt-attachment-delete'),
    path('bank-cash-receipts/<int:pk>/history/', views.BankCashReceiptHistoryView.as_view(), name='bank-cash-receipt-history'),
    path('bank-cash-receipts/<int:pk>/pdf/', views.BankCashReceiptPDFView.as_view(), name='bank-cash-receipt-pdf'),
    path('bank-cash-receipts/<int:pk>/email/', views.BankCashReceiptEmailView.as_view(), name='bank-cash-receipt-email'),   
    path('bank-cash-receipts/payer-search/', views.PayerSearchView.as_view(), name='bank-cash-receipt-payer-search'),    
]