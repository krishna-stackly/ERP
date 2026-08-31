from django.db import models
from django.utils import timezone
from django.conf import settings
from masters.models import Supplier, Product
from decimal import Decimal, ROUND_HALF_UP

from .purchase_order import PurchaseOrder
from .stock_receipt import StockReceipt, StockReceiptItem, SerialNumber, BatchSerialNumber


class StockReturn(models.Model):
    SRN_ID = models.CharField(max_length=20, unique=True, editable=False)

    po_reference = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stock_returns'
    )

    grn_reference = models.ForeignKey(
        StockReceipt,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stock_returns'
    )

    received_date = models.DateField(blank=True, null=True)
    return_date = models.DateField(default=timezone.now)

    return_initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='initiated_returns'
    )

    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ('Draft', 'Draft'),
            ('Submitted', 'Submitted'),
            ('Partially Returned', 'Partially Returned'),
            ('Cancelled', 'Cancelled')
        ],
        default='Draft'
    )

    original_purchased_total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    return_subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    global_discount_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    rounding_adjustment = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    amount_to_recover = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_returns')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_returns')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.SRN_ID:
            today = timezone.now().strftime("%Y%m%d")
            last = StockReturn.objects.filter(
                SRN_ID__startswith=f"SRN-{today}"
            ).order_by('-SRN_ID').first()

            num = 1
            if last:
                try:
                    num = int(last.SRN_ID.split('-')[-1]) + 1
                except:
                    pass

            self.SRN_ID = f"SRN-{today}-{num:04d}"

        if self.grn_reference:
            self.supplier = self.grn_reference.supplier
        elif self.po_reference:
            self.supplier = self.po_reference.supplier

        super().save(*args, **kwargs)

    def recalculate_totals(self):
        subtotal = Decimal('0.00')

        for item in self.items.all():
            subtotal += item.total

        discount_amount = subtotal * (self.global_discount / Decimal('100'))
        total_before_round = subtotal - discount_amount
        rounded = total_before_round.quantize(Decimal('1'), rounding=ROUND_HALF_UP)

        StockReturn.objects.filter(pk=self.pk).update(
            return_subtotal=subtotal,
            global_discount_amount=discount_amount,
            rounding_adjustment=rounded - total_before_round,
            amount_to_recover=rounded
        )

        self.refresh_from_db()

    def __str__(self):
        return self.SRN_ID


class StockReturnItem(models.Model):
    stock_return = models.ForeignKey(
        StockReturn,
        on_delete=models.CASCADE,
        related_name='items'
    )

    stock_receipt_item = models.ForeignKey(
        StockReceiptItem,
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

    product_name = models.CharField(max_length=255, blank=True, editable=False)
    uom = models.CharField(max_length=50, blank=True)

    qty_ordered = models.IntegerField(default=0, editable=False)
    qty_rejected = models.IntegerField(default=0, editable=False)
    qty_returned = models.IntegerField(default=0)

    return_reason = models.TextField(blank=True)

    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.stock_receipt_item:
            self.product = self.stock_receipt_item.product
            self.product_name = self.stock_receipt_item.product_name
            self.qty_ordered = self.stock_receipt_item.qty_ordered
            self.qty_rejected = self.stock_receipt_item.rejected_qty
            self.unit_price = self.stock_receipt_item.unit_price
            self.tax_rate = self.stock_receipt_item.tax_rate
            self.discount_rate = self.stock_receipt_item.discount_rate

        subtotal = Decimal(self.qty_returned) * Decimal(self.unit_price)
        discount_amount = subtotal * (Decimal(self.discount_rate) / Decimal('100'))
        after_discount = subtotal - discount_amount
        tax_amount = after_discount * (Decimal(self.tax_rate) / Decimal('100'))

        self.total = after_discount + tax_amount

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_name} - Returned: {self.qty_returned}"


class SerialNumberReturn(models.Model):
    stock_return_item = models.ForeignKey(
        StockReturnItem,
        on_delete=models.CASCADE,
        related_name='serial_numbers'
    )

    serial = models.ForeignKey(
        SerialNumber,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    batch_serial = models.ForeignKey(
        BatchSerialNumber,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    def __str__(self):
        if self.serial:
            return self.serial.serial_no
        elif self.batch_serial:
            return self.batch_serial.serial_no
        return "No Serial"


class StockReturnComment(models.Model):
    stock_return = models.ForeignKey(StockReturn, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class StockReturnHistory(models.Model):
    stock_return = models.ForeignKey(StockReturn, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class StockReturnAttachment(models.Model):
    stock_return = models.ForeignKey(StockReturn, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='stock_returns/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)
