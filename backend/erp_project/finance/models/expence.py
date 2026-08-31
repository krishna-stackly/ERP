from django.db import models, transaction
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.conf import settings
 
class ExpenseEntry(models.Model):
    EXPENSE_TYPES = [
        ('Salaries', 'Salaries'),
        ('Rent', 'Rent'),
        ('Travel', 'Travel'),
        ('Office Supplies', 'Office Supplies'),
        ('Miscellaneous', 'Miscellaneous'),
    ]
 
    TAX_COMPONENTS = [
        ('GST', 'GST'),
        ('VAT', 'VAT'),
        ('Service Tax', 'Service Tax'),
        ('Custom Duty', 'Custom Duty'),
    ]
 
    PAYMENT_STATUS = [
        ('Paid', 'Paid'),
        ('Pending', 'Pending'),
    ]
 
    PAYMENT_METHODS = [
        ('Bank', 'Bank'),
        ('Cash', 'Cash'),
        ('Cheque', 'Cheque'),
        ('Online', 'Online'),
    ]
 
    DEPARTMENTS = [
        ('HR', 'HR'),
        ('Admin', 'Admin'),
        ('Production', 'Production'),
        ('Sales', 'Sales'),
        ('Finance', 'Finance'),
    ]
 
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Posted', 'Posted'),
    ]
 
    expense_id = models.CharField(max_length=20, unique=True, editable=False)
    expense_type = models.CharField(max_length=50, choices=EXPENSE_TYPES)
    vendor_name = models.CharField(max_length=255)
    invoice_number = models.CharField(max_length=100, blank=True, null=True)
    expense_date = models.DateField(default=now)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_components = models.CharField(max_length=50, choices=TAX_COMPONENTS)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='Pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    expense_account = models.CharField(max_length=255)
    department = models.CharField(max_length=50, choices=DEPARTMENTS)
    remarks = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True,blank=True)
 
   
    def save(self, *args, **kwargs):
        if not self.expense_id:
            latest = ExpenseEntry.objects.order_by('-id').first()
            next_num = (latest.id + 1) if latest else 1
            self.expense_id = f"EN-{now().year}-{next_num:03d}"
        super().save(*args, **kwargs)
 
    def __str__(self):
        return f"{self.expense_id} - {self.vendor_name}"
 
 
class ExpenseLineItem(models.Model):
    expense = models.ForeignKey(ExpenseEntry, related_name='line_items', on_delete=models.CASCADE)
    item_code = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Enter as percentage")
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    ledger_posting = models.CharField(max_length=255)
 
    def save(self, *args, **kwargs):
        self.amount = Decimal(self.quantity) * self.unit_price
        self.tax_amount = (self.amount * self.tax_rate) / Decimal(100)
        super().save(*args, **kwargs)
 
 
class ExpenseAttachment(models.Model):
    expense = models.ForeignKey(ExpenseEntry, related_name='attachments', on_delete=models.CASCADE)
    file = models.FileField(upload_to='expense_attachments/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    original_filename = models.CharField(max_length=255)
 
 
class ExpenseComment(models.Model):
    expense = models.ForeignKey(ExpenseEntry, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
 
 
class ExpenseStatusHistory(models.Model):
    expense = models.ForeignKey(ExpenseEntry, related_name='status_history', on_delete=models.CASCADE)
    status_message = models.CharField(max_length=255)
    changed_by = models.ForeignKey( settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    changed_at = models.DateTimeField(auto_now_add=True)