from django.urls import path
from ..views import enquiry_views as views

urlpatterns = [
    path('enquiries/', views.EnquiryListCreateView.as_view()),
    path('enquiries/<int:pk>/', views.EnquiryDetailView.as_view()),
]