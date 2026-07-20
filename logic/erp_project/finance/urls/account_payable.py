from django.urls import path
from ..views import account_payable as views

urlpatterns = [

    # APVoucher URLs
    path('ap-vouchers/', views.AccountsPayableVoucherListCreateView.as_view()),
    path('ap-vouchers/<int:pk>/', views.AccountsPayableVoucherDetailView.as_view()),
    path('ap-vouchers/<int:pk>/action/', views.AccountsPayableVoucherActionView.as_view()),
    path('ap-vouchers/<int:pk>/comments/', views.AccountsPayableVoucherCommentView.as_view()),
    path('ap-vouchers/<int:pk>/attachments/', views.AccountsPayableVoucherAttachmentView.as_view()),
    path('ap-vouchers/<int:pk>/attachments/<int:attach_pk>/', views.AccountsPayableVoucherAttachmentView.as_view(), name='ap-voucher-attachment-delete'),
    path('ap-vouchers/<int:pk>/history/', views.AccountsPayableVoucherHistoryView.as_view(), name='ap-voucher-history'),

   
]