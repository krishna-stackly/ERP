from django.urls import path
from ..views import journal_voucher as views


urlpatterns = [

    # JOURNAL VOUCHER APPROVER
    

    # List + Create
    path(
        'journal-vouchers/approvers/',
        views.JournalVoucherApproverListCreateView.as_view(),
        name='journal-voucher-approver-list-create'
    ),

    # Retrieve + Update + Delete
    path(
        'journal-vouchers/approvers/<int:pk>/',
        views.JournalVoucherApproverDetailView.as_view(),
        name='journal-voucher-approver-detail'
    ),

    # JOURNAL VOUCHER

    # List + Create
    path(
        'journal-vouchers/',
        views.JournalVoucherListCreateView.as_view(),
        name='journal-voucher-list-create'
    ),

    # Retrieve + Update + Delete
    path(
        'journal-vouchers/<int:pk>/',
        views.JournalVoucherDetailView.as_view(),
        name='journal-voucher-detail'
    ),

    # Action (status transitions)
    path(
        'journal-vouchers/<int:pk>/action/',
        views.JournalVoucherActionView.as_view(),
        name='journal-voucher-action'
    ),

    # Comments
    path(
        'journal-vouchers/<int:pk>/comments/',
        views.JournalVoucherCommentView.as_view(),
        name='journal-voucher-comments'
    ),

    # Attachments — list + upload
    path(
        'journal-vouchers/<int:pk>/attachments/',
        views.JournalVoucherAttachmentView.as_view(),
        name='journal-voucher-attachments'
    ),

    # Attachments — delete single
    path(
        'journal-vouchers/<int:pk>/attachments/<int:attach_pk>/',
        views.JournalVoucherAttachmentView.as_view(),
        name='journal-voucher-attachment-delete'
    ),

    # History
    path(
        'journal-vouchers/<int:pk>/history/',
        views.JournalVoucherHistoryView.as_view(),
        name='journal-voucher-history'
    ),
]