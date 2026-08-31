
from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal

from masters.models import Supplier
from core.models import Candidate
from ..models.accounts_receivable import AccountsReceivableVoucher


class BankCashPayment(models.Model):

    # CHOICES

    PAYMENT_MODE_CHOICES = [
        ("CASH",   "Cash"),
        ("BANK",   "Bank"),
        ("CHEQUE", "Cheque"),
        ("UPI",    "UPI"),
        ("NEFT",   "NEFT"),
        ("RTGS",   "RTGS"),
    ]

    PAYMENT_TYPE_CHOICES = [
        ("AGAINST_INVOICE", "Against Invoice"),
        ("ADVANCE",      "Advance"),
        ("ON_ACCOUNT",   "On Account"),
    ]

    PAYEE_TYPE_CHOICES = [
        ("VENDOR", "Vendor"),
        ("EMPLOYEE", "Employee"),
        ("OTHER",    "Other"),
    ]

    CURRENCY_CHOICES = [
        ("INR", "INR"),
        ("USD", "USD"),
        ("EUR", "EUR"),
    ]

    INSTRUMENT_TYPE_CHOICES = [
        ("CHEQUE", "Cheque"),
        ("NEFT",   "NEFT"),
        ("UPI",    "UPI"),
    ]

    STATUS_CHOICES = [
        ("DRAFT",     "Draft"),
        ("SUBMITTED", "Submitted"),
        ("APPROVED",  "Approved"),
        ("POSTED",    "Posted"),
        ("CANCELLED", "Cancelled"),
    ]

    #payment_voucher_no = models.CharField(max_length=50, unique=True, editable=False)
    payment_voucher_no = models.CharField(
    max_length=50, unique=True,
    editable=False,
    null=True, blank=True
)
    payment_date = models.DateField(default=timezone.now)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    
    #payee fields
    payee_type = models.CharField(max_length=20, choices=PAYEE_TYPE_CHOICES)
    payee_name = models.CharField(max_length=255)
    
    # vendor = models.ForeignKey(
    #    vendor,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True
    # )
    # employee = models.ForeignKey(
    #     Candidate,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True
    # )
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default="INR")
    exchange_rate = models.DecimalField(max_digits=15, decimal_places=4, null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)   
    generated_on = models.DateTimeField(default=timezone.now)


    # invoice link
    ar_voucher = models.ForeignKey(
        AccountsReceivableVoucher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bank_cash_payments"
    )
    invoice_number = models.CharField(max_length=100,)
    invoice_date = models.DateField(null=True, blank=True, editable=False)
    amount_received = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    tds_deducted = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    #net_amount_received = models.DecimalField(max_digits=15, decimal_places=2, editable=False)
    net_amount_received = models.DecimalField(
    max_digits=15, decimal_places=2,
    editable=False,
    null=True, blank=True,
    default=Decimal("0.00")
)
    outstanding_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    advance_adjustment = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # bank/instrument fields
    bank_account = models.CharField(max_length=100)
    instrument_type = models.CharField(max_length=20, choices=INSTRUMENT_TYPE_CHOICES)
    instrument_number = models.CharField(max_length=50, null=True, blank=True)
    instrument_date = models.DateField()
    drawer_bank_name = models.CharField(max_length=100, null=True, blank=True)  
    branch_name = models.CharField(max_length=100, null=True, blank=True)

    # accounting entry fields link to GL accounts (denormalized for reporting)

    debit_bank_cash_ac = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    credit_customer_ac = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    credit_tds_payable = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # status fields
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="DRAFT")
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bcp_updated"
    )
    updated_at = models.DateTimeField(null=True, blank=True)

    # audit fields
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bcp_created"
    )
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.payment_voucher_no} | {self.payee_name} | {self.status}"
    
    def populate_from_ar_voucher(self):
        if self.ar_voucher:
            self.invoice_number = self.ar_voucher.customer_invoice_number
            self.invoice_date   = self.ar_voucher.invoice_date
    
    # def populate_payee(self):
    #     if self.vendor:
    #         self.payee_type = "VENDOR"
    #         self.payee_name = str(self.vendor)
    #     elif self.employee:
    #         self.payee_type = "EMPLOYEE"
    #         self.payee_name = str(self.employee)
    
    def calculate_amounts(self):
        self.net_amount_received = (
            self.amount_received or Decimal("0.00")
        ) - (
            self.tds_deducted or Decimal("0.00")
        )
        
    def save(self, *args, **kwargs):
        # self.populate_payee()
        self.populate_from_ar_voucher()
        self.calculate_amounts()
        super().save(*args, **kwargs)

        if not self.payment_voucher_no:
            self.payment_voucher_no = f"PV-{timezone.now().year}-{str(self.id).zfill(4)}"
            super().save(update_fields=["payment_voucher_no"])


class BankCashPaymentItem(models.Model):
    payment = models.ForeignKey(
        BankCashPayment,
        on_delete=models.CASCADE,
        related_name="items"
    )

    ar_voucher = models.ForeignKey(
        AccountsReceivableVoucher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payment_lines"
    )

    invoice_number = models.CharField(max_length=100, null=True, blank=True)
    invoice_date   = models.DateField(null=True, blank=True, editable=False)
    vendor_name  = models.CharField(max_length=255, null=True, blank=True)
    invoice_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    payment_amount     = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    tds_deducted       = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    net_amount   = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, editable=False)
    outstanding_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True, editable=False)

    def __str__(self):
        return f"{self.payment.payment_voucher_no} | {self.invoice_number or 'No Invoice'}"

    def populate_from_ar_voucher(self):
        if self.ar_voucher:
            self.invoice_number = self.ar_voucher.customer_invoice_number
            self.invoice_date   = self.ar_voucher.invoice_date
          #  self.vendor_name  = str(self.ar_voucher.supplier_name)
            self.invoice_amount = self.ar_voucher.invoice_amount

    def calculate_amounts(self):
        self.net_amount = (
            self.payment_amount or Decimal("0.00")
        ) - (
            self.tds_deducted or Decimal("0.00")
        )
        self.outstanding_amount = (
            self.invoice_amount or Decimal("0.00")
        ) - (
            self.payment_amount or Decimal("0.00")
        )

    def save(self, *args, **kwargs):
        self.populate_from_ar_voucher()
        self.calculate_amounts()
        super().save(*args, **kwargs)


class BankCashPaymentAttachment(models.Model):
    payment = models.ForeignKey(
        BankCashPayment,
        on_delete=models.CASCADE,
        related_name="attachments"
    )
    file = models.FileField(upload_to="bank_cash_payments/attachments/%Y/%m/%d/")
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="bcp_attachments"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

class BankCashPaymentComment(models.Model):
    payment = models.ForeignKey(
        BankCashPayment,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    comment = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="bcp_comments"
    )
    timestamp = models.DateTimeField(auto_now_add=True)

class BankCashPaymentHistory(models.Model):
    payment = models.ForeignKey(
        BankCashPayment,
        on_delete=models.CASCADE,
        related_name="history"
    )
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="bcp_history"
    )
    details   = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    

