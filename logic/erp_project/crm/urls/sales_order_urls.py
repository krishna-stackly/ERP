from django.urls import path
from ..views import sales_order_views as views

urlpatterns = [
    path('sales-orders/', views.SalesOrderListCreateView.as_view()),
    path('sales-orders/<int:pk>/', views.SalesOrderDetailView.as_view()),
    path('sales-orders/<int:pk>/comments/', views.SalesOrderCommentView.as_view()),
    path('sales-orders/<int:pk>/history/', views.SalesOrderHistoryView.as_view()),
    path('sales-orders/<int:pk>/action/', views.SalesOrderActionView.as_view()),
    path('sales-orders/<int:pk>/pdf/', views.SalesOrderPDFView.as_view()),
    path('sales-orders/<int:pk>/email/', views.SalesOrderMailView.as_view()),
    path('sales-orders/<int:pk>/generate-po/', views.GeneratePurchaseOrderFromSalesOrderView.as_view()),
    path('sales-orders/<int:pk>/generate-delivery-note/', views.GenerateDeliveryNoteFromSalesOrderView.as_view()),
    path('sales-orders/<int:pk>/generate-invoice/', views.GenerateInvoiceFromSalesOrderView.as_view()),
]