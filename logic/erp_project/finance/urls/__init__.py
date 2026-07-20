from django.urls import path, include

urlpatterns = [
    path('', include('finance.urls.credit_note')),
    path('', include('finance.urls.debit_note')),
    path('', include('finance.urls.account_payable')),
    path('', include('finance.urls.cashflow')),
    path('', include('finance.urls.trial_balance')),
    path('', include('finance.urls.form_issuable')),
    path('', include('finance.urls.form_receivable')),
    path('', include('finance.urls.revenue')),
    path('', include('finance.urls.accounts_receivable')),
    path('', include('finance.urls.bank_cash_receipts')),
    path('', include('finance.urls.bank_cash_payment')),
    path('', include('finance.urls.financial_reporting')),
    path('', include('finance.urls.journal_voucher')),
    path('', include('finance.urls.asset_sales')),
    path('', include('finance.urls.expence')),
    path('', include('finance.urls.contra_voucher')),
    path('', include('finance.urls.bank_reconcile')),
    path('', include('finance.urls.asset_insuarance')),
]