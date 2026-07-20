from django.urls import path
from ..views import revenue as views

urlpatterns = [

    path('revenues/', views.RevenueListCreateView.as_view(), name='revenue-list-create'),
    path('revenues/<int:pk>/', views.RevenueDetailView.as_view(), name='revenue-detail'),
    path('revenues/<int:pk>/action/', views.RevenueActionView.as_view(), name='revenue-action'),
    path('revenues/<int:pk>/comments/', views.RevenueCommentView.as_view(), name='revenue-comments'),
    path('revenues/<int:pk>/attachments/', views.RevenueAttachmentView.as_view(), name='revenue-attachments'),
    path('revenues/<int:pk>/attachments/<int:attach_pk>/delete/', views.RevenueAttachmentView.as_view(), name='revenue-attachment-delete'),
    path('revenues/<int:pk>/history/', views.RevenueHistoryView.as_view(), name='revenue-history'),
]