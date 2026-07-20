from django.urls import path
from ..views import invoice_return_views as views

urlpatterns = [
    path('invoice-returns/', views.InvoiceReturnListCreateView.as_view()),
    path('invoice-returns/<int:pk>/', views.InvoiceReturnDetailView.as_view()),
    path('invoice-returns/<int:pk>/action/', views.InvoiceReturnActionView.as_view()),
    path('invoice-returns/<int:pk>/comments/', views.InvoiceReturnCommentView.as_view()),
    path('invoice-returns/<int:pk>/attachments/', views.InvoiceReturnAttachmentView.as_view()),
    path('invoice-returns/<int:pk>/attachments/<int:attach_pk>/', views.InvoiceReturnAttachmentView.as_view()),
    path('invoice-returns/<int:pk>/history/', views.InvoiceReturnHistoryView.as_view()),
    path('invoice-returns/<int:pk>/pdf/', views.InvoiceReturnPDFView.as_view()),
    path('invoice-returns/<int:pk>/email/', views.InvoiceReturnEmailView.as_view()),
    path('invoice-returns/<int:pk>/generate-dnr/', views.GenerateDeliveryNoteReturnFromInvoiceReturnView.as_view()),
]