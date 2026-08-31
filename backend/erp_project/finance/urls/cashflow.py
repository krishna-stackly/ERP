from django.urls import path
from ..views import cashflow as views 

urlpatterns = [


    path('cashflow/', views.CashFlowListCreateView.as_view(), name='cashflow-list-create'),
    path('cashflow/<int:pk>/', views.CashFlowDetailView.as_view(), name='cashflow-detail'),
    path('cashflow/<int:pk>/action/', views.CashFlowActionView.as_view(), name='cashflow-action'),
    path('cashflow/<int:pk>/comments/', views.CashFlowCommentView.as_view(), name='cashflow-comments'),
    path('cashflow/<int:pk>/attachments/', views.CashFlowAttachmentView.as_view(), name='cashflow-attachments'),
    path('cashflow/<int:pk>/attachments/<int:attachment_id>/',views.CashFlowAttachmentDeleteView.as_view(),name='cashflow-attachment-delete'),
    path('cashflow/summary/', views.CashFlowHistoryView.as_view(), name='cashflow-summary'),
]