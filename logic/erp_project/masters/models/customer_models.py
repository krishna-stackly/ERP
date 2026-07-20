from django.db import models
from django.conf import settings
from django.db.models import UniqueConstraint, Index
from django.core.validators import MinValueValidator


class Customer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)

    customer_type = models.CharField(
        max_length=50,
        choices=[
            ('Individual', 'Individual'),
            ('Business', 'Business'),
            ('Organization', 'Organization')
        ]
    )

    customer_id = models.CharField(
        max_length=10,
        unique=True,
        null=True,
        blank=True,
        editable=False
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ('Active', 'Active'),
            ('Inactive', 'Inactive')
        ],
        default='Active'
    )

    assigned_sales_rep = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_customers',
        limit_choices_to={'role__role': 'Sales Representative'}
    )

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)

    address = models.TextField(blank=True, null=True)
    street = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    company_name = models.CharField(max_length=100, blank=True, null=True)

    INDUSTRY_CHOICES = [
        ('Manufacturing', 'Manufacturing'),
        ('Technology', 'Technology'),
        ('Retail', 'Retail'),
        ('Healthcare', 'Healthcare'),
        ('Finance', 'Finance'),
        ('Education', 'Education'),
        ('Construction', 'Construction'),
        ('Transportation', 'Transportation'),
        ('Hospitality', 'Hospitality'),
        ('Energy', 'Energy'),
        ('Media & Comms', 'Media & Comms'),
    ]

    industry = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        choices=INDUSTRY_CHOICES
    )

    location = models.CharField(max_length=100, blank=True, null=True)
    gst_tax_id = models.CharField(max_length=20, blank=True, null=True)

    credit_limit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )

    available_limit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        blank=True,
        null=True
    )

    billing_address = models.TextField(blank=True, null=True)
    shipping_address = models.TextField(blank=True, null=True)

    payment_terms = models.CharField(max_length=50, blank=True, null=True)
    credit_term = models.CharField(max_length=50, blank=True, null=True)

    last_edit_date = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_customers'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_customers'
    )

    class Meta:
        verbose_name = "Customer"
        verbose_name_plural = "Customers"
        ordering = ['customer_id']
        indexes = [
            Index(fields=['email', 'status', 'is_active']),
            Index(fields=['customer_id'])
        ]
        constraints = [
            UniqueConstraint(fields=['email'], name='unique_customer_email')
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.customer_id or 'N/A'})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if is_new and not self.customer_id:
            last_customer = Customer.objects.order_by('-id').first()

            if last_customer and last_customer.customer_id:
                last_id = int(last_customer.customer_id.replace('CUST-', '')) + 1
            else:
                last_id = 1

            self.customer_id = f'CUST-{last_id:04d}'

        if self.available_limit is None or self.available_limit == 0:
            self.available_limit = self.credit_limit

        super().save(*args, **kwargs)
