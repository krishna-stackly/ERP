from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator
from decimal import Decimal

from masters.models import Customer, Product, UOM
from crm.models.invoice_return_models import InvoiceReturn, InvoiceReturnItem


class DeliveryNoteReturn(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Cancelled', 'Cancelled'),
    ]

    dnr_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )

    invoice_return = models.ForeignKey(
        InvoiceReturn,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='dn_returns'
    )

    dnr_date = models.DateField(default=timezone.now)
    customer_ref_no = models.CharField(max_length=50, blank=True)

    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    email_id = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    contact_person = models.CharField(max_length=100, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_dnr'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_dnr'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.dnr_id:
            last = DeliveryNoteReturn.objects.order_by('-id').first()
            num = 1

            if last and last.dnr_id:
                try:
                    num = int(last.dnr_id.replace('DNR-', '')) + 1
                except ValueError:
                    num = 1

            self.dnr_id = f"DNR-{num:05d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.dnr_id


class DeliveryNoteReturnItem(models.Model):
    delivery_note_return = models.ForeignKey(
        DeliveryNoteReturn,
        on_delete=models.CASCADE,
        related_name='items'
    )

    invoice_return_item = models.ForeignKey(
        InvoiceReturnItem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
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

    uom = models.ForeignKey(
        UOM,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    invoiced_qty = models.PositiveIntegerField(
        default=0,
        editable=False
    )

    returned_qty_cus = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )

    return_reason = models.TextField(blank=True)

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00")
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
        if self.invoice_return_item:
            self.product = self.invoice_return_item.product
            self.product_name = self.invoice_return_item.product_name
            self.uom = self.invoice_return_item.uom
            self.invoiced_qty = self.invoice_return_item.invoiced_qty
            self.unit_price = self.invoice_return_item.unit_price
            self.tax_rate = self.invoice_return_item.tax_rate
            self.discount_rate = self.invoice_return_item.discount_rate

        subtotal = Decimal(self.returned_qty_cus) * Decimal(self.unit_price)
        discount = subtotal * (Decimal(self.discount_rate) / Decimal("100"))
        after_discount = subtotal - discount
        tax = after_discount * (Decimal(self.tax_rate) / Decimal("100"))

        self.total = after_discount + tax

        super().save(*args, **kwargs)


class DeliveryNoteReturnSerial(models.Model):
    delivery_note_return_item = models.ForeignKey(
        DeliveryNoteReturnItem,
        on_delete=models.CASCADE,
        related_name='serial_numbers'
    )

    serial_no = models.CharField(max_length=100)

    class Meta:
        unique_together = ['delivery_note_return_item', 'serial_no']

    def __str__(self):
        return self.serial_no


class DeliveryNoteReturnAttachment(models.Model):
    delivery_note_return = models.ForeignKey(
        DeliveryNoteReturn,
        on_delete=models.CASCADE,
        related_name='attachments'
    )

    file = models.FileField(
        upload_to='dn_returns/attachments/%Y/%m/%d/'
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    description = models.CharField(
        max_length=255,
        blank=True
    )


class DeliveryNoteReturnComment(models.Model):
    delivery_note_return = models.ForeignKey(
        DeliveryNoteReturn,
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


class DeliveryNoteReturnHistory(models.Model):
    delivery_note_return = models.ForeignKey(
        DeliveryNoteReturn,
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
