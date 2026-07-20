from django.urls import path
from ..views import delivery_note_return_views as views

urlpatterns = [
    path('delivery-note-returns/', views.DeliveryNoteReturnListCreateView.as_view()),
    path('delivery-note-returns/<int:pk>/', views.DeliveryNoteReturnDetailView.as_view()),
    path('delivery-note-returns/<int:pk>/action/', views.DeliveryNoteReturnActionView.as_view()),
    path('delivery-note-returns/<int:pk>/comments/', views.DeliveryNoteReturnCommentView.as_view()),
    path('delivery-note-returns/<int:pk>/attachments/', views.DeliveryNoteReturnAttachmentView.as_view()),
    path('delivery-note-returns/<int:pk>/attachments/<int:attach_pk>/', views.DeliveryNoteReturnAttachmentView.as_view()),
    path('delivery-note-returns/<int:pk>/history/', views.DeliveryNoteReturnHistoryView.as_view()),
    path('delivery-note-returns/<int:pk>/pdf/', views.DeliveryNoteReturnPDFView.as_view()),
    path('delivery-note-returns/<int:pk>/email/', views.DeliveryNoteReturnEmailView.as_view()),
]