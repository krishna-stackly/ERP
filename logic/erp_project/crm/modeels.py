from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class Enquiry(models.Model):
    enquiry_id = models.CharField(max_length=10, unique=True, editable=False)  # ENQ001
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enquiries')
    
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
    enquiry_type = models.CharField(max_length=50, choices=[('Product', 'Product'), ('Service', 'Service'), ('Both', 'Both')])
    enquiry_description = models.TextField(blank=True)
    
    # Channel & Source (with sub-options)
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
        choices=[('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')],
        blank=True
    )
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_enquiries')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_enquiries')

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
    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name='items')
    item_code = models.CharField(max_length=50, blank=True)
    product_description = models.CharField(max_length=500)
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    quantity = models.PositiveIntegerField(default=1)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, editable=False)  # auto-calculated

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.item_code or 'Item'} - {self.product_description[:50]}"

    def save(self, *args, **kwargs):
        self.total_amount = self.selling_price * self.quantity
        super().save(*args, **kwargs)



# crm/models.py

from django.db import models

from masters.models import Product, UOM, Customer, TaxCode
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.db.models import Sum, F
from decimal import Decimal, ROUND_HALF_UP




class Quotation(models.Model):
    quotation_id = models.CharField(max_length=10, unique=True, editable=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_quotations')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_quotations')

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='quotations')
    customer_po_reference = models.CharField(max_length=100, blank=True, null=True)

    sales_rep = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sales_rep_quotations',
        limit_choices_to={'role__role': 'Sales Representative'},
    )

    quotation_type = models.CharField(
        max_length=50,
        choices=[('Standard', 'Standard'), ('Blanket', 'Blanket'), ('Service', 'Service')],
        default='Standard',
    )

    quotation_date = models.DateField(default=timezone.now)
    expiry_date = models.DateField(blank=True, null=True)

    currency = models.CharField(
        max_length=3,
        choices=[('INR', 'INR'), ('USD', 'USD'), ('EUR', 'EUR'), ('GBP', 'GBP'), ('SGD', 'SGD')],
        default='INR',
    )

    payment_terms = models.CharField(max_length=50, blank=True)
    expected_delivery = models.DateField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ('Draft', 'Draft'),
            ('Submitted', 'Submitted'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
            ('Converted to SO', 'Converted to SO'),
            ('Expired', 'Expired')
        ],
        default='Draft',
    )

    revise_count = models.PositiveIntegerField(default=0)
    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    rounding_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"), editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.quotation_id:
            last = Quotation.objects.order_by('-id').first()
            num = 1
            if last and last.quotation_id:
                try:
                    num = int(last.quotation_id.replace('QUO', '')) + 1
                except:
                    pass
            self.quotation_id = f"QUO{num:04d}"

        if self.expiry_date and self.expiry_date < timezone.now().date():
            if self.status not in ['Expired', 'Rejected', 'Converted to SO']:
                self.status = 'Expired'

        super().save(*args, **kwargs)

    @property
    def subtotal(self):
        return self.items.aggregate(subtotal=Sum('total'))['subtotal'] or Decimal("0.00")

    @property
    def tax_summary(self):
        return self.items.aggregate(
            tax=Sum(F('total') * F('tax_rate') / Decimal("100"))
        )['tax'] or Decimal("0.00")

    @property
    def grand_total(self):
        subtotal = self.subtotal
        discount_rate = self.global_discount or Decimal("0.00")
        shipping = self.shipping_charges or Decimal("0.00")
        tax = self.tax_summary

        discount = subtotal * (discount_rate / Decimal("100"))
        total = subtotal - discount + tax + shipping

        rounded_total = total.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        self.rounding_adjustment = rounded_total - total

        return (total + self.rounding_adjustment).quantize(Decimal("0.01"))

    def __str__(self):
        return self.quotation_id


