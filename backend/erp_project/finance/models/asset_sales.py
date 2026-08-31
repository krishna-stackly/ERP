from django.db import models
from django.utils import timezone
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal

from masters.models import (
    Branch,
    Department,
    Product,
    Warehouse
)


# =========================================================
# ASSET SALE
# =========================================================

class AssetSale(models.Model):

    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Posted', 'Posted'),
        ('Rejected', 'Rejected'),
        ('Cancelled', 'Cancelled'),
    ]

    ASSET_CONDITION_CHOICES = [
        ('Good', 'Good'),
        ('Fair', 'Fair'),
        ('Poor', 'Poor'),
    ]

    MODE_OF_SALE_CHOICES = [
        ('Cash', 'Cash'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Credit', 'Credit'),
    ]

    REASON_FOR_SALE_CHOICES = [
        ('Obsolete', 'Obsolete'),
        ('Upgrade', 'Upgrade'),
        ('Policy', 'Policy'),
    ]

    asset_sale_no = models.CharField(
        max_length=30,
        unique=True,
        editable=False
    )

    date = models.DateField(
        default=timezone.now
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='asset_sale_requested_by'
    )

    asset_id = models.CharField(
        max_length=100
    )

    asset_name = models.CharField(
        max_length=255
    )

    original_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    accumulated_depreciation = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    net_book_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    asset_condition = models.CharField(
        max_length=20,
        choices=ASSET_CONDITION_CHOICES
    )

    buyer_name = models.CharField(
        max_length=255
    )

    sale_date = models.DateField()

    sale_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    mode_of_sale = models.CharField(
        max_length=30,
        choices=MODE_OF_SALE_CHOICES
    )

    invoice_no = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    gain_loss_on_sale = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    reason_for_sale = models.CharField(
        max_length=50,
        choices=REASON_FOR_SALE_CHOICES
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='asset_sale_approved_by'
    )

    remarks = models.TextField(
        blank=True
    )

    generated_on = models.DateTimeField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='asset_sale_created_by'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='asset_sale_updated_by'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):

        if not self.asset_sale_no:

            last = AssetSale.objects.order_by('-id').first()

            num = 1

            if last and last.asset_sale_no:
                try:
                    num = int(
                        last.asset_sale_no.replace('AS-', '')
                    ) + 1
                except:
                    num = 1

            self.asset_sale_no = f"AS-{num:04d}"

        self.net_book_value = (
            Decimal(self.original_cost)
            - Decimal(self.accumulated_depreciation)
        )

        self.gain_loss_on_sale = (
            Decimal(self.sale_value)
            - Decimal(self.net_book_value)
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.asset_sale_no


# =========================================================
# BUYER MASTER
# =========================================================

class AssetSaleBuyer(models.Model):

    BUYER_TYPE_CHOICES = [
        ('Company', 'Company'),
        ('Individual', 'Individual'),
    ]

    buyer_type = models.CharField(
        max_length=30,
        choices=BUYER_TYPE_CHOICES
    )

    buyer_name = models.CharField(
        max_length=255
    )

    contact_person = models.CharField(
        max_length=255
    )

    gst_no = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    pan_no = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    address = models.TextField()

    email = models.EmailField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['buyer_name']

    def __str__(self):
        return self.buyer_name


# =========================================================
# APPROVER
# =========================================================

class AssetSaleApprover(models.Model):

    APPROVER_ROLE_CHOICES = [
        ('Manager', 'Manager'),
        ('Auditor', 'Auditor'),
        ('Director', 'Director'),
        ('CFO', 'CFO'),
    ]

    APPROVAL_LEVEL_CHOICES = [
        ('Level 1', 'Level 1'),
        ('Level 2', 'Level 2'),
        ('Level 3', 'Level 3'),
        ('Level 4', 'Level 4'),
    ]

    employee_id = models.CharField(
        max_length=50
    )

    approver_role = models.CharField(
        max_length=30,
        choices=APPROVER_ROLE_CHOICES
    )

    approver_name = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    role = models.CharField(
        max_length=100
    )

    approval_level = models.CharField(
        max_length=30,
        choices=APPROVAL_LEVEL_CHOICES
    )

    

    def __str__(self):
        return str(self.approver_name)


# =========================================================
# LINE ITEMS
# =========================================================

class AssetSaleItem(models.Model):

    ASSET_CONDITION_CHOICES = [
        ('Good', 'Good'),
        ('Fair', 'Fair'),
        ('Poor', 'Poor'),
    ]

    MODE_OF_SALE_CHOICES = [
        ('Cash', 'Cash'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Credit', 'Credit'),
    ]

    asset_sale = models.ForeignKey(
        AssetSale,
        on_delete=models.CASCADE,
        related_name='items'
    )

    asset_id = models.CharField(
        max_length=100
    )

    asset_name = models.CharField(
        max_length=255
    )

    original_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    accumulated_depreciation = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    nbv = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    asset_condition = models.CharField(
        max_length=20,
        choices=ASSET_CONDITION_CHOICES
    )

    sale_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0.00
    )

    mode_of_sale = models.CharField(
        max_length=30,
        choices=MODE_OF_SALE_CHOICES
    )

    

    def save(self, *args, **kwargs):

        self.nbv = (
            Decimal(self.original_cost)
            - Decimal(self.accumulated_depreciation)
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.asset_name


# =========================================================
# ATTACHMENTS
# =========================================================

class AssetSaleAttachment(models.Model):

    asset_sale = models.ForeignKey(
        AssetSale,
        on_delete=models.CASCADE,
        related_name='attachments'
    )

    file = models.FileField(
        upload_to='asset_sales/attachments/%Y/%m/%d/'
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    


# =========================================================
# COMMENTS
# =========================================================

class AssetSaleComment(models.Model):

    asset_sale = models.ForeignKey(
        AssetSale,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    comment = models.TextField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    timestamp = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-timestamp']


# =========================================================
# HISTORY
# =========================================================

class AssetSaleHistory(models.Model):

    asset_sale = models.ForeignKey(
        AssetSale,
        on_delete=models.CASCADE,
        related_name='history'
    )

    event_type = models.CharField(
        max_length=255
    )

    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    details = models.TextField(
        blank=True
    )

    timestamp = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-timestamp']