from django.db import models
from django.conf import settings
from django.db.models import UniqueConstraint, Index
from django.core.validators import MinValueValidator, MaxValueValidator


class CountryChoices(models.TextChoices):
    INDIA = 'IN', 'India'
    USA = 'US', 'United States'
    CANADA = 'CA', 'Canada'
    UNITED_KINGDOM = 'GB', 'United Kingdom'
    AUSTRALIA = 'AU', 'Australia'
    GERMANY = 'DE', 'Germany'
    FRANCE = 'FR', 'France'
    SINGAPORE = 'SG', 'Singapore'
    UAE = 'AE', 'United Arab Emirates'
    CHINA = 'CN', 'China'
    JAPAN = 'JP', 'Japan'


SUPPLIER_TYPE_CHOICES = [
    ('Manufacturer', 'Manufacturer'),
    ('Distributor', 'Distributor'),
    ('Service Provider', 'Service Provider'),
    ('Trader', 'Trader'),
    ('Wholesaler', 'Wholesaler'),
    ('Importer', 'Importer'),
    ('Other', 'Other'),
    ('Custom', 'Custom'),
]

STATUS_CHOICES = [
    ('Active', 'Active'),
    ('Inactive', 'Inactive'),
    ('Blacklisted', 'Blacklisted'),
    ('Pending', 'Pending')
]

WORKFLOW_STATUS_CHOICES = [
    ('Draft', 'Draft'),
    ('Submitted', 'Submitted'),
]

TIER_CHOICES = [
    ('Strategic', 'Strategic'),
    ('Preferred', 'Preferred'),
    ('Backup', 'Backup')
]

PAYMENT_METHOD_CHOICES = [
    ('Wire Transfer', 'Wire Transfer'),
    ('ACH', 'ACH'),
    ('Check', 'Check'),
    ('Credit Card', 'Credit Card'),
    ('UPI', 'UPI')
]

PAYMENT_TERMS_CHOICES = [
    ('Net 15', 'Net 15'),
    ('Net 30', 'Net 30'),
    ('Net 45', 'Net 45'),
    ('Net 60', 'Net 60'),
    ('Prepaid', 'Prepaid'),
    ('COD', 'COD'),
    ('Custom', 'Custom'),
]

CURRENCY_CHOICES = [
    ('INR', 'Indian Rupee'),
    ('USD', 'US Dollar'),
    ('EUR', 'Euro'),
    ('GBP', 'British Pound'),
    ('SGD', 'Singapore Dollar')
]

RISK_RATING_CHOICES = [
    ('Low', 'Low'),
    ('Medium', 'Medium'),
    ('High', 'High')
]


