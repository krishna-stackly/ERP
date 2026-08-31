from django.db import models



# MAIN REPORT

class FinancialReport(models.Model):
    REPORT_TYPE_CHOICES = [
        ('INCOME', 'Income Statement'),
        ('BALANCE', 'Balance Sheet'),
        ('CASHFLOW', 'Cash Flow'),
    ]

    LEVEL_CHOICES = [
        ('SUMMARY', 'Summary'),
        ('DETAILED', 'Detailed'),

    ]
    STATUS_CHOICES = [    

        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("posted", "Posted"),
        ("cancelled", "Cancelled"),
    ]
    

    report_id = models.CharField(max_length=50, unique=True)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)

    reporting_currency = models.CharField(max_length=10)

    from_date = models.DateField()
    to_date = models.DateField()

    level_of_detail = models.CharField(max_length=10, choices=LEVEL_CHOICES)
    comparison_period = models.CharField(max_length=50, null=True, blank=True)

    remarks = models.TextField(null=True, blank=True)
    generated_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Draft'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.report_id



# REPORT DATA (TYPE BASED)

class FinancialReportData(models.Model):
    report = models.OneToOneField(FinancialReport, on_delete=models.CASCADE, related_name="data")

    # Income Statement
    revenue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    operating_expenses = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    net_profit = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # Balance Sheet
    assets = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    liabilities = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    equity = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # Cash Flow
    cash_from_operations = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    cash_from_investing = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    cash_from_financing = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    net_cash_flow = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)



# LINE ITEMS

class FinancialLineItem(models.Model):
    report = models.ForeignKey(FinancialReport, on_delete=models.CASCADE, related_name="line_items")

    item_code = models.CharField(max_length=20)
    description = models.CharField(max_length=255)

    amount = models.DecimalField(max_digits=15, decimal_places=2)
    comparison_amount = models.DecimalField(max_digits=15, decimal_places=2)
    variance = models.DecimalField(max_digits=15, decimal_places=2)

    ledger_posting = models.CharField(max_length=100)

    def __str__(self):
        return self.item_code



# ATTACHMENTS

class FinancialReportAttachment(models.Model):
    report = models.ForeignKey(FinancialReport, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="attachments/")
    uploaded_by = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)



# COMMENTS

class FinancialReportComment(models.Model):
    report = models.ForeignKey(FinancialReport, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField()
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)



# HISTORY

class FinancialReportHistory(models.Model):
    report = models.ForeignKey(FinancialReport, on_delete=models.CASCADE, related_name="history")
    action = models.CharField(max_length=100)
    performed_by = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
