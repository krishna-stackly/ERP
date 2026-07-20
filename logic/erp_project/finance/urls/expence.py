from django.urls import path
from ..views import expence as views

urlpatterns = [
   


path('expenses/', views.ExpenseListCreateView.as_view(), name='expense-list-create'),
path('expenses/<int:pk>/', views.ExpenseDetailView.as_view(), name='expense-detail'),
path('expenses/<int:pk>/action/', views.ExpenseActionView.as_view(), name='expense-action'),
path('expenses/<int:pk>/comments/', views.ExpenseCommentView.as_view(), name='expense-comments'),
path('expenses/<int:pk>/attachments/', views.ExpenseAttachmentView.as_view(), name='expense-attachments'),
path('expenses/<int:pk>/attachments/<int:attach_pk>/delete/', views.ExpenseAttachmentView.as_view(), name='expense-attachment-delete'),
path('expenses/<int:pk>/history/', views.ExpenseHistoryView.as_view(), name='expense-history'),

]