from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from masters.models import Supplier, Product
from decimal import Decimal

User = get_user_model()


class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Partially Received', 'Partially Received'),
        ('Closed', 'Closed'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_TERMS_CHOICES = [
        ('Net 30', 'Net 30'),
        ('Net 45', 'Net 45'),
        ('Net 90', 'Net 90'),
        ('Credit', 'Credit'),
        ('Advance', 'Advance'),
        ('Partial Advance', 'Partial Advance'),
        ('On Delivery (COD)', 'On Delivery (COD)'),
        ('Upon Invoice', 'Upon Invoice'),
    ]

    INCO_TERMS_CHOICES = [
        ('FOB', 'FOB (Free On Board)'),
        ('CIF', 'CIF (Cost, Insurance & Freight)'),
        ('EXW', 'EXW (Ex Works)'),
        ('DDP', 'DDP (Delivered Duty Paid)'),
        ('DAP', 'DAP (Delivered at Place)'),
        ('FCA', 'FCA (Free Carrier)'),
        ('CFR', 'CFR (Cost and Freight)'),
    ]

    CURRENCY_CHOICES = [
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('INR', 'INR'),
        ('GBP', 'GBP'),
        ('SGD', 'SGD'),
    ]

    PO_ID = models.CharField(max_length=20, unique=True, editable=False)
    po_date = models.DateField(default=timezone.now)
    delivery_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Draft')

    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    supplier_name = models.CharField(max_length=255, blank=True)

    payment_terms = models.CharField(max_length=50, choices=PAYMENT_TERMS_CHOICES, blank=True)
    inco_terms = models.CharField(max_length=50, choices=INCO_TERMS_CHOICES, blank=True)
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='INR')

    notes_comments = models.TextField(blank=True)

    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    tax_summary = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    shipping_charges = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    rounding_adjustment = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, editable=False)
    total_order_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_pos')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_pos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.PO_ID:
            today = timezone.now().strftime("%Y%m%d")
            last = PurchaseOrder.objects.filter(
                PO_ID__startswith=f"PO-{today}"
            ).order_by('-PO_ID').first()

            num = 1
            if last:
                try:
                    num = int(last.PO_ID.split('-')[-1]) + 1
                except:
                    pass

            self.PO_ID = f"PO-{today}-{num:03d}"

        super().save(*args, **kwargs)

    def calculate_summary(self):
        subtotal = sum((item.total for item in self.items.all()), Decimal('0.00'))

        discount_rate = (self.global_discount or Decimal('0.00')) / Decimal('100')
        discount_amount = subtotal * discount_rate
        after_discount = subtotal - discount_amount

        tax_summary = sum((item.tax_amount for item in self.items.all()), Decimal('0.00'))

        shipping = self.shipping_charges or Decimal('0.00')
        rounding = self.rounding_adjustment or Decimal('0.00')

        total_order_value = after_discount + tax_summary + shipping + rounding

        PurchaseOrder.objects.filter(id=self.id).update(
            subtotal=subtotal,
            tax_summary=tax_summary,
            total_order_value=total_order_value
        )

    def __str__(self):
        return self.PO_ID


class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)

    product_name = models.CharField(max_length=255, blank=True)
    uom = models.CharField(max_length=50, blank=True)
    in_stock = models.IntegerField(default=0, editable=False)
    qty_ordered = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    insufficient_stock = models.IntegerField(default=0, editable=False)

    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])

    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.product:
            self.product_name = self.product.name
            self.uom = self.product.uom.name if self.product.uom else ""
            self.in_stock = self.product.quantity
            self.insufficient_stock = max(0, self.qty_ordered - self.in_stock)

        qty = Decimal(self.qty_ordered or 0)
        unit_price = Decimal(self.unit_price or 0)

        subtotal = qty * unit_price
        discount_amount = subtotal * (Decimal(self.discount_rate or 0) / Decimal('100'))
        after_discount = subtotal - discount_amount

        self.tax_amount = after_discount * (Decimal(self.tax_rate or 0) / Decimal('100'))
        self.total = after_discount + self.tax_amount

        super().save(*args, **kwargs)


class PurchaseOrderHistory(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    details = models.TextField(blank=True)


class PurchaseOrderComment(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(default=timezone.now)


class PurchaseOrderAttachment(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='purchase_orders/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)
