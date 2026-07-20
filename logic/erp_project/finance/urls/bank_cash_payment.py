from django.urls import path
from ..views import bank_cash_payment as views
urlpatterns = [
    path('bank-cash-payments/', views.BankCashPaymentListCreateView.as_view(), name='bank-cash-payment-list-create'),
    path('bank-cash-payments/<int:pk>/', views.BankCashPaymentDetailView.as_view(), name='bank-cash-payment-detail'),
    path('bank-cash-payments/<int:pk>/action/', views.BankCashPaymentActionView.as_view(), name='bank-cash-payment-action'),
    path('bank-cash-payments/<int:pk>/comments/', views.BankCashPaymentCommentView.as_view(), name='bank-cash-payment-comments'),
    path('bank-cash-payments/<int:pk>/attachments/', views.BankCashPaymentAttachmentView.as_view(), name='bank-cash-payment-attachments'),
    path('bank-cash-payments/<int:pk>/attachments/<int:attach_pk>/', views.BankCashPaymentAttachmentView.as_view(), name='bank-cash-payment-attachment-delete'),
    path('bank-cash-payments/<int:pk>/history/', views.BankCashPaymentHistoryView.as_view(), name='bank-cash-payment-history'),
    path('bank-cash-payments/<int:pk>/pdf/', views.BankCashPaymentPDFView.as_view(), name='bank-cash-payment-pdf'),
    path('bank-cash-payments/<int:pk>/email/', views.BankCashPaymentEmailView.as_view(), name='bank-cash-payment-email'),
]