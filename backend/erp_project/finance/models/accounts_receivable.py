# --- ACCOUNTS RECEIVABLE VOUCHER ---
 
from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal
from masters.models import Branch, Department, Customer
from crm.models import SalesOrder, DeliveryNote
from crm.models import Invoice
 
 
# --- MAIN MODEL ---
 
class AccountsReceivableVoucher(models.Model):
 
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("posted", "Posted"),
        ("cancelled", "Cancelled"),
    ]
 
    PAYMENT_MODE_CHOICES = [
        ("cash", "Cash"),
        ("cheque", "Cheque"),
        ("upi", "UPI"),
        ("neft", "NEFT/RTGS"),
        ("card", "Card"),
    ]
 
    CURRENCY_CHOICES = [
        ("USD", "USD"),
        ("EUR", "EUR"),
        ("INR", "INR"),
        ("GBP", "GBP"),
    ]
 
    # --- Voucher Info ---
    voucher_number = models.CharField(max_length=50, unique=True, editable=False)
    voucher_date = models.DateField(default=timezone.now, db_index=True)
 
    customer_name = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name="ar_vouchers"
    )
 
    sales_order = models.ForeignKey(
        SalesOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ar_vouchers"
    )
 
    delivery_note = models.ForeignKey(
        DeliveryNote,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ar_vouchers"
    )
 
    customer_invoice_number = models.CharField(max_length=100, null=True, blank=True)
    invoice_date = models.DateField(default=timezone.now)
 
    payment_mode = models.CharField(
        max_length=10,
        choices=PAYMENT_MODE_CHOICES,
        default="cash"
    )
 
    # bank_cash_account = models.ForeignKey(
    #     "finance.GLAccount",
    #     on_delete=models.PROTECT,
    #     related_name="ar_bank_entries"
    # )
    bank_cash_account = models.CharField(max_length=100, null=True, blank=True)
 
    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default="INR"
    )
 
    exchange_rate = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        default=Decimal("1.0000")
    )
 
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ar_vouchers"
    )
 
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ar_vouchers"
    )
 
    # --- Receipt Details ---
    # sales_invoice = models.ForeignKey(
    #     Invoice,   # change if your model name is different
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True, related_name="ar_vouchers"
    # )
    invoice_amount = models.DecimalField(max_digits=15, decimal_places=2)
    amount_received = models.DecimalField(max_digits=15, decimal_places=2)
 
    tds_deducted = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00")
    )
 
    net_received = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        editable=False,
        default=Decimal("0.00")
    )
 
    balance_due = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        editable=False,
        default=Decimal("0.00")
    )
 
    payment_reference = models.CharField(max_length=100, null=True, blank=True)
    receipt_date = models.DateField(default=timezone.now)
 
    # --- Accounting Entries ---
    # customer_receivable_account = models.ForeignKey(
    #     "finance.GLAccount",
    #      on_delete=models.PROTECT,
    #      related_name="ar_customer_entries"
    # )
 
    # tds_payable = models.ForeignKey(
    #     "finance.GLAccount",
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="ar_tds_entries"
    # )
 
    # discount_allowed_account = models.ForeignKey(
    #     "finance.GLAccount",
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="ar_discount_entries"
    # )
    customer_receivable_account = models.CharField(max_length=100)
 
    tds_payable = models.CharField(max_length=100, null=True, blank=True)
 
    discount_allowed_account = models.CharField(max_length=100, null=True, blank=True)
 
    # --- Other ---
    remarks = models.TextField(null=True, blank=True)
 
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
        db_index=True
    )
 
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="ar_created"
    )
 
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="ar_approved"
    )
 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
   
 
    def __str__(self):
        return f"{self.voucher_number} - {self.customer_name}"
   
    # def populate_from_invoice(self):
    # """
    # Auto-fill data from linked Sales Invoice / AR source
    # """
    # if self.sales_invoice:
    #     self.invoice_amount = self.sales_invoice.invoice_amount
    #     self.invoice_date = self.sales_invoice.invoice_date
    #     self.customer_name = str(self.sales_invoice.customer_name)
 
    def calculate_amounts(self):
        self.net_received = (self.amount_received or Decimal("0.00")) - (
            self.tds_deducted or Decimal("0.00")
        )
        self.balance_due = (self.invoice_amount or Decimal("0.00")) - self.net_received
 
    def save(self, *args, **kwargs):
 
        #self.populate_from_invoice()
        self.calculate_amounts()
 
        super().save(*args, **kwargs)
 
        if not self.voucher_number:
            self.voucher_number = f"RV-{str(2000 + self.id).zfill(4)}"
            super().save(update_fields=["voucher_number"])
 
 
# --- LINE ITEMS ---
 
class AccountsReceivableVoucherItem(models.Model):
 
    TAX_TYPE_CHOICES = [
        ("GST_5", "GST 5%"),
        ("GST_12", "GST 12%"),
        ("GST_18", "GST 18%"),
        ("GST_28", "GST 28%"),
        ("VAT_20", "VAT 20%"),
        ("TDS_10", "TDS 10% (Professional Fees)"),
        ("TDS_2", "TDS 2% (Contractor Payments)"),
    ]
 
    voucher = models.ForeignKey(
        AccountsReceivableVoucher,
        on_delete=models.CASCADE,
        related_name="items"
    )
 
    item_description = models.CharField(max_length=255)
 
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
 
    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )
 
    tax_type = models.CharField(
        max_length=20,
        choices=TAX_TYPE_CHOICES,
        null=True,
        blank=True
    )
 
    tax_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00")
    )
 
    line_total = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        editable=False,
        default=Decimal("0.00")
    )
 
    customer_invoice_ref = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )
 
    def __str__(self):
        return f"{self.item_description} ({self.voucher.voucher_number})"
 
    def get_tax_rate(self):
        return {
            "GST_5": Decimal("5"),
            "GST_12": Decimal("12"),
            "GST_18": Decimal("18"),
            "GST_28": Decimal("28"),
            "VAT_20": Decimal("20"),
            "TDS_10": Decimal("10"),
            "TDS_2": Decimal("2"),
        }.get(self.tax_type, Decimal("0"))
 
    def calculate_total(self):
        subtotal = (self.quantity * self.unit_price) - self.discount
        tax_rate = self.get_tax_rate()
        self.tax_amount = (subtotal * tax_rate) / Decimal("100")
        self.line_total = subtotal + self.tax_amount
 
    def save(self, *args, **kwargs):
        self.calculate_total()
        super().save(*args, **kwargs)
 
 
# --- ATTACHMENTS / COMMENTS / HISTORY ---
 
class AccountsReceivableVoucherAttachment(models.Model):
    accounts_receivable = models.ForeignKey(
        AccountsReceivableVoucher,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file = models.FileField(upload_to='accounts_receivable/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)
 
 
class AccountsReceivableVoucherComment(models.Model):
    accounts_receivable = models.ForeignKey(
        AccountsReceivableVoucher,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
 
 
class AccountsReceivableVoucherHistory(models.Model):
    accounts_receivable = models.ForeignKey(
        AccountsReceivableVoucher,
        on_delete=models.CASCADE,
        related_name='history'
    )
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)