from django.urls import path
from ..views import form_issuable as views

urlpatterns = [

    # =============================
    # MASTER DATA
    # =============================

    # Departments
    path('form-issuables/departments/', views.DepartmentListCreateView.as_view(), name='departments-list-create'),
    path('form-issuables/departments/<int:pk>/', views.DepartmentDetailView.as_view(), name='departments-detail'),

    # Requesters
    path('form-issuables/requesters/', views.RequestedByListCreateView.as_view(), name='requesters-list-create'),
    path('form-issuables/requesters/<int:pk>/', views.RequestedByDetailView.as_view(), name='requesters-detail'),

    # Approvers
    path('form-issuables/approvers/', views.ApprovedByListCreateView.as_view(), name='approvers-list-create'),
    path('form-issuables/approvers/<int:pk>/', views.ApprovedByDetailView.as_view(), name='approvers-detail'),


     # Warehouse
     path('form-issuables/warehouse/',views.WarehouseDetListCreateView.as_view(),name='warehouse-list-create'),
     path('form-issuables/warehouse/<int:pk>/',views.WarehouseDetDetailView.as_view(),name='warehouse-detail'),

     # Batch Numbers
     path('form-issuables/batch/',views.BatchNoListCreateView.as_view(),name='batch-list-create'),
     path('form-issuables/batch/<int:pk>/',views.BatchNoDetailView.as_view(),name='batch-detail'),

     # FORM ISSUABLE
  

    path('form-issuables/', views.FormIssuableListCreateView.as_view(), name='formissuable-list-create'),
    path('form-issuables/<int:pk>/', views.FormIssuableDetailView.as_view(), name='formissuable-detail'),
    path('form-issuables/<int:pk>/action/', views.FormIssuableActionView.as_view(), name='formissuable-action'),
    path('form-issuables/<int:pk>/comments/', views.FormIssuableCommentView.as_view(), name='formissuable-comments'),
    path('form-issuables/<int:pk>/attachments/', views.FormIssuableAttachmentView.as_view(), name='formissuable-attachments'),
    path('form-issuables/<int:pk>/attachments/<int:attach_pk>/delete/', views.FormIssuableAttachmentView.as_view(), name='formissuable-attachment-delete'),
    path('form-issuables/<int:pk>/history/', views.FormIssuableHistoryView.as_view(), name='formissuable-history'),

]