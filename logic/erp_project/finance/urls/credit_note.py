from django.urls import path
from ..views import credit_note as views

urlpatterns = [
    # CreditNote URLs
    path('credit-notes/', views.CreditNoteListCreateView.as_view(), name='credit-note-list-create'),
    path('credit-notes/<int:pk>/', views.CreditNoteDetailView.as_view(), name='credit-note-detail'),
    path('credit-notes/<int:pk>/action/', views.CreditNoteActionView.as_view(), name='credit-note-action'),
    path('credit-notes/<int:pk>/comments/', views.CreditNoteCommentView.as_view(), name='credit-note-comments'),
    path('credit-notes/<int:pk>/attachments/', views.CreditNoteAttachmentView.as_view(), name='credit-note-attachments'),
    path('credit-notes/<int:pk>/attachments/<int:attach_pk>/', views.CreditNoteAttachmentView.as_view(), name='credit-note-attachment-delete'),
    path('credit-notes/<int:pk>/history/', views.CreditNoteHistoryView.as_view(), name='credit-note-history'),
    path('credit-notes/<int:pk>/pdf/', views.CreditNotePDFView.as_view(), name='credit-note-pdf'),
    path('credit-notes/<int:pk>/email/', views.CreditNoteEmailView.as_view(), name='credit-note-email'),
   
]
