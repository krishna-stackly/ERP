

from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal
import uuid
from masters.models import Branch


class CashFlow(models.Model):

    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Posted', 'Posted'),
        ('Cancelled', 'Cancelled'),
    ]

    CURRENCY_CHOICES = [
        ('INR', 'INR'),
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('GBP', 'GBP'),
    ]

    # BASIC INFO
    voucher_no = models.CharField(max_length=20, unique=True, editable=False)
    date = models.DateField(default=timezone.now)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True)
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    # PERIOD
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    # SUMMARY
    opening_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    cash_from_operations = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    cash_from_investing = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    cash_from_financing = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    net_increase_decrease = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    closing_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # -------------------------
    # VOUCHER GENERATOR
    # -------------------------
    def generate_voucher(self):
        return f"CF-{uuid.uuid4().hex[:8].upper()}"

    
    # CALCULATE TOTALS
    
    def calculate_totals(self):
        items = self.line_items.all()
        operating = sum((Decimal(i.credit or 0) - Decimal(i.debit or 0))
                        for i in items if i.category == 'Operating')

        investing = sum((Decimal(i.credit or 0) - Decimal(i.debit or 0))
                        for i in items if i.category == 'Investing')

        financing = sum((Decimal(i.credit or 0) - Decimal(i.debit or 0))
                        for i in items if i.category == 'Financing')

        self.cash_from_operations = operating
        self.cash_from_investing = investing
        self.cash_from_financing = financing

        self.net_increase_decrease = operating + investing + financing
        self.closing_balance = self.opening_balance + self.net_increase_decrease

    # -------------------------
    # SAVE (FINAL CLEAN FLOW)
    # -------------------------
    def save(self, *args, **kwargs):
        

        if not self.voucher_no:
            self.voucher_no = self.generate_voucher()

        super().save(*args, **kwargs)

         #Recalculate after save
        self.calculate_totals()

    # Save again with updated totals
        super().save(update_fields=[
           'cash_from_operations',
           'cash_from_investing',
           'cash_from_financing',
           'net_increase_decrease',
           'closing_balance'
    ])
        

    def __str__(self):
        return self.voucher_no
       

# Cash flow line items
class CashFlowLineItem(models.Model):

    CATEGORY_CHOICES = [
        ('Operating', 'Operating'),
        ('Investing', 'Investing'),
        ('Financing', 'Financing'),
    ]

    cash_flow = models.ForeignKey(
        CashFlow,
        on_delete=models.CASCADE,
        related_name='line_items'
    )

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=255)

    debit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    reference = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateField(default=timezone.now)
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.cash_flow:
           cf = self.cash_flow
           cf.calculate_totals()
           CashFlow.objects.filter(id=cf.id).update(
             cash_from_operations=cf.cash_from_operations,
             cash_from_investing=cf.cash_from_investing,
             cash_from_financing=cf.cash_from_financing,
             net_increase_decrease=cf.net_increase_decrease,
             closing_balance=cf.closing_balance
           )

    def __str__(self):
        return f"{self.category} - {self.description}"


#ATTACHMENTS
class CashFlowAttachment(models.Model):
    cash_flow = models.ForeignKey(
        CashFlow,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file = models.FileField(upload_to='cashflow/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


# COMMENTS
class CashFlowComment(models.Model):
    cash_flow = models.ForeignKey(
        CashFlow,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    


#HISTORY
class CashFlowHistory(models.Model):
    cash_flow = models.ForeignKey(
        CashFlow,
        on_delete=models.CASCADE,
        related_name='history'
    )
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
