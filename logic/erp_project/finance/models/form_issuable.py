
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator

class Department(models.Model):
    """Add/Edit Department"""
    dept_code = models.CharField(max_length=20, unique=True, help_text="e.g., DEP-005")
    dept_name = models.CharField(max_length=100, help_text="e.g., Quality Control")
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.dept_code} - {self.dept_name}"


class RequestedBy(models.Model):
    """Requester details"""
    employee_id = models.CharField(max_length=50, unique=True)
    employee_name = models.CharField(max_length=200)

    DESIGNATION_CHOICES = [
        ('SUPERVISOR', 'Supervisor'),
        ('ENGINEER', 'Engineer'),
        ('STORE_IN_CHARGE', 'Store In-Charge'),
    ]
    designation = models.CharField(max_length=100, choices=DESIGNATION_CHOICES)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='requesters')

    def __str__(self):
        return f"{self.employee_name} ({self.employee_id})"


class ApprovedBy(models.Model):
    """Approver details"""
    employee_id = models.CharField(max_length=50, unique=True)
    employee_name = models.CharField(max_length=200)

    ROLE_CHOICES = [
        ('MANAGER', 'Manager'),
        ('CONTROLLER', 'Controller'),
        ('PRODUCTION_HEAD', 'Production Head'),
    ]
    role_authority_level = models.CharField(max_length=100, choices=ROLE_CHOICES)

    LEVEL_CHOICES = [('L1', 'L1'), ('L2', 'L2'), ('L3', 'L3')]
    approval_level = models.CharField(max_length=10, choices=LEVEL_CHOICES)

    def __str__(self):
        return f"{self.employee_name} - {self.approval_level}"


class WarehouseDet(models.Model):
    """Warehouse Details"""
    warehouse_code = models.CharField(max_length=50, unique=True)
    warehouse_name = models.CharField(max_length=200)
    location = models.CharField(max_length=255)
    capacity = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    current_stock = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    supervisor = models.CharField(max_length=200)
    remarks = models.TextField(blank=True, null=True)
    is_admin_only = models.BooleanField(default=True)

    def __str__(self):
        return self.warehouse_code


class BatchNo(models.Model):
    """Batch Details"""
    batch_no = models.CharField(max_length=50, unique=True)
    item_code = models.CharField(max_length=50)
    item_name = models.CharField(max_length=255)
    available_qty = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    expiry_date = models.DateField(null=True, blank=True)
    warehouse = models.ForeignKey(WarehouseDet, on_delete=models.PROTECT)
    supervisor = models.CharField(max_length=200, blank=True)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.batch_no


class FormIssuable(models.Model):
    """Main Form Issuable"""
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Posted', 'Posted to Inventory'),
        ('Cancelled', 'Cancelled'),
    ]

    formissue_no = models.CharField(max_length=20, unique=True, editable=False)
    date = models.DateField(default=timezone.now)
    job_order_no = models.CharField(max_length=50)

    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    requested_by = models.ForeignKey(RequestedBy, on_delete=models.PROTECT)
    approved_by = models.ForeignKey(ApprovedBy, on_delete=models.SET_NULL, null=True, blank=True)

    remarks = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    generated_on = models.DateTimeField(auto_now_add=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.formissue_no:
            year = timezone.now().year
            last = FormIssuable.objects.filter(formissue_no__startswith=f"FI {year}").order_by('-id').first()
            num = 1
            if last and last.formissue_no:
                try:
                    num = int(last.formissue_no.split(' ')[-1]) + 1
                except (ValueError, IndexError):
                    num = 1
            self.formissue_no = f"FI {year} {num:03d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.formissue_no

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Form Issuable"
        verbose_name_plural = "Form Issuables"


class FormIssuableItem(models.Model):
    """Line Items"""
    form_issuable = models.ForeignKey(FormIssuable, on_delete=models.CASCADE, related_name='items')
    item_code = models.CharField(max_length=50)
    item_name = models.CharField(max_length=255)
    uom = models.CharField(max_length=20)

    required_qty = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    issued_qty = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    available_stock = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])

    batch = models.ForeignKey(BatchNo, on_delete=models.PROTECT)
    warehouse = models.ForeignKey(WarehouseDet, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.item_code} - {self.item_name}"


class FormIssuableAttachment(models.Model):
    """Attachments"""
    form_issuable = models.ForeignKey(FormIssuable, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='form_issuable/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class FormIssuableComment(models.Model):
    """Comments"""
    form_issuable = models.ForeignKey(FormIssuable, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class FormIssuableHistory(models.Model):
    """History / Status Changes"""
    EVENT_CHOICES = [
        ('Created', 'Created'),
        ('Updated', 'Updated'),
        ('Approved', 'Approved'),
        ('Cancelled', 'Cancelled'),
        ('Posted', 'Posted'),
    ]
    form_issuable = models.ForeignKey(FormIssuable, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100, choices=EVENT_CHOICES)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)