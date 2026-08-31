from django.urls import path
from ..views import delivery_note_views as views

urlpatterns = [
    path('delivery-notes/', views.DeliveryNoteListCreateView.as_view()),
    path('delivery-notes/<int:pk>/', views.DeliveryNoteDetailView.as_view()),
    path('delivery-notes/<int:pk>/action/', views.DeliveryNoteActionView.as_view()),
    path('delivery-notes/<int:pk>/comments/', views.DeliveryNoteCommentView.as_view()),
    path('delivery-notes/<int:pk>/attachments/', views.DeliveryNoteAttachmentView.as_view()),
    path('delivery-notes/<int:pk>/attachments/<int:attach_pk>/', views.DeliveryNoteAttachmentView.as_view()),
    path('delivery-notes/<int:pk>/history/', views.DeliveryNoteHistoryView.as_view()),
    path('delivery-notes/<int:pk>/pdf/', views.DeliveryNotePDFView.as_view()),
    path('delivery-notes/<int:pk>/email/', views.DeliveryNoteEmailView.as_view()),
    path('delivery-notes/<int:pk>/generate-invoice/', views.GenerateInvoiceFromDeliveryNoteView.as_view()),
]