class Supplier(models.Model):
    supplier_id = models.CharField(
        max_length=15,
        unique=True,
        editable=False,
        blank=True
    )

    tax_id = models.CharField(
        max_length=30,
        unique=True,
        verbose_name="Tax ID / GSTIN / VAT"
    )

    supplier_name = models.CharField(max_length=200)
    company_registration_number = models.CharField(max_length=50, blank=True, null=True)
    legal_entity_name = models.CharField(max_length=200)

    country_of_registration = models.CharField(
        max_length=3,
        choices=CountryChoices.choices,
        default=CountryChoices.INDIA
    )

    supplier_type = models.CharField(
        max_length=30,
        choices=SUPPLIER_TYPE_CHOICES,
        blank=True,
        null=True
    )

    is_custom_supplier_type = models.BooleanField(default=False)
    custom_supplier_type = models.CharField(max_length=100, blank=True, null=True)

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='Active'
    )

    workflow_status = models.CharField(
        max_length=15,
        choices=WORKFLOW_STATUS_CHOICES,
        default='Draft'
    )

    supplier_tier = models.CharField(
        max_length=20,
        choices=TIER_CHOICES,
        blank=True,
        null=True
    )

    product_details = models.TextField(blank=True, default='')

    primary_contact_first_name = models.CharField(max_length=100)
    primary_contact_last_name = models.CharField(max_length=100, blank=True, default='')
    primary_contact_designation = models.CharField(max_length=100, blank=True, default='')
    primary_contact_email = models.EmailField()
    primary_contact_phone = models.CharField(max_length=20)

    alternate_contact_number = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    relationship_manager = models.CharField(max_length=100, blank=True, null=True)

    registered_address = models.TextField()
    mailing_address = models.TextField(blank=True, null=True)
    warehouse_address = models.TextField(blank=True, null=True)
    billing_address = models.TextField(blank=True, null=True)

    region = models.CharField(
        max_length=3,
        choices=CountryChoices.choices,
        default=CountryChoices.INDIA
    )

    bank_name = models.CharField(max_length=150, blank=True, default='')
    bank_account_no = models.CharField(max_length=50, default='')
    iban_swift = models.CharField(max_length=50, blank=True, null=True)

    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        blank=True,
        null=True
    )

    payment_terms = models.CharField(
        max_length=20,
        choices=PAYMENT_TERMS_CHOICES,
        blank=True,
        null=True
    )

    is_custom_payment_terms = models.BooleanField(default=False)
    custom_payment_terms = models.CharField(max_length=100, blank=True, null=True)

    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default='INR'
    )

    tax_withholding_setup = models.CharField(max_length=100, blank=True, null=True)

    categories_served = models.TextField(default='')
    incoterms = models.CharField(max_length=10, blank=True, null=True)
    product_catalog = models.TextField(blank=True, default='')
    freight_terms = models.CharField(max_length=100, blank=True, null=True)

    min_order_quantity = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1)]
    )

    return_replacement_policy = models.TextField(blank=True, default='')
    avg_lead_time_days = models.PositiveIntegerField(
        default=30,
        validators=[MinValueValidator(1)]
    )

    contract_references = models.TextField(blank=True, default='')

    certifications = models.TextField(blank=True, null=True)
    compliance_status = models.CharField(max_length=100, blank=True, null=True)

    insurance_documents = models.FileField(
        upload_to='suppliers/insurance/',
        blank=True,
        null=True
    )

    mitigation_plans = models.FileField(
        upload_to='suppliers/mitigation/',
        blank=True,
        null=True
    )

    risk_rating = models.CharField(
        max_length=10,
        choices=RISK_RATING_CHOICES,
        default='Low'
    )

    risk_notes = models.TextField(blank=True, null=True)
    last_risk_assessment = models.DateField(null=True, blank=True)

    on_time_delivery_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    quality_rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )

    defect_return_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    last_evaluation_date = models.DateField(null=True, blank=True)
    contract_breaches = models.TextField(blank=True, default='')
    improvement_plans = models.TextField(blank=True, default='')
    complaints_registered = models.TextField(blank=True, default='')

    external_key_contact = models.CharField(max_length=100, blank=True, null=True)

    interaction_logs = models.FileField(
        upload_to='suppliers/interaction_logs/',
        blank=True,
        null=True
    )

    dispute_resolutions = models.FileField(
        upload_to='suppliers/dispute/',
        blank=True,
        null=True
    )

    feedback_surveys = models.FileField(
        upload_to='suppliers/feedback/',
        blank=True,
        null=True
    )

    visit_mom_history = models.FileField(
        upload_to='suppliers/mom/',
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_suppliers'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_suppliers'
    )

    class Meta:
        verbose_name_plural = "Suppliers"
        ordering = ['supplier_id']
        indexes = [
            Index(fields=['supplier_id', 'status', 'tax_id']),
            Index(fields=['supplier_name'])
        ]
        constraints = [
            UniqueConstraint(fields=['tax_id'], name='unique_supplier_tax_id')
        ]

    def save(self, *args, **kwargs):
        if not self.supplier_id:
            last = Supplier.objects.order_by('-id').first()
            num = 1

            if last and last.supplier_id and '-' in last.supplier_id:
                try:
                    num = int(last.supplier_id.split('-')[1]) + 1
                except:
                    pass

            self.supplier_id = f"SUP-{num:04d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.supplier_id} - {self.supplier_name}"


class SupplierComment(models.Model):
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    comment = models.TextField()

    commented_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)


class SupplierAttachment(models.Model):
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name='extra_attachments'
    )

    file = models.FileField(
        upload_to='suppliers/extra_attachments/%Y/%m/%d/'
    )

    description = models.CharField(max_length=300, blank=True, null=True)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']


class SupplierHistory(models.Model):
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name='history'
    )

    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    changed_at = models.DateTimeField(auto_now_add=True)

    changes = models.TextField()

    class Meta:
        ordering = ['-changed_at']
