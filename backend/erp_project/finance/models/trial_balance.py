
from django.db import models
from django.conf import settings
from decimal import Decimal
from django.utils import timezone


# Company (Dropdown Source)

class Company(models.Model):
    company_code = models.CharField(max_length=10)
    company_name = models.CharField(max_length=100)
    group_name = models.CharField(max_length=50)

    def __str__(self):
        return self.company_name


# Trial Balance (Main)

class TrialBalance(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("posted", "Posted"),
        ("cancelled", "Cancelled"),
    ]
    CURRENCY_CHOICES = [
        ("INR", "INR"),
        ("USD", "USD"),
        ("EUR", "EUR"),
        ("GBP", "GBP"),
    ]
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    from_date = models.DateField()
    to_date = models.DateField()
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default="INR")
    as_on_date = models.DateField()
    include_unposted_txns = models.CharField(max_length=10, choices=[('yes','Yes'),('no','No')],default='Yes')
    level_of_detail = models.CharField(max_length=20,choices=[('summary','Summary'),('grouped','Grouped'),('detailed','Detailed')],default='Detailed')  # Summary / Grouped / Detailed
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    created_at = models.DateTimeField(auto_now_add=True)

# Line Items 

class TrialBalanceLineItem(models.Model):
    trial_balance = models.ForeignKey(TrialBalance, related_name="line_items", on_delete=models.CASCADE)

    account_code = models.IntegerField()
    account_name = models.CharField(max_length=100)
    group_name = models.CharField(max_length=50)

    opening_debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    opening_credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    period_debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    period_credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    closing_debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    closing_credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)


# Ledger (Drill Down)

class LedgerEntry(models.Model):
    line_item = models.ForeignKey(TrialBalanceLineItem, related_name="ledger_entries", on_delete=models.CASCADE)

    date = models.DateField()
    voucher_no = models.CharField(max_length=20)
    particulars = models.CharField(max_length=255)

    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=12, decimal_places=2)

# Attachments

class TrialBalanceAttachment(models.Model):
    trial_balance = models.ForeignKey(TrialBalance, related_name="attachments", on_delete=models.CASCADE)
    file = models.FileField(upload_to="trial_balance/")
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

# Comments

class TrialBalanceComment(models.Model):
    trial_balance = models.ForeignKey(TrialBalance, related_name="comments", on_delete=models.CASCADE)
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

# History

class TrialBalanceHistory(models.Model):
    trial_balance = models.ForeignKey(TrialBalance, related_name="history", on_delete=models.CASCADE)
    event_type = models.CharField(max_length=100)
    action_by = models.CharField(max_length=100)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True) 
          

