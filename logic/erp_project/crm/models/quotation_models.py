from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Sum, F
from decimal import Decimal, ROUND_HALF_UP

from masters.models import Product, UOM, Customer, TaxCode


class Quotation(models.Model):
    quotation_id = models.CharField(max_length=10, unique=True, editable=False)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_quotations'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_quotations'
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='quotations'
    )

    customer_po_reference = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    sales_rep = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sales_rep_quotations',
        limit_choices_to={'role__role': 'Sales Representative'},
    )

    quotation_type = models.CharField(
        max_length=50,
        choices=[
            ('Standard', 'Standard'),
            ('Blanket', 'Blanket'),
            ('Service', 'Service')
        ],
        default='Standard',
    )

    quotation_date = models.DateField(default=timezone.now)
    expiry_date = models.DateField(blank=True, null=True)

    currency = models.CharField(
        max_length=3,
        choices=[
            ('INR', 'INR'),
            ('USD', 'USD'),
            ('EUR', 'EUR'),
            ('GBP', 'GBP'),
            ('SGD', 'SGD')
        ],
        default='INR',
    )

    payment_terms = models.CharField(max_length=50, blank=True)
    expected_delivery = models.DateField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ('Draft', 'Draft'),
            ('Submitted', 'Submitted'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
            ('Converted to SO', 'Converted to SO'),
            ('Expired', 'Expired')
        ],
        default='Draft',
    )

    revise_count = models.PositiveIntegerField(default=0)

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

    rounding_adjustment = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        editable=False
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.quotation_id:
            last = Quotation.objects.order_by('-id').first()
            num = 1

            if last and last.quotation_id:
                try:
                    num = int(last.quotation_id.replace('QUO', '')) + 1
                except:
                    pass

            self.quotation_id = f"QUO{num:04d}"

        if self.expiry_date and self.expiry_date < timezone.now().date():
            if self.status not in ['Expired', 'Rejected', 'Converted to SO']:
                self.status = 'Expired'

        super().save(*args, **kwargs)

    @property
    def subtotal(self):
        return self.items.aggregate(
            subtotal=Sum('total')
        )['subtotal'] or Decimal("0.00")

    @property
    def tax_summary(self):
        return self.items.aggregate(
            tax=Sum(F('total') * F('tax_rate') / Decimal("100"))
        )['tax'] or Decimal("0.00")

    @property
    def grand_total(self):
        subtotal = self.subtotal
        discount_rate = self.global_discount or Decimal("0.00")
        shipping = self.shipping_charges or Decimal("0.00")
        tax = self.tax_summary

        discount = subtotal * (discount_rate / Decimal("100"))
        total = subtotal - discount + tax + shipping

        rounded_total = total.quantize(
            Decimal("1"),
            rounding=ROUND_HALF_UP
        )

        self.rounding_adjustment = rounded_total - total

        return (total + self.rounding_adjustment).quantize(
            Decimal("0.01")
        )

    def __str__(self):
        return self.quotation_id


class QuotationItem(models.Model):
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    product_name = models.CharField(
        max_length=200,
        editable=False
    )

    product_id_display = models.CharField(
        max_length=20,
        editable=False
    )

    uom = models.ForeignKey(
        UOM,
        on_delete=models.SET_NULL,
        null=True
    )

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00")
    )

    tax = models.ForeignKey(
        TaxCode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00"),
        editable=False
    )

    quantity = models.PositiveIntegerField(default=1)

    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False
    )

    def save(self, *args, **kwargs):
        self.product_name = self.product.name
        self.product_id_display = self.product.product_id

        self.tax_rate = (
            self.tax.percentage if self.tax else Decimal("0.00")
        )

        qty = Decimal(str(self.quantity))
        subtotal = qty * self.unit_price

        discount_amount = subtotal * (
            self.discount / Decimal("100")
        )

        after_discount = subtotal - discount_amount

        tax_amount = after_discount * (
            self.tax_rate / Decimal("100")
        )

        self.total = after_discount + tax_amount

        super().save(*args, **kwargs)

    def __str__(self):
        return self.product_name


class QuotationAttachment(models.Model):
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name='attachments'
    )

    file = models.FileField(
        upload_to='quotations/attachments/%Y/%m/%d/'
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.quotation.quotation_id}"


class QuotationComment(models.Model):
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    comment_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    comment = models.TextField()

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.comment_by} on {self.quotation.quotation_id}"


class QuotationHistory(models.Model):
    EVENT_TYPES = (
        ('status_change', 'Status Change'),
        ('pdf_generated', 'PDF Generated'),
        ('email_sent', 'Email Sent'),
    )

    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name='history'
    )

    event_type = models.CharField(
        max_length=20,
        choices=EVENT_TYPES,
        default='status_change'
    )

    status = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    extra_info = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.event_type} for {self.quotation.quotation_id}"


class QuotationRevision(models.Model):
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name='revisions'
    )

    revision_no = models.PositiveIntegerField()

    revision_date = models.DateField(
        auto_now_add=True
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    comment = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        default='Submitted'
    )

    class Meta:
        ordering = ['-revision_no']

    def __str__(self):
        return f"Revision {self.revision_no} for {self.quotation.quotation_id}"
