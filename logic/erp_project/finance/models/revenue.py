
from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal


class Revenue(models.Model):

    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Posted', 'Posted'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Partial', 'Partial'),
        ('Unpaid', 'Unpaid'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('Cheque', 'Cheque'),
        ('NEFT', 'NEFT'),
        ('UPI', 'UPI'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Cash', 'Cash'),
    ]

    TAX_TYPE_CHOICES = [
        ('GST', 'GST'),
        ('VAT', 'VAT'),
        ('TDS', 'TDS'),
    ]

    LEDGER_CHOICES = [
        ('Sales Ledger', 'Sales Ledger'),
        ('Service Income Ledger', 'Service Income Ledger'),
        ('Rental Income Ledger', 'Rental Income Ledger'),
        ('Miscellaneous Income Ledger', 'Miscellaneous Income Ledger'),
        ('Other Operating Income Ledger', 'Other Operating Income Ledger'),
    ]

    REVENUE_TYPE_CHOICES = [
        ('Product Sales', 'Product Sales'),
        ('Service Income', 'Service Income'),
        ('Rental Income', 'Rental Income'),
    ]

    revenue_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )

    revenue_type = models.CharField(
        max_length=50,
        choices=REVENUE_TYPE_CHOICES
    )

    customer = models.ForeignKey(
        'masters.Customer',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    invoice = models.ForeignKey(
        'crm.Invoice',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    sales_order = models.ForeignKey(
        'crm.SalesOrder',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    branch = models.ForeignKey(
        'masters.Branch',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    revenue_date = models.DateField()

    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00')
    )

    tax_type = models.CharField(
        max_length=20,
        choices=TAX_TYPE_CHOICES,
        default='GST'
    )

    gst_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00')
    )

    payment_received = models.BooleanField(default=False)

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        blank=True,
        null=True
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='Unpaid'
    )

    ledger_posting = models.CharField(
        max_length=50,
        choices=LEDGER_CHOICES,
        blank=True,
        null=True
    )

    remarks = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_revenues'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_revenues'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        if not self.revenue_id:

            last = Revenue.objects.order_by('-id').first()

            number = 1

            if last and last.revenue_id:
                try:
                    number = int(
                        last.revenue_id.replace('RV-', '')
                    ) + 1
                except ValueError:
                    number = 1

            self.revenue_id = f"RV-{number:06d}"

        super().save(*args, **kwargs)

    def update_totals(self):

        total = sum(
            (
                item.amount + item.tax_amount
                for item in self.line_items.all()
            ),
            Decimal('0.00')
        )

        self.amount = total

        self.save(update_fields=['amount'])

    def gst_split_summary(self):

        gst_items = self.line_items.filter(tax_type='GST')

        total_tax = sum(
            (item.tax_amount for item in gst_items),
            Decimal('0.00')
        )

        net_revenue = self.amount - total_tax

        if (
            self.customer and
            self.branch and
            hasattr(self.customer, 'state') and
            hasattr(self.branch, 'state') and
            self.customer.state == self.branch.state
        ):

            half = total_tax / 2

            return {
                'transaction_type': 'Intra-state',
                'cgst': half,
                'sgst': half,
                'net_revenue': net_revenue
            }

        return {
            'transaction_type': 'Inter-state',
            'igst': total_tax,
            'net_revenue': net_revenue
        }

    def vat_summary(self):

        vat_items = self.line_items.filter(tax_type='VAT')

        total_tax = sum(
            (item.tax_amount for item in vat_items),
            Decimal('0.00')
        )

        net_revenue = self.amount - total_tax

        return {
            'vat_rate': (
                vat_items.first().tax_rate
                if vat_items.exists()
                else None
            ),
            'vat_amount': total_tax,
            'net_revenue': net_revenue
        }

    def tds_summary(self):

        tds_items = self.line_items.filter(tax_type='TDS')

        total_tax = sum(
            (item.tax_amount for item in tds_items),
            Decimal('0.00')
        )

        net_revenue = self.amount - total_tax

        return {
            'tds_rate': (
                tds_items.first().tax_rate
                if tds_items.exists()
                else None
            ),
            'tds_amount': total_tax,
            'net_revenue': net_revenue
        }

    def __str__(self):
        return self.revenue_id


class RevenueLineItem(models.Model):

    revenue = models.ForeignKey(
        Revenue,
        on_delete=models.CASCADE,
        related_name='line_items'
    )

    product = models.ForeignKey(
        'masters.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    item_code = models.CharField(
        max_length=50,
        blank=True
    )

    description = models.CharField(
        max_length=255,
        blank=True
    )

    quantity = models.PositiveIntegerField(default=0)

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )

    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        editable=False
    )

    tax_type = models.CharField(
        max_length=20,
        choices=Revenue.TAX_TYPE_CHOICES,
        default='GST'
    )

    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00')
    )

    tax_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        editable=False
    )

    ledger_posting = models.CharField(
        max_length=50,
        choices=Revenue.LEDGER_CHOICES,
        blank=True,
        null=True
    )

    def save(self, *args, **kwargs):

        self.amount = Decimal(self.quantity) * Decimal(self.unit_price)

        self.tax_amount = (
            self.amount * Decimal(self.tax_rate)
        ) / Decimal('100')

        super().save(*args, **kwargs)

    @property
    def total(self):
        return self.amount + self.tax_amount

    def __str__(self):
        return f"{self.description} - {self.revenue.revenue_id}"


class RevenueAttachment(models.Model):

    revenue = models.ForeignKey(
        Revenue,
        on_delete=models.CASCADE,
        related_name='attachments'
    )

    file = models.FileField(
        upload_to='revenues/attachments/%Y/%m/%d/'
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

    def __str__(self):
        return self.file.name


class RevenueComment(models.Model):

    revenue = models.ForeignKey(
        Revenue,
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

    def __str__(self):
        return f"Comment on {self.revenue.revenue_id}"


class RevenueHistory(models.Model):

    revenue = models.ForeignKey(
        Revenue,
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

    def __str__(self):
        return f"{self.event_type} - {self.revenue.revenue_id}"