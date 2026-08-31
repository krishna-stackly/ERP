from django.urls import path
from ..views import asset_sales as views

urlpatterns = [

    # =====================================================
    # ASSET SALE
    # =====================================================

    path(
        'asset-sales/',
        views.AssetSaleListCreateView.as_view(),
        name='asset-sale-list-create'
    ),

    path(
        'asset-sales/<int:pk>/',
        views.AssetSaleDetailView.as_view(),
        name='asset-sale-detail'
    ),

    path(
        'asset-sales/<int:pk>/action/',
        views.AssetSaleActionView.as_view(),
        name='asset-sale-action'
    ),

    # =====================================================
    # COMMENTS
    # =====================================================

    path(
        'asset-sales/<int:pk>/comments/',
        views.AssetSaleCommentView.as_view(),
        name='asset-sale-comments'
    ),

    # =====================================================
    # ATTACHMENTS
    # =====================================================

    path(
        'asset-sales/<int:pk>/attachments/',
        views.AssetSaleAttachmentView.as_view(),
        name='asset-sale-attachments'
    ),

    path(
        'asset-sales/<int:pk>/attachments/<int:attach_pk>/',
        views.AssetSaleAttachmentView.as_view(),
        name='asset-sale-attachment-delete'
    ),

    # =====================================================
    # HISTORY
    # =====================================================

    path(
        'asset-sales/<int:pk>/history/',
        views.AssetSaleHistoryView.as_view(),
        name='asset-sale-history'
    ),

    # =====================================================
    # PDF
    # =====================================================

    path(
        'asset-sales/<int:pk>/pdf/',
        views.AssetSalePDFView.as_view(),
        name='asset-sale-pdf'
    ),

    # =====================================================
    # BUYERS
    # =====================================================

    path(
        'asset-sale-buyers/',
        views.AssetSaleBuyerListCreateView.as_view(),
        name='asset-sale-buyer-list-create'
    ),

    path(
        'asset-sale-buyers/<int:pk>/',
        views.AssetSaleBuyerDetailView.as_view(),
        name='asset-sale-buyer-detail'
    ),

    # =====================================================
    # APPROVERS
    # =====================================================

    path(
        'asset-sale-approvers/',
        views.AssetSaleApproverListCreateView.as_view(),
        name='asset-sale-approver-list-create'
    ),

    path(
        'asset-sale-approvers/<int:pk>/',
        views.AssetSaleApproverDetailView.as_view(),
        name='asset-sale-approver-detail'
    ),

]