

from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal
from masters.models import Supplier, Department
from purchase.models import PurchaseOrder
#from crm.models import Invoice


class AccountsPayableVoucher(models.Model):

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    CURRENCY_CHOICES = [
        ("INR", "INR"),
        ("USD", "USD"),
        ("EUR", "EUR"),
        ("GBP", "GBP"),
    ]

    TAX_DETAILS_CHOICES = [
        ("GST_5", "GST 5%"),
        ("GST_12", "GST 12%"),
        ("GST_18", "GST 18%"),
        ("GST_28", "GST 28%"),
        ("VAT_20", "VAT 20%"),
        ("TDS_10", "TDS 10% (Professional Fees)"),
        ("TDS_2", "TDS 2% (Contractor Payments)"),
    ]

    

    voucher_no = models.CharField(max_length=50, unique=True, editable=False)
    voucher_date = models.DateField(default=timezone.now)
    supplier_name = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    purchase_order_no = models.ForeignKey(PurchaseOrder, on_delete=models.SET_NULL, null=True, blank=True)
    grn_no = models.CharField(max_length=100, null=True, blank=True)
    invoice_no = models.CharField(max_length=100)
    invoice_date = models.DateField()

    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="INR")
    exchange_rate = models.DecimalField(max_digits=12, decimal_places=4, default=Decimal("1.00"))

    department_cost_center = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    #item_description = models.CharField(max_length=255)
    #quantity = models.DecimalField(max_digits=10, decimal_places=2)
    #unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    #tax_details = models.CharField(max_length=20, choices=TAX_DETAILS_CHOICES, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    grand_total = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    debit_account = models.CharField(max_length=100)
    credit_account = models.CharField(max_length=100)
    tax_payable_account = models.CharField(max_length=100, null=True, blank=True)
    tds_payable = models.CharField(max_length=100, null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    approval_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="ap_created")
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="ap_approved")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.voucher_no} - {self.supplier_name.name if self.supplier_name else ''}"

    def calculate_totals(self):
        items = self.items.all()

        subtotal = sum([item.line_total for item in items])
        tax = sum([item.tax_amount for item in items])

        self.subtotal = subtotal
        self.tax_amount = tax
        self.grand_total = subtotal - self.discount + tax

    def save(self, *args, **kwargs):
        is_new = self.id is None
        super().save(*args, **kwargs)

        if is_new and not self.voucher_no:
            self.voucher_no = f"APV-{3000 + self.id}"
            super().save(update_fields=["voucher_no"])

class AccountsPayableVoucherItem(models.Model):

    TAX_TYPE_CHOICES = [
        ("GST_5", "GST 5%"),
        ("GST_12", "GST 12%"),
        ("GST_18", "GST 18%"),
        ("GST_28", "GST 28%"),
        ("VAT_20", "VAT 20%"),
        ("TDS_10", "TDS 10%"),
        ("TDS_2", "TDS 2%"),
    ]

    voucher = models.ForeignKey(
        AccountsPayableVoucher,
        on_delete=models.CASCADE,
        related_name="items"
    )

    
    item_description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    tax_type = models.CharField(max_length=20, choices=TAX_TYPE_CHOICES, null=True, blank=True)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    
    line_total = models.DecimalField(max_digits=15, decimal_places=2, editable=False, default=Decimal("0.00"))

    department_cost_center = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

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


    def save(self, *args, **kwargs):
        # calculate line total
        self.line_total = self.quantity * self.unit_price

        # calculate tax
        tax_rate = self.get_tax_rate()
        self.tax_amount = (self.line_total * tax_rate) / Decimal("100")

        super().save(*args, **kwargs)

        # update parent voucher totals
        if self.voucher:
           self.voucher.calculate_totals()
           self.voucher.save()          

class AccountsPayableVoucherAttachment(models.Model):
    accounts_payable = models.ForeignKey(
        AccountsPayableVoucher,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file = models.FileField(upload_to='accounts_payable/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class AccountsPayableVoucherComment(models.Model):
    accounts_payable = models.ForeignKey(
        AccountsPayableVoucher,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class AccountsPayableVoucherHistory(models.Model):
    accounts_payable = models.ForeignKey(
        AccountsPayableVoucher,
        on_delete=models.CASCADE,
        related_name='history'
    )
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)      