class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    product_name = models.CharField(max_length=200, editable=False)
    product_id_display = models.CharField(max_length=20, editable=False)

    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    tax = models.ForeignKey(TaxCode, on_delete=models.SET_NULL, null=True, blank=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"), editable=False)
    quantity = models.PositiveIntegerField(default=1)
    total = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.product_name = self.product.name
        self.product_id_display = self.product.product_id
        self.tax_rate = self.tax.percentage if self.tax else Decimal("0.00")

        qty = Decimal(str(self.quantity))
        subtotal = qty * self.unit_price

        discount_amount = subtotal * (self.discount / Decimal("100"))
        after_discount = subtotal - discount_amount

        tax_amount = after_discount * (self.tax_rate / Decimal("100"))
        self.total = after_discount + tax_amount

        super().save(*args, **kwargs)

    def __str__(self):
        return self.product_name



class QuotationAttachment(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='quotations/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.quotation.quotation_id}"


class QuotationComment(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='comments')
    comment_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.comment_by} on {self.quotation.quotation_id}"


class QuotationHistory(models.Model):
    EVENT_TYPES = (
        ('status_change', 'Status Change'),
        ('pdf_generated', 'PDF Generated'),
        ('email_sent', 'Email Sent'),
    )

    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='status_change')
    status = models.CharField(max_length=20, blank=True, null=True)  # only for status_change
    extra_info = models.CharField(max_length=255, blank=True, null=True)  # e.g. "sent to customer@example.com"
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.event_type} for {self.quotation.quotation_id}"


class QuotationRevision(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='revisions')
    revision_no = models.PositiveIntegerField()
    revision_date = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    comment = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='Submitted')

    class Meta:
        ordering = ['-revision_no']

    def __str__(self):
        return f"Revision {self.revision_no} for {self.quotation.quotation_id}"




    

from django.db import models
from django.utils import timezone
from masters.models import Customer, Product, Branch
from purchase.models import SerialNumber,BatchSerialNumber



# models.py

from django.db import models
from django.utils import timezone

from django.db.models import Sum, F, DecimalField as DJDecimalField
from decimal import Decimal, ROUND_HALF_UP

from masters.models import Customer, Product, UOM, TaxCode



class SalesOrder(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Ready to Submit', 'Ready to Submit'),
        ('Submitted', 'Submitted'),
        ('Submitted(PD)', 'Submitted(PD)'),
        ('Partially Delivered', 'Partially Delivered'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    ORDER_TYPE_CHOICES = [
        ('Standard', 'Standard'),
        ('Rush', 'Rush'),
        ('Backorder', 'Backorder'),
    ]

    sales_order_id = models.CharField(max_length=10, unique=True, editable=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_sales_orders')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_sales_orders')

    order_date = models.DateField(default=timezone.now)
    sales_rep = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sales_rep_orders',
        limit_choices_to={'role__role': 'Sales Representative'},
    )
    order_type = models.CharField(max_length=50, choices=ORDER_TYPE_CHOICES, default='Standard')

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sales_orders')

    payment_method = models.CharField(max_length=50, blank=True)
    currency = models.CharField(
        max_length=3,
        choices=[('INR', 'INR'), ('USD', 'USD'), ('EUR', 'EUR'), ('GBP', 'GBP'), ('SGD', 'SGD')],
        default='INR',
    )
    due_date = models.DateField(blank=True, null=True)
    terms_conditions = models.TextField(blank=True)

    shipping_method = models.CharField(max_length=50, blank=True)
    expected_delivery = models.DateField(blank=True, null=True)
    tracking_number = models.CharField(max_length=50, blank=True)

    internal_notes = models.TextField(blank=True)
    customer_notes = models.TextField(blank=True)

    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    rounding_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"), editable=False)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.sales_order_id:
            last = SalesOrder.objects.order_by('-id').first()
            num = 1
            if last and last.sales_order_id:
                try:
                    num = int(last.sales_order_id.replace('SO-', '')) + 1
                except:
                    pass
            self.sales_order_id = f"SO-{num:04d}"

        super().save(*args, **kwargs)

    @property
    def subtotal(self):
        return self.items.aggregate(subtotal=Sum('total', output_field=DJDecimalField()))['subtotal'] or Decimal("0.00")

    @property
    def tax_summary(self):
        return self.items.aggregate(
            tax=Sum(F('total') * F('tax_rate') / Decimal("100"), output_field=DJDecimalField())
        )['tax'] or Decimal("0.00")

    @property
    def grand_total(self):
        subtotal = self.subtotal
        discount_rate = self.global_discount or Decimal("0.00")
        shipping = self.shipping_charges or Decimal("0.00")
        tax = self.tax_summary

        discount = subtotal * (discount_rate / Decimal("100"))
        total = subtotal - discount + tax + shipping

        rounded_total = total.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        self.rounding_adjustment = rounded_total - total

        return (total + self.rounding_adjustment).quantize(Decimal("0.01"))

    def __str__(self):
        return self.sales_order_id


class SalesOrderItem(models.Model):
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    product_name = models.CharField(max_length=200, editable=False)
    product_id_display = models.CharField(max_length=20, editable=False)

    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    tax = models.ForeignKey(TaxCode, on_delete=models.SET_NULL, null=True, blank=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"), editable=False)
    quantity = models.PositiveIntegerField(default=1)
    total = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.product_name = self.product.name
        self.product_id_display = self.product.product_id
        self.tax_rate = self.tax.percentage if self.tax else Decimal("0.00")

        qty = Decimal(str(self.quantity))
        unit_price = Decimal(str(self.unit_price))
        discount = Decimal(str(self.discount))
        tax_rate = Decimal(str(self.tax_rate))

        subtotal = qty * unit_price

        discount_amount = subtotal * (discount / Decimal("100"))
        after_discount = subtotal - discount_amount

        tax_amount = after_discount * (tax_rate / Decimal("100"))
        self.total = after_discount + tax_amount

        super().save(*args, **kwargs)


class SalesOrderComment(models.Model):
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='comments')
    comment_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.comment_by} on {self.sales_order.sales_order_id}"


