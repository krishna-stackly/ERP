from django.urls import path
from ..views import debit_note as views

urlpatterns = [
   
    # DebitNote URLs
    path('debit-notes/', views.DebitNoteListCreateView.as_view(), name='debit-note-list-create'),
    path('debit-notes/<int:pk>/', views.DebitNoteDetailView.as_view(), name='debit-note-detail'),
    path('debit-notes/<int:pk>/action/', views.DebitNoteActionView.as_view(), name='debit-note-action'),
    path('debit-notes/<int:pk>/comments/', views.DebitNoteCommentView.as_view(), name='debit-note-comments'),
    path('debit-notes/<int:pk>/attachments/', views.DebitNoteAttachmentView.as_view(), name='debit-note-attachments'),
    path('debit-notes/<int:pk>/attachments/<int:attach_pk>/', views.DebitNoteAttachmentView.as_view(), name='debit-note-attachment-delete'),
    path('debit-notes/<int:pk>/history/', views.DebitNoteHistoryView.as_view(), name='debit-note-history'),
    path('debit-notes/<int:pk>/pdf/', views.DebitNotePDFView.as_view(), name='debit-note-pdf'),
    path('debit-notes/<int:pk>/email/', views.DebitNoteEmailView.as_view(), name='debit-note-email'),
]
