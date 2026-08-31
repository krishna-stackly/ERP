from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal

from core.models import Candidate
from masters.models import Customer 
from ..models.accounts_receivable import AccountsReceivableVoucher

# MAIN MODEL

class BankCashReceipt(models.Model):

    # CHOICES

    RECEIPT_MODE_CHOICES = [
        ("CASH",   "Cash"),
        ("BANK",   "Bank"),
        ("CHEQUE", "Cheque"),
        ("UPI",    "UPI"),
        ("NEFT",   "NEFT"),
        ("RTGS",   "RTGS"),
    ]

    RECEIPT_TYPE_CHOICES = [
        ("AGAINST_INVOICE", "Against Invoice"),
        ("ADVANCE",         "Advance"),
        ("ON_ACCOUNT",      "On Account"),
    ]

    PAYER_TYPE_CHOICES = [
        ("CUSTOMER", "Customer"),
        ("EMPLOYEE", "Employee"),
        ("OTHER",    "Other"),
    ]

    CURRENCY_CHOICES = [
        ("INR", "INR"),
        ("USD", "USD"),
        ("EUR", "EUR"),
        ("GBP", "GBP"),
    ]

    INSTRUMENT_TYPE_CHOICES = [
        ("CHEQUE", "Cheque"),
        ("NEFT",   "NEFT"),
        ("UPI",    "UPI"),
        ("RTGS",   "RTGS"),
    ]

    STATUS_CHOICES = [
        ("DRAFT",     "Draft"),
        ("SUBMITTED", "Submitted"),
        ("APPROVED",  "Approved"),
        ("POSTED",    "Posted"),
        ("CANCELLED", "Cancelled"),
    ]

    
    receipt_voucher_no = models.CharField(max_length=50,unique=True,editable=False,null=True, blank=True) 
    receipt_date = models.DateField(default=timezone.now)

     
    # RECEIPT CLASSIFICATION
    
    receipt_mode = models.CharField(max_length=20, choices=RECEIPT_MODE_CHOICES)
    receipt_type = models.CharField(max_length=20, choices=RECEIPT_TYPE_CHOICES)

    
    # PAYER FIELDS

    payer_type = models.CharField(max_length=20, choices=PAYER_TYPE_CHOICES)
    payer_name = models.CharField(max_length=255)

    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="receipts"
    )
    employee = models.ForeignKey(
        Candidate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="receipts"
    )

    # CURRENCY FIELDS

    currency      = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default="INR")
    exchange_rate = models.DecimalField(max_digits=15, decimal_places=4, null=True, blank=True)

    # GENERAL FIELDS

    remarks      = models.TextField(null=True, blank=True)
    generated_on = models.DateTimeField(default=timezone.now)

    # INVOICE LINK (Header Level)
    # invoice_date auto-populates from this FK

    ar_voucher = models.ForeignKey(
        AccountsReceivableVoucher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bank_cash_receipts"
    )

    # RECEIPT DETAIL FIELDS

    invoice_number      = models.CharField(max_length=100, null=True, blank=True)
    invoice_date        = models.DateField(null=True, blank=True, editable=False)
    invoice_amount      = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    amount_received     = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    tds_deducted        = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    net_amount_received = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, editable=False)
    outstanding_amount  = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, editable=False)
    advance_adjustment  = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # BANK / INSTRUMENT FIELDS

    bank_account      = models.CharField(max_length=100, null=True, blank=True)
    instrument_type   = models.CharField(max_length=20, choices=INSTRUMENT_TYPE_CHOICES, null=True, blank=True)
    instrument_number = models.CharField(max_length=50, null=True, blank=True)
    instrument_date   = models.DateField(null=True, blank=True)
    drawer_bank_name  = models.CharField(max_length=100, null=True, blank=True)
    branch_name       = models.CharField(max_length=100, null=True, blank=True)

    # ACCOUNTING ENTRY FIELDS

    debit_bank_cash_ac    = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    credit_customer_ac    = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    credit_tds_receivable = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # STATUS FIELDS

    status        = models.CharField(max_length=15, choices=STATUS_CHOICES, default="DRAFT")
    cancel_reason = models.TextField(null=True, blank=True)
    cancelled_by  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bcr_cancelled"
    )
    cancelled_at  = models.DateTimeField(null=True, blank=True)

    # AUDIT FIELDS

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="bcr_created"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bcr_updated"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering: list[str] = ["-receipt_date"]

    def __str__(self):
        return f"{self.receipt_voucher_no} | {self.payer_name} | {self.status}"

    
    # AUTO-FILL FROM AR VOUCHER (Header Level)

    def populate_from_ar_voucher(self):
        if self.ar_voucher:
            self.invoice_number = self.ar_voucher.customer_invoice_number
            self.invoice_date   = self.ar_voucher.invoice_date
            self.invoice_amount = self.ar_voucher.invoice_amount

    # AUTO-FILL PAYER FROM LINKED ENTITY

    def populate_payer(self):
        if self.customer:
            self.payer_type = "CUSTOMER"
            self.payer_name = str(self.customer)
        elif self.employee:
            self.payer_type = "EMPLOYEE"
            self.payer_name = str(self.employee)

    # AUTO CALCULATIONS

    def calculate_amounts(self):
        self.net_amount_received = (
            self.amount_received or Decimal("0.00")
        ) - (
            self.tds_deducted or Decimal("0.00")
        )
        self.outstanding_amount = (
            self.invoice_amount or Decimal("0.00")
        ) - (
            self.amount_received or Decimal("0.00")
        )

    # SAVE

    def save(self, *args, **kwargs):
        self.populate_payer()
        self.populate_from_ar_voucher()
        self.calculate_amounts()
        super().save(*args, **kwargs)

        if not self.receipt_voucher_no:
            self.receipt_voucher_no = f"BR-{timezone.now().year}-{str(self.id).zfill(4)}"
            super().save(update_fields=["receipt_voucher_no"])


