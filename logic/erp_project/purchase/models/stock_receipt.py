from django.db import models
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from masters.models import Supplier, Product, Warehouse
from .purchase_order import PurchaseOrder

User = get_user_model()


class StockReceipt(models.Model):
    GRN_ID = models.CharField(max_length=20, unique=True, editable=False)

    po_reference = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stock_receipts'
    )

    received_date = models.DateField(default=timezone.now)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    supplier_dn_no = models.CharField(max_length=100, blank=True)
    supplier_invoice_no = models.CharField(max_length=100, blank=True)

    received_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='received_stock_receipts'
    )

    qc_done_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='qc_stock_receipts'
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ('Draft', 'Draft'),
            ('Submitted', 'Submitted'),
            ('Partially Returned', 'Partially Returned'),
            ('Returned', 'Returned'),
            ('Cancelled', 'Cancelled')
        ],
        default='Draft'
    )

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_stock_receipts')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_stock_receipts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.GRN_ID:
            today = timezone.now().strftime("%Y%m%d")
            last = StockReceipt.objects.filter(
                GRN_ID__startswith=f"GRN-{today}"
            ).order_by('-GRN_ID').first()

            num = 1
            if last:
                try:
                    num = int(last.GRN_ID.split('-')[-1]) + 1
                except:
                    pass

            self.GRN_ID = f"GRN-{today}-{num:04d}"

        if self.po_reference and not self.supplier:
            self.supplier = self.po_reference.supplier

        super().save(*args, **kwargs)

    def __str__(self):
        return self.GRN_ID


class StockReceiptItem(models.Model):
    stock_receipt = models.ForeignKey(StockReceipt, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)

    product_name = models.CharField(max_length=255, blank=True, editable=False)
    uom = models.CharField(max_length=50, blank=True, editable=False)

    qty_ordered = models.IntegerField(default=0, editable=False)
    qty_received = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(999999)])
    accepted_qty = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    rejected_qty = models.IntegerField(default=0, editable=False)
    qty_returned = models.IntegerField(default=0, editable=False)

    stock_dim = models.CharField(
        max_length=20,
        choices=[
            ('None', 'None'),
            ('Serial', 'Serial'),
            ('Batch', 'Batch')
        ],
        default='None'
    )

    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True)

    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.product:
            self.product_name = self.product.name
            self.uom = self.product.uom.name if self.product.uom else ""

        if not self.qty_ordered and self.stock_receipt.po_reference:
            po_item = self.stock_receipt.po_reference.items.filter(product=self.product).first()
            if po_item:
                self.qty_ordered = po_item.qty_ordered

        self.rejected_qty = max(0, self.qty_received - self.accepted_qty)

        subtotal = self.qty_received * self.unit_price
        discount_amount = subtotal * (self.discount_rate / 100)
        after_discount = subtotal - discount_amount
        self.total = after_discount + (after_discount * self.tax_rate / 100)

        super().save(*args, **kwargs)


class SerialNumber(models.Model):
    stock_receipt_item = models.ForeignKey(StockReceiptItem, on_delete=models.CASCADE, related_name='serial_numbers')
    serial_no = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.serial_no


class BatchNumber(models.Model):
    stock_receipt_item = models.ForeignKey(StockReceiptItem, on_delete=models.CASCADE, related_name='batch_numbers')
    batch_no = models.CharField(max_length=100)
    batch_qty = models.IntegerField()
    mfg_date = models.DateField()
    expiry_date = models.DateField()

    def __str__(self):
        return self.batch_no


class BatchSerialNumber(models.Model):
    batch_number = models.ForeignKey(BatchNumber, on_delete=models.CASCADE, related_name='serial_numbers')
    serial_no = models.CharField(max_length=100, unique=True)


class StockReceiptComment(models.Model):
    stock_receipt = models.ForeignKey(StockReceipt, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class StockReceiptHistory(models.Model):
    stock_receipt = models.ForeignKey(StockReceipt, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class StockReceiptAttachment(models.Model):
    stock_receipt = models.ForeignKey(StockReceipt, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='stock_receipts/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)
