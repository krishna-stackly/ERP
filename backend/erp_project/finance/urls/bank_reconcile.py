from django.urls import path
from ..views import bank_reconcile as views
 
urlpatterns = [
   path('bank-reconciliation/',views.BankReconciliationCreateView.as_view(),name='bank-reconciliation-list-create'),
    path('bank-reconciliation/<int:pk>/',views.BankReconciliationDetailView.as_view(),name='bank-reconciliation-detail'),
    path('bank-reconciliation/<int:pk>/update/',views.BankReconciliationUpdateView.as_view(), name='bank-reconciliation-update'),
    path('bank-reconciliation/<int:pk>/submit/',views.BankReconciliationSubmitView.as_view(),name='bank-reconciliation-submit'),
    path('bank-reconciliation/<int:pk>/approve/',views.BankReconciliationApproveView.as_view(),name='bank-reconciliation-approve'),
    path('bank-reconciliation/<int:pk>/reject/',views.BankReconciliationRejectView.as_view(),name='bank-reconciliation-reject'),
    path('bank-reconciliation/<int:pk>/items/',views.BankReconciliationItemView.as_view(),name='bank-reconciliation-items'),
    path('bank-reconciliation/<int:pk>/comments/',views.BankReconciliationCommentView.as_view(),name='bank-reconciliation-comments'),
    path('bank-reconciliation/<int:pk>/attachments/',views.BankReconciliationAttachmentView.as_view(),name='bank-reconciliation-attachments'),
    path('bank-reconciliation/<int:pk>/history/', views.BankReconciliationHistoryView.as_view(), name='bank-reconciliation-history'),
]    
 