# LINE ITEMS


class BankCashReceiptLineItem(models.Model):

    receipt = models.ForeignKey(
        BankCashReceipt,
        on_delete=models.CASCADE,
        related_name="items"
    )

    # Link to AR Voucher at line level
    ar_voucher = models.ForeignKey(
        AccountsReceivableVoucher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="receipt_lines"
    )

    # Denormalized invoice details for reporting
    invoice_number = models.CharField(max_length=100, null=True, blank=True)
    invoice_date   = models.DateField(null=True, blank=True, editable=False)
    customer_name  = models.CharField(max_length=255, null=True, blank=True)
    invoice_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # Payment allocation
    receipt_amount      = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    tds_deducted        = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    net_amount_received = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, editable=False)
    outstanding_amount  = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, editable=False)

    

    def __str__(self):
        return f"{self.receipt.receipt_voucher_no} | {self.invoice_number or 'No Invoice'}"

    # AUTO-FILL FROM AR VOUCHER (Line Level)

    def populate_from_ar_voucher(self):
        if self.ar_voucher:
            self.invoice_number = self.ar_voucher.customer_invoice_number
            self.invoice_date   = self.ar_voucher.invoice_date
            self.customer_name  = str(self.ar_voucher.customer_name)
            self.invoice_amount = self.ar_voucher.invoice_amount

    # AUTO CALCULATIONS

    def calculate_amounts(self):
        self.net_amount_received = (
            self.receipt_amount or Decimal("0.00")
        ) - (
            self.tds_deducted or Decimal("0.00")
        )
        self.outstanding_amount = (
            self.invoice_amount or Decimal("0.00")
        ) - (
            self.receipt_amount or Decimal("0.00")
        )

    # SAVE

    def save(self, *args, **kwargs):
        self.populate_from_ar_voucher()
        self.calculate_amounts()
        super().save(*args, **kwargs)


# ATTACHMENTS

class BankCashReceiptAttachment(models.Model):

    receipt = models.ForeignKey(
        BankCashReceipt,
        on_delete=models.CASCADE,
        related_name="attachments"
    )
    file = models.FileField(upload_to="bank_cash_receipts/attachments/%Y/%m/%d/")
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="bcr_attachments"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

# COMMENTS

class BankCashReceiptComment(models.Model):

    receipt = models.ForeignKey(
        BankCashReceipt,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    comment = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="bcr_comments"
    )
    timestamp = models.DateTimeField(auto_now_add=True)

# HISTORY

class BankCashReceiptHistory(models.Model):

    receipt = models.ForeignKey(
        BankCashReceipt,
        on_delete=models.CASCADE,
        related_name="history"
    )
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="bcr_history"
    )
    details   = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
