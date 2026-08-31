from django.urls import path
from ..views import quotation_views as views

urlpatterns = [
    path('quotations/', views.QuotationListCreateView.as_view()),
    path('quotations/<int:pk>/', views.QuotationDetailView.as_view()),
    path('quotations/<int:pk>/action/', views.QuotationActionView.as_view()),
    path('quotations/<int:pk>/attachments/', views.QuotationAttachmentView.as_view()),
    path('quotations/<int:pk>/attachments/<int:attachment_id>/', views.QuotationAttachmentView.as_view()),
    path('quotations/<int:pk>/comments/', views.QuotationCommentView.as_view()),
    path('quotations/<int:pk>/history/', views.QuotationHistoryView.as_view()),
    path('quotations/<int:pk>/pdf/', views.QuotationPDFView.as_view()),
    path('quotations/<int:pk>/email/', views.QuotationMailView.as_view()),
]