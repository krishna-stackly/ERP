from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator
from decimal import Decimal

from masters.models import Customer, Product, UOM, TaxCode
from crm.models.sales_order_models import SalesOrder


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Sent', 'Sent'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_TERMS_CHOICES = [
        ('Net 15', 'Net 15'),
        ('Net 30', 'Net 30'),
        ('Net 45', 'Net 45'),
        ('Due on Receipt', 'Due on Receipt'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('Credit Card', 'Credit Card'),
        ('Bank Transfer', 'Bank Transfer'),
        ('COD', 'COD'),
        ('PayPal', 'PayPal'),
    ]

    CURRENCY_CHOICES = [
        ('INR', 'INR'),
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('GBP', 'GBP'),
        ('SGD', 'SGD'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Partial', 'Partial'),
        ('Unpaid', 'Unpaid'),
    ]

    invoice_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        blank=True,
        null=True
    )

    sales_order = models.ForeignKey(
        SalesOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    invoice_date = models.DateField(default=timezone.now)

    invoice_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    due_date = models.DateField(blank=True, null=True)

    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    customer_ref_no = models.CharField(max_length=50, blank=True)
    invoice_tags = models.CharField(max_length=255, blank=True)
    terms_conditions = models.TextField(blank=True)

    payment_terms = models.CharField(
        max_length=20,
        choices=PAYMENT_TERMS_CHOICES,
        default='Net 30'
    )

    billing_address = models.TextField(blank=True)
    shipping_address = models.TextField(blank=True)

    email_id = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    contact_person = models.CharField(max_length=100, blank=True)

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        blank=True
    )

    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default='INR'
    )

    payment_ref_number = models.CharField(max_length=50, blank=True)
    transaction_date = models.DateField(blank=True, null=True)

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='Unpaid'
    )

    global_discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00")
    )

    shipping_charges = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )

    amount_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_invoices'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_invoices'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.invoice_id:
            last_invoice = Invoice.objects.order_by('-id').first()
            next_number = 1

            if last_invoice and last_invoice.invoice_id:
                try:
                    next_number = int(
                        last_invoice.invoice_id.replace('INV-', '')
                    ) + 1
                except:
                    next_number = 1

            self.invoice_id = f"INV-{next_number:05d}"

        super().save(*args, **kwargs)

    @property
    def grand_total(self):
        subtotal = sum(item.total for item in self.items.all()) or Decimal("0.00")

        discount_amount = (
            subtotal * (self.global_discount or Decimal("0.00")) / Decimal("100")
        )

        tax_amount = (
            sum(item.total * item.tax_rate / Decimal("100") for item in self.items.all())
            or Decimal("0.00")
        )

        shipping = self.shipping_charges or Decimal("0.00")

        return subtotal - discount_amount + tax_amount + shipping

    @property
    def balance_due(self):
        return self.grand_total - (self.amount_paid or Decimal("0.00"))

    def __str__(self):
        return self.invoice_id


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    product_name = models.CharField(
        max_length=255,
        blank=True,
        editable=False
    )

    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )

    returned_qty_cus = models.PositiveIntegerField(
        default=0,
        verbose_name="Returned Qty (Customer)"
    )

    uom = models.ForeignKey(
        UOM,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00")
    )

    tax_code = models.ForeignKey(
        TaxCode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00")
    )

    discount_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00")
    )

    total = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00"),
        editable=False
    )

    def save(self, *args, **kwargs):
        if self.product:
            self.product_name = self.product.name
            self.unit_price = self.product.unit_price or Decimal("0.00")
            self.uom = self.product.uom

        if self.tax_code:
            self.tax_rate = self.tax_code.percentage or Decimal("0.00")

        subtotal = Decimal(self.quantity) * Decimal(self.unit_price)
        discount = subtotal * (Decimal(self.discount_rate) / Decimal("100"))
        after_discount = subtotal - discount
        tax = after_discount * (Decimal(self.tax_rate) / Decimal("100"))

        self.total = after_discount + tax

        super().save(*args, **kwargs)


class InvoiceAttachment(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='attachments'
    )

    file = models.FileField(
        upload_to='invoices/attachments/%Y/%m/%d/'
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class InvoiceComment(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    comment = models.TextField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)


class InvoiceHistory(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='history'
    )

    event_type = models.CharField(max_length=100)

    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    details = models.TextField(blank=True)

    timestamp = models.DateTimeField(auto_now_add=True)
