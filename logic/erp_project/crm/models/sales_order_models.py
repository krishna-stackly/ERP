from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Sum, F, DecimalField as DJDecimalField
from decimal import Decimal, ROUND_HALF_UP

from masters.models import Customer, Product, UOM, TaxCode


class SalesOrder(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Ready to Submit', 'Ready to Submit'),
        ('Submitted', 'Submitted'),
        ('Submitted(PD)', 'Submitted(PD)'),
        ('Partially Delivered', 'Partially Delivered'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    ORDER_TYPE_CHOICES = [
        ('Standard', 'Standard'),
        ('Rush', 'Rush'),
        ('Backorder', 'Backorder'),
    ]

    sales_order_id = models.CharField(max_length=10, unique=True, editable=False)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_sales_orders'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_sales_orders'
    )

    order_date = models.DateField(default=timezone.now)

    sales_rep = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sales_rep_orders',
        limit_choices_to={'role__role': 'Sales Representative'},
    )

    order_type = models.CharField(
        max_length=50,
        choices=ORDER_TYPE_CHOICES,
        default='Standard'
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='sales_orders'
    )

    payment_method = models.CharField(max_length=50, blank=True)

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

    due_date = models.DateField(blank=True, null=True)
    terms_conditions = models.TextField(blank=True)

    shipping_method = models.CharField(max_length=50, blank=True)
    expected_delivery = models.DateField(blank=True, null=True)
    tracking_number = models.CharField(max_length=50, blank=True)

    internal_notes = models.TextField(blank=True)
    customer_notes = models.TextField(blank=True)

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

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.sales_order_id:
            last = SalesOrder.objects.order_by('-id').first()
            num = 1

            if last and last.sales_order_id:
                try:
                    num = int(last.sales_order_id.replace('SO-', '')) + 1
                except:
                    pass

            self.sales_order_id = f"SO-{num:04d}"

        super().save(*args, **kwargs)

    @property
    def subtotal(self):
        return self.items.aggregate(
            subtotal=Sum('total', output_field=DJDecimalField())
        )['subtotal'] or Decimal("0.00")

    @property
    def tax_summary(self):
        return self.items.aggregate(
            tax=Sum(
                F('total') * F('tax_rate') / Decimal("100"),
                output_field=DJDecimalField()
            )
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
        return self.sales_order_id


class SalesOrderItem(models.Model):
    sales_order = models.ForeignKey(
        SalesOrder,
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
        self.tax_rate = self.tax.percentage if self.tax else Decimal("0.00")

        qty = Decimal(str(self.quantity))
        unit_price = Decimal(str(self.unit_price))
        discount = Decimal(str(self.discount))
        tax_rate = Decimal(str(self.tax_rate))

        subtotal = qty * unit_price
        discount_amount = subtotal * (discount / Decimal("100"))
        after_discount = subtotal - discount_amount
        tax_amount = after_discount * (tax_rate / Decimal("100"))

        self.total = after_discount + tax_amount

        super().save(*args, **kwargs)


class SalesOrderComment(models.Model):
    sales_order = models.ForeignKey(
        SalesOrder,
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
        return f"Comment by {self.comment_by} on {self.sales_order.sales_order_id}"


class SalesOrderHistory(models.Model):
    EVENT_TYPES = (
        ('status_change', 'Status Change'),
        ('pdf_generated', 'PDF Generated'),
        ('email_sent', 'Email Sent'),
        ('po_generated', 'PO Generated'),
        ('delivery_note_generated', 'Delivery Note Generated'),
    )

    sales_order = models.ForeignKey(
        SalesOrder,
        on_delete=models.CASCADE,
        related_name='history'
    )

    event_type = models.CharField(
        max_length=50,
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
        return f"{self.event_type} for {self.sales_order.sales_order_id}"