class SalesOrderHistory(models.Model):
    EVENT_TYPES = (
        ('status_change', 'Status Change'),
        ('pdf_generated', 'PDF Generated'),
        ('email_sent', 'Email Sent'),
        ('po_generated', 'PO Generated'),
        ('delivery_note_generated', 'Delivery Note Generated'),
    )

    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES, default='status_change')
    status = models.CharField(max_length=20, blank=True, null=True)  # only for status_change
    extra_info = models.CharField(max_length=255, blank=True, null=True)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.event_type} for {self.sales_order.sales_order_id}"



from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.conf import settings
from masters.models import Customer, Product, UOM
from purchase.models import SerialNumber  # Reuse from purchase


class DeliveryNote(models.Model):
    DELIVERY_TYPE_CHOICES = [
        ('Regular', 'Regular'),
        ('Urgent', 'Urgent'),
        ('Return', 'Return'),
    ]

    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Partially Delivered', 'Partially Delivered'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    dn_id = models.CharField(max_length=20, unique=True, editable=False)
    sales_order = models.ForeignKey('crm.SalesOrder', on_delete=models.SET_NULL, null=True, blank=True, related_name='delivery_notes')
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    delivery_date = models.DateField(default=timezone.now)
    delivery_type = models.CharField(max_length=20, choices=DELIVERY_TYPE_CHOICES, default='Regular')
    destination_address = models.TextField(blank=True)

    # Delivery Logistics
    delivered_by = models.CharField(max_length=100, blank=True)
    delivery_status = models.CharField(max_length=30, default='Draft')
    vehicle_no = models.CharField(max_length=50, blank=True)
    tracking_id = models.CharField(max_length=100, blank=True)
    delivery_notes = models.TextField(blank=True)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Draft')

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_delivery_notes')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_delivery_notes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.dn_id:
            last = DeliveryNote.objects.order_by('-id').first()
            num = 1
            if last and last.dn_id:
                try:
                    num = int(last.dn_id.replace('DN-', '')) + 1
                except:
                    pass
            self.dn_id = f"DN-{num:04d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.dn_id


