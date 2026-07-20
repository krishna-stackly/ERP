

from django.urls import path
from ..views import accounts_receivable as views

urlpatterns = [
path('accounts-receivable/', views.AccountsReceivableVoucherListCreateView.as_view(), name='accounts-receivable-list-create'),
path('accounts-receivable/<int:pk>/', views.AccountsReceivableVoucherDetailView.as_view(), name='accounts-receivable-detail'),
path('accounts-receivable/<int:pk>/action/', views.AccountsReceivableVoucherActionView.as_view(), name='accounts-receivable-action'),
path('accounts-receivable/<int:pk>/comments/', views.AccountsReceivableVoucherCommentView.as_view(), name='accounts-receivable-comments'),
path('accounts-receivable/<int:pk>/attachments/', views.AccountsReceivableVoucherAttachmentView.as_view(), name='accounts-receivable-attachments'),
path('accounts-receivable/<int:pk>/attachments/<int:attach_pk>/', views.AccountsReceivableVoucherAttachmentView.as_view(), name='accounts-receivable-attachment-delete'),
path('accounts-receivable/<int:pk>/history/', views.AccountsReceivableVoucherHistoryView.as_view(), name='accounts-receivable-history'),
path('accounts-receivable/<int:pk>/pdf/', views.AccountsReceivableVoucherPDFView.as_view(), name='accounts-receivable-pdf'),
path('accounts-receivable/<int:pk>/email/', views.AccountsReceivableVoucherEmailView.as_view(), name='accounts-receivable-email'),

]