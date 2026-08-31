from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from masters.models import Branch, Department,Supplier,Customer, Product
from core.models import Candidate
from crm.models import Invoice
from purchase.models import PurchaseOrder

from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.conf import settings
from masters.models import Branch, Customer, Product, UOM
from crm.models import Invoice, InvoiceItem
from decimal import Decimal

class CreditNote(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Sent', 'Sent'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Partial', 'Partial'),
        ('Unpaid', 'Unpaid'),
    ]

    REFUND_MODE_CHOICES = [
        ('None', 'None'),
        ('Refund', 'Refund'),
        ('Adjust', 'Adjust'),
        ('Refund & Adjust', 'Refund & Adjust'),
    ]

    crn_id = models.CharField(max_length=20, unique=True, editable=False)
    credit_note_date = models.DateField(default=timezone.now)
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='credit_notes')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    updated_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    related_name='updated_credit_notes'
)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    currency = models.CharField(max_length=3, choices=[('INR', 'INR'), ('USD', 'USD'), ('EUR', 'EUR'), ('GBP', 'GBP'), ('SGD', 'SGD')], default='INR')
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    billing_address = models.TextField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    invoice_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    payment_terms = models.CharField(max_length=20, choices=[('Net 15', 'Net 15'), ('Net 30', 'Net 30'), ('Net 45', 'Net 45'), ('Due on Receipt', 'Due on Receipt')], default='Net 30')
    invoice_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Unpaid')
    
    invoice_total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    return_total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    refund_mode = models.CharField(
    max_length=20,
    choices=REFUND_MODE_CHOICES,
    default='None'
    )


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.crn_id:
            last = CreditNote.objects.order_by('-id').first()
            num = 1
            if last and last.crn_id:
                try:
                    num = int(last.crn_id.replace('CRN-', '')) + 1
                except ValueError:
                    num = 1
            self.crn_id = f"CRN-{num:05d}"

        if self.invoice:
            self.customer = self.invoice.customer
            self.billing_address = self.invoice.billing_address
            self.phone_number = self.invoice.phone_number
            self.invoice_date = self.invoice.invoice_date
            self.due_date = self.invoice.due_date
            self.payment_terms = self.invoice.payment_terms
            self.invoice_status = self.invoice.invoice_status
            self.invoice_total = self.invoice.grand_total or 0.00

        super().save(*args, **kwargs)
    
    def update_totals(self):
        total = sum(item.total for item in self.items.all())
        self.return_total = total
        self.save(update_fields=['return_total'])

    def __str__(self):
        return self.crn_id


class CreditNoteItem(models.Model):
    credit_note = models.ForeignKey(CreditNote, on_delete=models.CASCADE, related_name='items')
    invoice_item = models.ForeignKey(InvoiceItem, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True, editable=False)
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, blank=True)
    invoiced_qty = models.PositiveIntegerField(default=0, editable=False)
    returned_qty = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    return_reason = models.TextField(blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.invoice_item:
            self.product = self.invoice_item.product
            self.product_name = self.invoice_item.product_name
            self.uom = self.invoice_item.uom
            self.invoiced_qty = self.invoice_item.quantity
            self.unit_price = self.invoice_item.unit_price
            self.tax_rate = self.invoice_item.tax_rate
            self.discount_rate = self.invoice_item.discount_rate

        subtotal = Decimal(self.returned_qty) * Decimal(self.unit_price)
        discount = subtotal * (Decimal(self.discount_rate) / Decimal('100'))
        after_discount = subtotal - discount
        tax = after_discount * (Decimal(self.tax_rate) / Decimal('100'))
        self.total = after_discount + tax

        super().save(*args, **kwargs)


class CreditNoteAttachment(models.Model):
    credit_note = models.ForeignKey(CreditNote, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='credit_notes/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class CreditNoteComment(models.Model):
    credit_note = models.ForeignKey(CreditNote, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class CreditNoteHistory(models.Model):
    credit_note = models.ForeignKey(CreditNote, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)