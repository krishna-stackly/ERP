from django.urls import path
from ..views import contra_voucher as views

urlpatterns = [
    
    path('contra_voucher/requesters/', views.RequesterListCreateView.as_view(), name='requester-list-create'),
    path('contra_voucher/requesters/<int:pk>/', views.RequesterDetailView.as_view(), name='requester-detail'),

    path('contra_voucher/approvers/', views.ApproverListCreateView.as_view(), name='approver-list-create'),
    path('contra_voucher/approvers/<int:pk>/', views.ApproverDetailView.as_view(), name='approver-detail'),

    path('contra_voucher/preparers/', views.PreparerListCreateView.as_view(), name='preparer-list-create'),
    path('contra_voucher/preparers/<int:pk>/', views.PreparerDetailView.as_view(), name='preparer-detail'),

    
    path('contra-vouchers/', views.ContraVoucherListCreateView.as_view(), name='contra-voucher-list-create'),
    path('contra-vouchers/<int:pk>/', views.ContraVoucherDetailView.as_view(), name='contra-voucher-detail'),
    path('contra-vouchers/<int:pk>/action/', views.ContraVoucherActionView.as_view(), name='contra-voucher-action'),
    path('contra-vouchers/<int:pk>/comments/', views.ContraVoucherCommentView.as_view(), name='contra-voucher-comments'),
    path('contra-vouchers/<int:pk>/attachments/', views.ContraVoucherAttachmentView.as_view(), name='contra-voucher-attachments'),
    path('contra-vouchers/<int:pk>/attachments/<int:attach_pk>/delete/', views.ContraVoucherAttachmentView.as_view(), name='contra-voucher-attachment-delete'),
    path('contra-vouchers/<int:pk>/history/', views.ContraVoucherHistoryView.as_view(), name='contra-voucher-history'),
]