class DeliveryNoteItem(models.Model):
    delivery_note = models.ForeignKey(DeliveryNote, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255, blank=True, editable=False)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        if self.product:
            self.product_name = self.product.name
        super().save(*args, **kwargs)


class DeliveryNoteSerial(models.Model):
    """Exact same pattern as SerialNumberReturn in Stock Return"""
    delivery_note_item = models.ForeignKey(DeliveryNoteItem, on_delete=models.CASCADE, related_name='serial_numbers')

    # For normal serial items
    serial = models.ForeignKey(
        'purchase.SerialNumber',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    # For batch serial items
    batch_serial = models.ForeignKey(
        'purchase.BatchSerialNumber',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    def __str__(self):
        if self.serial:
            return self.serial.serial_no
        elif self.batch_serial:
            return self.batch_serial.serial_no
        return "No Serial"


class DeliveryNoteCustomerAcknowledgement(models.Model):
    delivery_note = models.OneToOneField(DeliveryNote, on_delete=models.CASCADE, related_name='acknowledgement')
    received_by = models.CharField(max_length=100, blank=True)
    contact_number = models.CharField(max_length=20, blank=True)
    proof_of_delivery = models.FileField(upload_to='delivery_proof/%Y/%m/%d/', blank=True, null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)


class DeliveryNoteAttachment(models.Model):
    delivery_note = models.ForeignKey(DeliveryNote, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='delivery_notes/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class DeliveryNoteComment(models.Model):
    delivery_note = models.ForeignKey(DeliveryNote, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class DeliveryNoteHistory(models.Model):
    delivery_note = models.ForeignKey(DeliveryNote, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)



from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.conf import settings
from masters.models import Customer, Product, UOM, TaxCode
from crm.models import SalesOrder  # adjust if in different app





class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Sent', 'Sent'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_TERMS_CHOICES = [
        ('Net 15', 'Net 15'),
        ('Net 30', 'Net 30'),
        ('Net 45', 'Net 45'),
        ('Due on Receipt', 'Due on Receipt'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('Credit Card', 'Credit Card'),
        ('Bank Transfer', 'Bank Transfer'),
        ('COD', 'COD'),
        ('PayPal', 'PayPal'),
    ]

    CURRENCY_CHOICES = [
        ('INR', 'INR'),
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('GBP', 'GBP'),
        ('SGD', 'SGD'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Partial', 'Partial'),
        ('Unpaid', 'Unpaid'),
    ]

    invoice_id = models.CharField(max_length=20,unique=True,editable=False,blank=True,null=True)
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.SET_NULL, null=True, blank=True)
    invoice_date = models.DateField(default=timezone.now)
    invoice_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    due_date = models.DateField(blank=True, null=True)

    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    customer_ref_no = models.CharField(max_length=50, blank=True)
    invoice_tags = models.CharField(max_length=255, blank=True)  # comma-separated: "Monthly,Urgent"
    terms_conditions = models.TextField(blank=True)
    payment_terms = models.CharField(max_length=20, choices=PAYMENT_TERMS_CHOICES, default='Net 30')
    
    billing_address = models.TextField(blank=True)
    shipping_address = models.TextField(blank=True)
    email_id = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    contact_person = models.CharField(max_length=100, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='INR')
    payment_ref_number = models.CharField(max_length=50, blank=True)
    transaction_date = models.DateField(blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Unpaid')
    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_invoices')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_invoices')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def save(self, *args, **kwargs):
        if not self.invoice_id:
            last_invoice = Invoice.objects.order_by('-id').first()
            next_number = 1

            if last_invoice and last_invoice.invoice_id:
                try:
                    next_number = int(last_invoice.invoice_id.replace('INV-', '')) + 1
                except:
                    next_number = 1

            self.invoice_id = f"INV-{next_number:05d}"

        super().save(*args, **kwargs)

    @property
    def grand_total(self):
        subtotal = sum(item.total for item in self.items.all()) or Decimal('0.00')
        discount_amount = subtotal * (self.global_discount or Decimal('0.00')) / Decimal('100')
        tax_amount = sum(item.total * item.tax_rate / Decimal('100') for item in self.items.all()) or Decimal('0.00')
        shipping = self.shipping_charges or Decimal('0.00')
        return subtotal - discount_amount + tax_amount + shipping

    @property
    def balance_due(self):
        return self.grand_total - (self.amount_paid or Decimal('0.00'))
    
    def __str__(self):
        return self.invoice_id


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True, editable=False)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    returned_qty_cus = models.PositiveIntegerField(default=0, verbose_name="Returned Qty (Customer)")
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_code = models.ForeignKey(TaxCode, on_delete=models.SET_NULL, null=True, blank=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.product:
            self.product_name = self.product.name
            self.unit_price = self.product.unit_price or Decimal('0.00')
            self.uom = self.product.uom

        # ✅ If tax selected from dropdown
        if self.tax_code:
            self.tax_rate = self.tax_code.percentage or Decimal('0.00')

        subtotal = Decimal(self.quantity) * Decimal(self.unit_price)
        discount = subtotal * (Decimal(self.discount_rate) / Decimal('100'))
        after_discount = subtotal - discount
        tax = after_discount * (Decimal(self.tax_rate) / Decimal('100'))

        self.total = after_discount + tax

        super().save(*args, **kwargs)


class InvoiceAttachment(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='invoices/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class InvoiceComment(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class InvoiceHistory(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)





from masters.models import Customer, Product, UOM
from purchase.models import SerialNumber
from .models import Invoice, SalesOrder
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.conf import settings
from masters.models import Customer, Product, UOM, TaxCode
from crm.models import Invoice, InvoiceItem  # adjust app name if needed


class InvoiceReturn(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Cancelled', 'Cancelled'),
    ]

    invoice_return_id = models.CharField(max_length=20, unique=True, editable=False)  # auto-generated in save()
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='returns')
    invoice_return_date = models.DateField(default=timezone.now)
    customer_ref_no = models.CharField(max_length=50, blank=True)

    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    email_id = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    contact_person = models.CharField(max_length=100, blank=True)

    global_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, blank=True)
    rounding_adjustment = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_invoice_returns')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_invoice_returns')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.invoice_return_id:
            last = InvoiceReturn.objects.order_by('-id').first()
            num = 1
            if last and last.invoice_return_id:
                try:
                    num = int(last.invoice_return_id.replace('INVR-', '')) + 1
                except ValueError:
                    num = 1
            self.invoice_return_id = f"INVR-{num:05d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.invoice_return_id


class InvoiceReturnItem(models.Model):
    invoice_return = models.ForeignKey(InvoiceReturn, on_delete=models.CASCADE, related_name='items')
    invoice_item = models.ForeignKey(InvoiceItem, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True, editable=False)
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, blank=True)
    invoiced_qty = models.PositiveIntegerField(default=0, editable=False)
    returned_qty_cus = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    return_reason = models.TextField(blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.invoice_item:
            self.product = self.invoice_item.product
            self.product_name = self.invoice_item.product_name
            self.uom = self.invoice_item.uom
            self.invoiced_qty = self.invoice_item.quantity
            self.unit_price = self.invoice_item.unit_price
            self.tax_rate = self.invoice_item.tax_rate
            self.discount_rate = self.invoice_item.discount_rate

        if self.returned_qty_cus > self.invoiced_qty:
            raise ValueError("Returned qty cannot exceed invoiced qty")

        subtotal = Decimal(self.returned_qty_cus) * Decimal(self.unit_price)
        discount = subtotal * (Decimal(self.discount_rate) / Decimal('100'))
        after_discount = subtotal - discount
        tax = after_discount * (Decimal(self.tax_rate) / Decimal('100'))
        self.total = after_discount + tax

        super().save(*args, **kwargs)


class InvoiceReturnSerial(models.Model):
    invoice_return_item = models.ForeignKey(
        InvoiceReturnItem,
        on_delete=models.CASCADE,
        related_name='serial_numbers'
    )

    serial = models.ForeignKey(
        SerialNumber,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    batch_serial = models.ForeignKey(
        BatchSerialNumber,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['invoice_return_item', 'serial'],
                name='unique_invoice_return_serial'
            ),
            models.UniqueConstraint(
                fields=['invoice_return_item', 'batch_serial'],
                name='unique_invoice_return_batch_serial'
            )
        ]

    def __str__(self):
        if self.serial:
            return self.serial.serial_no
        if self.batch_serial:
            return self.batch_serial.serial_no
        return "No Serial"


class InvoiceReturnAttachment(models.Model):
    invoice_return = models.ForeignKey(InvoiceReturn, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='invoice_returns/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class InvoiceReturnComment(models.Model):
    invoice_return = models.ForeignKey(InvoiceReturn, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class InvoiceReturnHistory(models.Model):
    invoice_return = models.ForeignKey(InvoiceReturn, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)




from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.conf import settings
from masters.models import Customer, Product, UOM
from .models import InvoiceReturn, InvoiceReturnItem  

class DeliveryNoteReturn(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Approved', 'Approved'),
        ('Cancelled', 'Cancelled'),
    ]

    dnr_id = models.CharField(max_length=20, unique=True, editable=False)  # auto-generated in save()
    invoice_return = models.ForeignKey(InvoiceReturn, on_delete=models.SET_NULL, null=True, blank=True, related_name='dn_returns')
    dnr_date = models.DateField(default=timezone.now)
    customer_ref_no = models.CharField(max_length=50, blank=True)

    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    email_id = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    contact_person = models.CharField(max_length=100, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_dnr')
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='updated_dnr')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.dnr_id:
            last = DeliveryNoteReturn.objects.order_by('-id').first()
            num = 1
            if last and last.dnr_id:
                try:
                    num = int(last.dnr_id.replace('DNR-', '')) + 1
                except ValueError:
                    num = 1
            self.dnr_id = f"DNR-{num:05d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.dnr_id


class DeliveryNoteReturnItem(models.Model):
    delivery_note_return = models.ForeignKey(DeliveryNoteReturn, on_delete=models.CASCADE, related_name='items')
    invoice_return_item = models.ForeignKey(InvoiceReturnItem, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True, editable=False)
    uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, null=True, blank=True)
    invoiced_qty = models.PositiveIntegerField(default=0, editable=False)
    returned_qty_cus = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    return_reason = models.TextField(blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, editable=False)

    def save(self, *args, **kwargs):
        if self.invoice_return_item:
            self.product = self.invoice_return_item.product
            self.product_name = self.invoice_return_item.product_name
            self.uom = self.invoice_return_item.uom
            self.invoiced_qty = self.invoice_return_item.invoiced_qty
            self.unit_price = self.invoice_return_item.unit_price
            self.tax_rate = self.invoice_return_item.tax_rate
            self.discount_rate = self.invoice_return_item.discount_rate

        subtotal = Decimal(self.returned_qty_cus) * Decimal(self.unit_price)
        discount = subtotal * (Decimal(self.discount_rate) / Decimal('100'))
        after_discount = subtotal - discount
        tax = after_discount * (Decimal(self.tax_rate) / Decimal('100'))
        self.total = after_discount + tax

        super().save(*args, **kwargs)


class DeliveryNoteReturnSerial(models.Model):
    delivery_note_return_item = models.ForeignKey(DeliveryNoteReturnItem, on_delete=models.CASCADE, related_name='serial_numbers')
    serial_no = models.CharField(max_length=100)

    class Meta:
        unique_together = ['delivery_note_return_item', 'serial_no']  # prevent duplicates in same item

    def __str__(self):
        return self.serial_no


class DeliveryNoteReturnAttachment(models.Model):
    delivery_note_return = models.ForeignKey(DeliveryNoteReturn, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='dn_returns/attachments/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)


class DeliveryNoteReturnComment(models.Model):
    delivery_note_return = models.ForeignKey(DeliveryNoteReturn, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class DeliveryNoteReturnHistory(models.Model):
    delivery_note_return = models.ForeignKey(DeliveryNoteReturn, on_delete=models.CASCADE, related_name='history')
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)