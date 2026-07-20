from django.urls import path
from ..views import financial_reporting as views

urlpatterns = [
    path('reports/',views.FinancialReportAPIView.as_view()),
    path('reports/<int:pk>/', views.FinancialReportDetailAPIView.as_view()),
    path('reports/<int:pk>/action/',views.FinancialReportActionView.as_view()),
    path('reports/<int:report_id>/attachments/', views.FinancialReportAttachmentAPIView.as_view()),
    path('reports/<int:report_id>/attachments/<int:attach_pk>/',views.FinancialReportAttachmentAPIView.as_view(),name='financial-report-attachment-delete'),
    path('reports/<int:report_id>/comments/', views.FinancialReportCommentAPIView.as_view()),
    path('reports/<int:report_id>/history/', views.FinancialReportHistoryAPIView.as_view()),

]