from django.urls import path
from ..views import form_receivable as views

urlpatterns = [

    path('form-receivables/departments/', views.DepartmentListCreateView.as_view(), name='departments-list-create'),
    path('form-receivables/departments/<int:pk>/', views.DepartmentDetailView.as_view(), name='departments-detail'),

    
    path('form-receivables/suppliers/', views.SupplierListCreateView.as_view(), name='suppliers-list-create'),
    path('form-receivables/suppliers/<int:pk>/', views.SupplierDetailView.as_view(), name='suppliers-detail'),

    
    path('form-receivables/requesters/', views.RequestedByListCreateView.as_view(), name='requesters-list-create'),
    path('form-receivables/requesters/<int:pk>/', views.RequestedByDetailView.as_view(), name='requesters-detail'),

    
    path('form-receivables/approvers/', views.ApprovedByListCreateView.as_view(), name='approvers-list-create'),
    path('form-receivables/approvers/<int:pk>/', views.ApprovedByDetailView.as_view(), name='approvers-detail'),
 
     path('form-receivables/warehouses/',views.WarehouseDetListCreateView.as_view(),name='warehouse-list-create'),
     path('form-receivables/warehouse/<int:pk>/',views.WarehouseDetDetailView.as_view(),name='warehouse-detail'),


     path('form-receivables/batchno/',views.BatchNoListCreateView.as_view(),name='batch-list-create'),
     path('form-receivables/batchno/<int:pk>/',views.BatchNoDetailView.as_view(),name='batch-detail'),

   
    path('form-receivables/', views.FormReceivableListCreateView.as_view(), name='formreceivable-list-create'),
    path('form-receivables/<int:pk>/', views.FormReceivableDetailView.as_view(), name='formreceivable-detail'),
    path('form-receivables/<int:pk>/action/', views.FormReceivableActionView.as_view(), name='formreceivable-action'),
    path('form-receivables/<int:pk>/comments/', views.FormReceivableCommentView.as_view(), name='formreceivable-comments'),
    path('form-receivables/<int:pk>/attachments/', views.FormReceivableAttachmentView.as_view(), name='formreceivable-attachments'),
    path('form-receivables/<int:pk>/attachments/<int:attach_pk>/delete/', views.FormReceivableAttachmentView.as_view(), name='formreceivable-attachment-delete'),
    path('form-receivables/<int:pk>/history/', views.FormReceivableHistoryView.as_view(), name='formreceivable-history'),
]