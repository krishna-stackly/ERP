# purchases/models.py
from django.db import models
from django.utils import timezone
from masters.models import Supplier, Product ,Warehouse
from decimal import Decimal
from django.conf import settings
from decimal import Decimal, ROUND_HALF_UP
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
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

    payment_terms = models.CharField(
        max_length=50,
        choices=PAYMENT_TERMS_CHOICES,
        blank=True
    )
    inco_terms = models.CharField(
        max_length=50,
        choices=INCO_TERMS_CHOICES,
        blank=True
    )
    currency = models.CharField(
        max_length=10,
        choices=CURRENCY_CHOICES,
        default='INR'
    )

    notes_comments = models.TextField(blank=True)

    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    tax_summary = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)
    shipping_charges = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    rounding_adjustment = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, editable=False)
    total_order_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_pos')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_pos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.PO_ID:
            today = timezone.now().strftime("%Y%m%d")
            last = PurchaseOrder.objects.filter(PO_ID__startswith=f"PO-{today}").order_by('-PO_ID').first()
            num = 1
            if last:
                try:
                    num = int(last.PO_ID.split('-')[-1]) + 1
                except:
                    pass
            self.PO_ID = f"PO-{today}-{num:03d}"

        super().save(*args, **kwargs)

    def calculate_summary(self):
        subtotal = sum(
            (item.total for item in self.items.all()),
            Decimal('0.00')
        )

        discount_rate = (self.global_discount or Decimal('0.00')) / Decimal('100')
        discount_amount = subtotal * discount_rate
        after_discount = subtotal - discount_amount

        tax_summary = sum(
            (item.tax_amount for item in self.items.all()),
            Decimal('0.00')
        )

        shipping = self.shipping_charges or Decimal('0.00')
        rounding = self.rounding_adjustment or Decimal('0.00')

        self.subtotal = subtotal
        self.tax_summary = tax_summary
        self.total_order_value = after_discount + tax_summary + shipping + rounding

                
        PurchaseOrder.objects.filter(id=self.id).update(
        subtotal=subtotal,
        tax_summary=tax_summary,
        total_order_value=after_discount + tax_summary + shipping + rounding
    )


    def __str__(self):
        return self.PO_ID


class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True)
    uom = models.CharField(max_length=50, blank=True)
    in_stock = models.IntegerField(default=0, editable=False)
    qty_ordered = models.IntegerField(default=1)
    insufficient_stock = models.IntegerField(default=0, editable=False)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
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

        discount_rate = Decimal(self.discount_rate or 0) / Decimal('100')
        discount_amount = subtotal * discount_rate
        after_discount = subtotal - discount_amount

        tax_rate = Decimal(self.tax_rate or 0) / Decimal('100')
        self.tax_amount = after_discount * tax_rate

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



class StockReceipt(models.Model):
    GRN_ID = models.CharField(max_length=20, unique=True, editable=False)
    po_reference = models.ForeignKey(
        'purchase.PurchaseOrder',
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

    # NEW: audit fields 
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_stock_receipts')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_stock_receipts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.GRN_ID:
            today = timezone.now().strftime("%Y%m%d")
            last = StockReceipt.objects.filter(GRN_ID__startswith=f"GRN-{today}").order_by('-GRN_ID').first()
            num = 1
            if last:
                try:
                    num = int(last.GRN_ID.split('-')[-1]) + 1
                except:
                    pass
            self.GRN_ID = f"GRN-{today}-{num:04d}"

        # Auto-fill supplier from PO if not set
        if self.po_reference and not self.supplier:
            self.supplier = self.po_reference.supplier

        super().save(*args, **kwargs)

    def __str__(self):
        return self.GRN_ID


# StockReceiptItem 
class StockReceiptItem(models.Model):
    stock_receipt = models.ForeignKey(StockReceipt, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True, editable=False)
    uom = models.CharField(max_length=50, blank=True, editable=False)
    qty_ordered = models.IntegerField(default=0, editable=False)  # auto from PO
    qty_received = models.IntegerField(default=0)
    accepted_qty = models.IntegerField(default=0)
    rejected_qty = models.IntegerField(default=0, editable=False)
    qty_returned = models.IntegerField(default=0, editable=False)
    stock_dim = models.CharField(max_length=20, choices=[('None', 'None'), ('Serial', 'Serial'), ('Batch', 'Batch')], default='None')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.product:
            self.product_name = self.product.name
            self.uom = self.product.uom.name if self.product.uom else ""

        # NEW: Auto-fill qty_ordered from PO if linked and not set
        if not self.qty_ordered and self.stock_receipt.po_reference:
            po_item = self.stock_receipt.po_reference.items.filter(product=self.product).first()
            if po_item:
                self.qty_ordered = po_item.qty_ordered

        # Rejected qty auto-calc
        self.rejected_qty = max(0, self.qty_received - self.accepted_qty)

        # Total calculation
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





class StockReturn(models.Model):
    SRN_ID = models.CharField(max_length=20, unique=True, editable=False)
    po_reference = models.ForeignKey('PurchaseOrder', on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_returns')
    grn_reference = models.ForeignKey('StockReceipt', on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_returns')
    received_date = models.DateField(blank=True, null=True)
    return_date = models.DateField(default=timezone.now)
    return_initiated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='initiated_returns')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('Draft', 'Draft'), ('Submitted', 'Submitted'), ('Partially Returned', 'Partially Returned'), ('Cancelled', 'Cancelled')],
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
            last = StockReturn.objects.filter(SRN_ID__startswith=f"SRN-{today}").order_by('-SRN_ID').first()
            num = 1
            if last:
                try:
                    num = int(last.SRN_ID.split('-')[-1]) + 1
                except:
                    pass
            self.SRN_ID = f"SRN-{today}-{num:04d}"

        # Auto-fill supplier
        if self.grn_reference:
            self.supplier = self.grn_reference.supplier
        elif self.po_reference:
            self.supplier = self.po_reference.supplier

        # IMPORTANT: NO recalculation here — no self.save() call
        # Recalculation must be called EXPLICITLY after items are handled
        super().save(*args, **kwargs)

    def __str__(self):
        return self.SRN_ID
    
    def recalculate_totals(self):
        """
        Call this EXPLICITLY after saving/updating items.
        Uses direct DB update to avoid recursion.
        """
        from decimal import Decimal, ROUND_HALF_UP

        # Get fresh totals from DB
        subtotal = Decimal('0.00')
        for item in self.items.all():
            subtotal += item.total

        discount_amount = subtotal * (self.global_discount / Decimal('100'))
        total_before_round = subtotal - discount_amount
        rounded = total_before_round.quantize(Decimal('1'), rounding=ROUND_HALF_UP)

        # Direct update — NO save() recursion
        StockReturn.objects.filter(pk=self.pk).update(
            return_subtotal=subtotal,
            global_discount_amount=discount_amount,
            rounding_adjustment=rounded - total_before_round,
            amount_to_recover=rounded
        )

        # Refresh object in memory
        self.refresh_from_db()



from decimal import Decimal
from django.db import models

class StockReturnItem(models.Model):
    stock_return = models.ForeignKey(
        StockReturn,
        on_delete=models.CASCADE,
        related_name='items'
    )

    stock_receipt_item = models.ForeignKey(
        'StockReceiptItem',
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

    # For normal serial items
    serial = models.ForeignKey(
        'SerialNumber',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    # For batch serial items
    batch_serial = models.ForeignKey(
        'BatchSerialNumber',
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