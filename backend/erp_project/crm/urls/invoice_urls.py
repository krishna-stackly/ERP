from django.urls import path
from ..views import invoice_views as views

urlpatterns = [
    path('invoices/', views.InvoiceListCreateView.as_view()),
    path('invoices/<int:pk>/', views.InvoiceDetailView.as_view()),
    path('invoices/<int:pk>/action/', views.InvoiceActionView.as_view()),
    path('invoices/<int:pk>/comments/', views.InvoiceCommentView.as_view()),
    path('invoices/<int:pk>/attachments/', views.InvoiceAttachmentView.as_view()),
    path('invoices/<int:pk>/attachments/<int:attach_pk>/', views.InvoiceAttachmentView.as_view()),
    path('invoices/<int:pk>/history/', views.InvoiceHistoryView.as_view()),
    path('invoices/<int:pk>/pdf/', views.InvoicePDFView.as_view()),
    path('invoices/<int:pk>/email/', views.InvoiceEmailView.as_view()),
    path('invoices/<int:pk>/generate-return/', views.GenerateInvoiceReturnFromInvoiceView.as_view()),
]