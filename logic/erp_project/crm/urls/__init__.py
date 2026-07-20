from django.urls import path, include

urlpatterns = [
    path('', include('crm.urls.enquiry_urls')),
    path('', include('crm.urls.quotation_urls')),
    path('', include('crm.urls.sales_order_urls')),
    path('', include('crm.urls.delivery_note_urls')),
    path('', include('crm.urls.invoice_urls')),
    path('', include('crm.urls.invoice_return_urls')),
    path('', include('crm.urls.delivery_note_return_urls')),
]