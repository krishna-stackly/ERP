from django.db import models
from django.conf import settings
from django.utils import timezone


# JOURNAL VOUCHER APPROVER

class JournalVoucherApprover(models.Model):

    ROLE_CHOICES = [
        ('Finance Manager',   'Finance Manager'),
        ('Accounts Head',     'Accounts Head'),
        ('Senior Accountant', 'Senior Accountant'),
        ('CFO',               'CFO'),
        ('Admin',             'Admin'),
    ]

    DEPARTMENT_CHOICES = [
        ('Finance',  'Finance'),
        ('Accounts', 'Accounts'),
        ('Audit',    'Audit'),
        ('HR',       'HR'),
    ]

    STATUS_CHOICES = [
        ('Active',   'Active'),
        ('Inactive', 'Inactive'),
    ]

    # user = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name='jv_approver_profiles'
    #)
    user_id   = models.IntegerField(null=True, blank=True)
    user_name  = models.CharField(max_length=255)
    role       = models.CharField(max_length=50,  choices=ROLE_CHOICES)
    department = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES)
    email      = models.EmailField(max_length=255)
    status     = models.CharField(max_length=20,  choices=STATUS_CHOICES, default='Active')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user_name} - {self.role}"


# JOURNAL VOUCHER  (Main Model)

class JournalVoucher(models.Model):

    STATUS_CHOICES = [
        ('Draft',     'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved',  'Approved'),
        ('Cancelled', 'Cancelled'),
    ]

    JOURNAL_TYPE_CHOICES = [
        ('Regular',      'Regular'),
        ('Adjustment',   'Adjustment'),
        ('Opening',      'Opening'),
        ('Closing',      'Closing'),
        ('Depreciation', 'Depreciation'),
        ('Transfer',     'Transfer'),
        ('Accrual',      'Accrual'),
        ('Reversal',     'Reversal'),
        ('Other',        'Other'),
    ]

    # CORE IDENTIFIERS

    journal_voucher_no = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )
    voucher_date  = models.DateField()
    posting_date  = models.DateField(null=True, blank=True)
    reference_no  = models.CharField(max_length=50, null=True, blank=True)
    narration     = models.TextField()
    prepared_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='prepared_journal_vouchers'
    )

    approved_by = models.ForeignKey(
        JournalVoucherApprover,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_journal_vouchers'
    )
    
    journal_type  = models.CharField(max_length=20, choices=JOURNAL_TYPE_CHOICES)


    # STATUS

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    # AUDIT FIELDS

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_journal_vouchers'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_journal_vouchers'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-voucher_date"]

    def __str__(self):
        return self.journal_voucher_no or "JV-Pending"

    # VOUCHER NUMBER AUTO GENERATION

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if not self.journal_voucher_no:
            year = timezone.now().year
            last = JournalVoucher.objects.filter(
                journal_voucher_no__startswith=f"JV-{year}"
            ).order_by('-id').first()

            num = 1
            if last and last.journal_voucher_no:
                try:
                    num = int(last.journal_voucher_no.split('-')[-1]) + 1
                except (ValueError, IndexError):
                    num = 1

            self.journal_voucher_no = f"JV-{year}-{num:03d}"
            super().save(update_fields=["journal_voucher_no"])


# LINE ITEMS

class JournalVoucherItem(models.Model):

    journal_voucher = models.ForeignKey(
        JournalVoucher,
        on_delete=models.CASCADE,
        related_name='items'
    )
    account_ledger = models.CharField(max_length=50)
    debit          = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit         = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cost_center    = models.CharField(max_length=255, null=True, blank=True)
    narration      = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.account_ledger} | Dr: {self.debit} | Cr: {self.credit}"


# ATTACHMENTS

class JournalVoucherAttachment(models.Model):

    journal_voucher = models.ForeignKey(
        JournalVoucher,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file        = models.FileField(upload_to='journal_voucher/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='jv_attachments'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Attachment for {self.journal_voucher.journal_voucher_no}"


# COMMENTS

class JournalVoucherComment(models.Model):

    journal_voucher = models.ForeignKey(
        JournalVoucher,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    comment    = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='jv_comments'
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.created_by} on {self.journal_voucher.journal_voucher_no}"


# HISTORY

class JournalVoucherHistory(models.Model):

    journal_voucher = models.ForeignKey(
        JournalVoucher,
        on_delete=models.CASCADE,
        related_name='history'
    )
    event_type  = models.CharField(max_length=100)
    action_by   = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='jv_history'
    )
    details   = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} by {self.action_by} on {self.journal_voucher.journal_voucher_no}"