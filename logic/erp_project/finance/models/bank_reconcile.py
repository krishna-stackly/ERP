#Bank Reconciliation module :

from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
from django.core.exceptions import ValidationError


class BankReconciliation(models.Model):

    APPROVAL_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    CURRENCY_CHOICES = [
        ('INR', 'INR'),
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('GBP', 'GBP'),
    ]

    reconciliation_no = models.CharField(
        max_length=50,
        unique=True,
        editable=False
    )

    branch_company = models.CharField(
        max_length=255
    )

    currency = models.CharField(
        max_length=10,
        choices=CURRENCY_CHOICES,
        default='INR'
    )

    period_from = models.DateField()

    period_to = models.DateField()

    statement_date = models.DateField()

    bank_name = models.CharField(
        max_length=255
    )

    bank_account = models.CharField(
        max_length=255
    )

    opening_balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00")
    )

    closing_balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00")
    )

    system_balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00")
    )

    difference_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        editable=False,
        default=Decimal("0.00")
    )

    approval_status = models.CharField(
        max_length=50,
        choices=APPROVAL_STATUS_CHOICES,
        default='draft'
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    attachment = models.FileField(
        upload_to='bank_reconciliation/',
        blank=True,
        null=True
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='bank_reconciliation_created'
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bank_reconciliation_approved'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.reconciliation_no
    def clean(self):

        if self.period_from > self.period_to:
            raise ValidationError(
                "Period From cannot be greater than Period To"
            )

    def calculate_difference(self):
        self.difference_amount = (
            self.closing_balance or Decimal("0.00")
        ) - (
            self.system_balance or Decimal("0.00")
        )

    def save(self, *args, **kwargs):

        self.clean()

        self.calculate_difference()

        if not self.reconciliation_no:

            super().save(*args, **kwargs)

            self.reconciliation_no = f"BR-{1000 + self.id}"

            super().save(
                update_fields=['reconciliation_no']
            )

        else:
            super().save(*args, **kwargs)


#Line Items:

class BankReconciliationItem(models.Model):

    MATCH_STATUS_CHOICES = [
        ('matched', 'Matched'),
        ('unmatched', 'Unmatched'),
        ('pending', 'Pending'),
    ]
    DEBIT_CREDIT_CHOICES = [
    ("dr", "Debit"),
    ("cr", "Credit"),
    ]

    reconciliation = models.ForeignKey(
        BankReconciliation,
        on_delete=models.CASCADE,
        related_name='items'
    )

    statement_date = models.DateField()

    debit_credit = models.CharField(
        max_length=10
    )

    erp_transaction_date = models.DateField()

    transaction_type = models.CharField(
        max_length=100
    )

    document_number = models.CharField(
    max_length=100,
    blank=True,
    null=True
    )

    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00")
    )

    match_status = models.CharField(
        max_length=20,
        choices=MATCH_STATUS_CHOICES,
        default='pending'
    )

    ledger_posting = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.document_number


#Attachments:

class BankReconciliationAttachment(models.Model):

    reconciliation = models.ForeignKey(
        BankReconciliation,
        on_delete=models.CASCADE,
        related_name='attachments'
    )

    file = models.FileField(
        upload_to='bank_reconciliation/attachments/%Y/%m/%d/'
    )

    description = models.CharField(
        max_length=255,
        blank=True
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )


class BankReconciliationComment(models.Model):

    reconciliation = models.ForeignKey(
        BankReconciliation,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    comment = models.TextField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    timestamp = models.DateTimeField(
        auto_now_add=True
    )


class BankReconciliationHistory(models.Model):

    reconciliation = models.ForeignKey(
        BankReconciliation,
        on_delete=models.CASCADE,
        related_name='history'
    )

    event_type = models.CharField(
        max_length=100
    )

    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    details = models.TextField(
        blank=True
    )

    timestamp = models.DateTimeField(
        auto_now_add=True
    )