from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class Enquiry(models.Model):
    enquiry_id = models.CharField(max_length=10, unique=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enquiries'
    )

    # Customer Info
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)

    # Address
    street_address = models.CharField(max_length=200, blank=True)
    apartment = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True, default="India")

    # Enquiry Details
    enquiry_type = models.CharField(
        max_length=50,
        choices=[
            ('Product', 'Product'),
            ('Service', 'Service'),
            ('Both', 'Both')
        ]
    )

    enquiry_description = models.TextField(blank=True)

    enquiry_channel = models.CharField(
        max_length=50,
        choices=[
            ('Phone', 'Phone'),
            ('Email', 'Email'),
            ('Web Form', 'Web Form'),
            ('Social Media', 'Social Media'),
            ('Other', 'Other')
        ],
        blank=True
    )

    social_media_platform = models.CharField(
        max_length=50,
        choices=[
            ('Facebook', 'Facebook'),
            ('Twitter', 'Twitter'),
            ('Instagram', 'Instagram'),
            ('LinkedIn', 'LinkedIn'),
            ('WhatsApp', 'WhatsApp')
        ],
        blank=True,
        null=True
    )

    source = models.CharField(
        max_length=50,
        choices=[
            ('Website', 'Website'),
            ('Referral', 'Referral'),
            ('Online Advertising', 'Online Advertising'),
            ('Offline Advertising', 'Offline Advertising'),
            ('Social Media', 'Social Media'),
            ('Event', 'Event'),
            ('Search Engine', 'Search Engine'),
            ('Other', 'Other')
        ],
        blank=True
    )

    source_social_media = models.CharField(
        max_length=50,
        choices=[
            ('Facebook', 'Facebook'),
            ('Twitter', 'Twitter'),
            ('Instagram', 'Instagram'),
            ('LinkedIn', 'LinkedIn'),
            ('WhatsApp', 'WhatsApp')
        ],
        blank=True,
        null=True
    )

    how_heard = models.CharField(
        max_length=50,
        choices=[
            ('Website', 'Website'),
            ('Referral', 'Referral'),
            ('Social Media', 'Social Media'),
            ('Event', 'Event'),
            ('Search Engine', 'Search Engine'),
            ('Other', 'Other')
        ],
        blank=True
    )

    urgency_level = models.CharField(
        max_length=50,
        choices=[
            ('Immediately', 'Immediately'),
            ('Within 1-3 Months', 'Within 1-3 Months'),
            ('Within 6 Months', 'Within 6 Months'),
            ('Just Researching', 'Just Researching')
        ],
        blank=True
    )

    enquiry_status = models.CharField(
        max_length=20,
        choices=[
            ('New', 'New'),
            ('In Progress', 'In Progress'),
            ('Converted', 'Converted'),
            ('Lost', 'Lost'),
            ('Closed', 'Closed')
        ],
        default='New'
    )

    priority = models.CharField(
        max_length=20,
        choices=[
            ('High', 'High'),
            ('Medium', 'Medium'),
            ('Low', 'Low')
        ],
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_enquiries'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_enquiries'
    )

    class Meta:
        ordering = ['enquiry_id']
        verbose_name_plural = "Enquiries"

    def __str__(self):
        return f"{self.enquiry_id} - {self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        if not self.enquiry_id:
            last = Enquiry.objects.order_by('-id').first()
            num = 1

            if last and last.enquiry_id:
                try:
                    num = int(last.enquiry_id.replace('ENQ', '')) + 1
                except:
                    pass

            self.enquiry_id = f"ENQ{num:04d}"

        super().save(*args, **kwargs)


class EnquiryItem(models.Model):
    enquiry = models.ForeignKey(
        Enquiry,
        on_delete=models.CASCADE,
        related_name='items'
    )

    item_code = models.CharField(max_length=50, blank=True)
    product_description = models.CharField(max_length=500)

    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )

    selling_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )

    quantity = models.PositiveIntegerField(default=1)

    total_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        editable=False
    )

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.item_code or 'Item'} - {self.product_description[:50]}"

    def save(self, *args, **kwargs):
        self.total_amount = self.selling_price * self.quantity
        super().save(*args, **kwargs)
