

from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.conf import settings
from masters.models import Branch, Supplier, Product, UOM
from purchase.models import PurchaseOrder, PurchaseOrderItem


from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.conf import settings
from masters.models import Branch, Customer, Product, UOM
from crm.models import Invoice, InvoiceItem
from decimal import Decimal


class DebitNote(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Sent', 'Sent'),
        ('Settled', 'Settled'),
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

    dbn_id = models.CharField(max_length=20, unique=True, editable=False)
    debit_note_date = models.DateField(default=timezone.now)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name='debit_notes')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    updated_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    related_name='updated_debit_notes'
)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    currency = models.CharField(max_length=3, choices=[('INR', 'INR'), ('USD', 'USD'), ('EUR', 'EUR'), ('GBP', 'GBP'), ('SGD', 'SGD')], default='INR')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    po_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    payment_terms = models.CharField(max_length=20, choices=[
        ('Net 30', 'Net 30'), ('Net 45', 'Net 45'), ('Net 90', 'Net 90'), ('Credit', 'Credit'),
        ('Advance', 'Advance'), ('Partial Advance', 'Partial Advance'), ('On Delivery (COD)', 'On Delivery (COD)'),
        ('Upon Invoice', 'Upon Invoice')
    ], default='Net 30')
    inco_terms = models.CharField(max_length=30, choices=[
        ('FOB', 'FOB (Free On Board)'), ('CIF', 'CIF (Cost, Insurance & Freight)'),
        ('EXW', 'EXW (Ex Works)'), ('DDP', 'DDP (Delivered Duty Paid)'),
        ('DAP', 'DAP (Delivered at Place)'), ('FCA', 'FCA (Free Carrier)'),
        ('CFR', 'CFR (Cost and Freight)')
    ], default='FOB')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Unpaid')
    refund_mode = models.CharField(
    max_length=20,
    choices=REFUND_MODE_CHOICES,
    default='None'
)
    credit_limit = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    purchase_total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.dbn_id:
            last = DebitNote.objects.order_by('-id').first()
            num = 1
            if last and last.dbn_id:
                try:
                    num = int(last.dbn_id.replace('DBN-', '')) + 1
                except ValueError:
                    num = 1
            self.dbn_id = f"DBN-{num:05d}"

        # Auto-fill from Purchase Order when selected
        if self.purchase_order:
            self.supplier = self.purchase_order.supplier
            self.po_date = self.purchase_order.order_date
            self.due_date = self.purchase_order.expected_delivery
            self.payment_terms = self.purchase_order.payment_terms
            self.inco_terms = self.purchase_order.inco_terms
            self.purchase_total = self.purchase_order.grand_total or 0.00

        super().save(*args, **kwargs)

    def update_totals(self):
        from decimal import Decimal

        total = sum((item.total for item in self.items.all()), Decimal('0.00'))
        self.purchase_total = total
        self.save(update_fields=['purchase_total'])

    def __str__(self):
        return self.dbn_id


class DebitNoteItem(models.Model):
    debit_note = models.ForeignKey(DebitNote, on_delete=models.CASCADE, related_name='items')
    purchase_order_item = models.ForeignKey(PurchaseOrderItem, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True, editable=False)
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, blank=True)
    ordered_qty = models.PositiveIntegerField(default=0, editable=False)
    returned_qty = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    return_reason = models.TextField(blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.purchase_order_item:
            self.product = self.purchase_order_item.product
            self.product_name = self.purchase_order_item.product_name
            self.uom = self.purchase_order_item.uom
            self.ordered_qty = self.purchase_order_item.quantity
            self.unit_price = self.purchase_order_item.unit_price
            self.tax_rate = self.purchase_order_item.tax_rate
            self.discount_rate = self.purchase_order_item.discount_rate

        subtotal = Decimal(self.returned_qty) * Decimal(self.unit_price)
        discount = subtotal * (Decimal(self.discount_rate) / Decimal('100'))
        after_discount = subtotal - discount
        tax = after_discount * (Decimal(self.tax_rate) / Decimal('100'))
        self.total = after_discount + tax

        super().save(*args, **kwargs)


class DebitNoteAttachment(models.Model):
    debit_note = models.ForeignKey(DebitNote, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='debit_notes/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class DebitNoteComment(models.Model):
    debit_note = models.ForeignKey(DebitNote, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class DebitNoteHistory(models.Model):
    debit_note = models.ForeignKey(DebitNote, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


