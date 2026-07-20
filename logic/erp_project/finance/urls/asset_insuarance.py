from django.urls import path
from ..views import asset_insuarance as views

urlpatterns = [
    
    path('assets/', views.AssetViewSet.as_view(), name='asset-list-create'),
    path('insurance-companies/', views.InsuranceCompanyViewSet.as_view(), name='insurance-company-list-create'),
    path('responsible-entities/', views.ResponsibleEntityViewSet.as_view(), name='responsible-entity-list-create'),
  
    path('asset-insurance/', views.AssetInsurancePolicyListCreateView.as_view(), name='asset-insurance-list-create'),
    path('asset-insurance/<int:pk>/', views.AssetInsurancePolicyDetailView.as_view(), name='asset-insurance-detail'),
    path('asset-insurance/<int:pk>/action/', views.AssetInsurancePolicyActionView.as_view(), name='asset-insurance-action'),
    path('asset-insurance/<int:pk>/line-items/', views.PolicyLineItemView.as_view(), name='asset-insurance-line-items'),
    path('asset-insurance/<int:pk>/payments/', views.PremiumPaymentView.as_view(), name='asset-insurance-payments'),
    path('asset-insurance/<int:pk>/attachments/', views.PolicyAttachmentView.as_view(), name='asset-insurance-attachments'),
    path('asset-insurance/<int:pk>/attachments/<int:attach_pk>/delete/', views.PolicyAttachmentDeleteView.as_view(), name='asset-insurance-attachment-delete'), path('asset-insurance/<int:pk>/comments/', views.PolicyCommentView.as_view(), name='asset-insurance-comments'),
    path('asset-insurance/<int:pk>/history/', views.PolicyHistoryView.as_view(), name='asset-insurance-history'),

    
]
