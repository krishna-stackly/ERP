from django.urls import path
from ..views import trial_balance as views  



urlpatterns = [

    path('company/', views.CompanyView.as_view(), name='company'),
    path('company/<int:pk>/', views.CompanyDetailView.as_view(), name='company-detail'),
    path('trial-balance/', views.TrialBalanceListCreateView.as_view()),
    path('trial-balance/<int:pk>/', views.TrialBalanceDetailView.as_view(), name='trial-balance-detail'),
    path('trial-balance/<int:pk>/action/', views.TrialBalanceActionView.as_view()),
    path('trial-balance/<int:tb_id>/debit-summary/', views.DebitSummaryView.as_view(), name='debit-summary'),
    path('trial-balance/<int:tb_id>/credit-summary/', views.CreditSummaryView.as_view(), name='credit-summary'),
    path('ledger/', views.LedgerView.as_view(), name='ledger'),
    path('ledger/<int:pk>/', views.LedgerDetailView.as_view(), name='ledger-detail'),
    path('trial-balance/<int:tb_id>/consolidated/', views.ConsolidatedView.as_view()),
    path('trial-balance/<int:pk>/attachments/', views.TrialBalanceAttachmentView.as_view()),
    path('trial-balance/<int:pk>/attachments/<int:attach_pk>/',views.TrialBalanceAttachmentView.as_view(),name='trial-balance-attachment-delete'),
    path('trial-balance/<int:pk>/comments/', views.TrialBalanceCommentView.as_view()),
    path('trial-balance/<int:tb_id>/history/',views.TrialBalanceHistoryView.as_view(),name='trial-balance-history'),
]