from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator


class ContraVoucher(models.Model):

    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Posted', 'Posted'),
        ('Cancelled', 'Cancelled'),
    ]

    TRANSACTION_TYPES = [
        ("Cash to Bank", "Cash to Bank"),
        ("Bank to Cash", "Bank to Cash"),
        ("Bank to Bank", "Bank to Bank"),
    ]

    contra_id = models.CharField(
        max_length=50,
        unique=True,
        editable=False,
        default=""
    )

    voucher_date = models.DateField(default=timezone.now)
    posting_date = models.DateField(null=True, blank=True)
    reference_no = models.CharField(max_length=50, blank=True, null=True)

    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES
    )

    prepared_by = models.CharField(max_length=100)
    approved_by = models.CharField(max_length=100)

    narration = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    generated_on = models.DateTimeField(auto_now_add=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='contra_created',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='contra_updated',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.contra_id:
            year = timezone.now().year
            last = ContraVoucher.objects.filter(
                contra_id__startswith=f"CV-{year}"
            ).order_by('-id').first()

            next_no = 1
            if last:
                try:
                    next_no = int(last.contra_id.split('-')[-1]) + 1
                except:
                    next_no = 1

            self.contra_id = f"CV-{year}-{next_no:04d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.contra_id


class Requester(models.Model):
    employee_id = models.CharField(max_length=50, unique=True)
    employee_name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    approval_level = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.employee_name


class Approver(models.Model):
    employee_id = models.CharField(max_length=50, unique=True)
    employee_name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    approval_level = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.employee_name


class Preparer(models.Model):
    employee_id = models.CharField(max_length=50, unique=True)
    employee_name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.employee_name


class ContraVoucherLineItem(models.Model):
    voucher = models.ForeignKey(
        ContraVoucher,
        on_delete=models.CASCADE,
        related_name="line_items"
    )

    account_ledger = models.CharField(max_length=100)
    debit_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    instrument_no = models.CharField(max_length=50, blank=True, null=True)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.account_ledger


class ContraVoucherAttachment(models.Model):
    voucher = models.ForeignKey(
        ContraVoucher,
        on_delete=models.CASCADE,
        related_name="attachments"
    )

    file = models.FileField(upload_to="contra_voucher_attachments/")
    description = models.CharField(max_length=255, blank=True, default="")

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name


class ContraVoucherComment(models.Model):
    voucher = models.ForeignKey(
        ContraVoucher,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    comment = models.TextField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment[:50]


class ContraVoucherHistory(models.Model):
    voucher = models.ForeignKey(
        ContraVoucher,
        on_delete=models.CASCADE,
        related_name="history"
    )

    event_type = models.CharField(max_length=50)

    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    details = models.TextField(blank=True, default="")

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} - {self.timestamp}"