from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator

from masters.models import Customer, Product, UOM
from purchase.models import SerialNumber, BatchSerialNumber


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

    dn_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )

    sales_order = models.ForeignKey(
        'crm.SalesOrder',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='delivery_notes'
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    delivery_date = models.DateField(default=timezone.now)

    delivery_type = models.CharField(
        max_length=20,
        choices=DELIVERY_TYPE_CHOICES,
        default='Regular'
    )

    destination_address = models.TextField(blank=True)

    # Logistics
    delivered_by = models.CharField(max_length=100, blank=True)
    delivery_status = models.CharField(max_length=30, default='Draft')
    vehicle_no = models.CharField(max_length=50, blank=True)
    tracking_id = models.CharField(max_length=100, blank=True)
    delivery_notes = models.TextField(blank=True)

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='Draft'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_delivery_notes'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_delivery_notes'
    )

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
    delivery_note = models.ForeignKey(
        DeliveryNote,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True
    )

    product_name = models.CharField(
        max_length=255,
        blank=True,
        editable=False
    )

    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )

    uom = models.ForeignKey(
        UOM,
        on_delete=models.SET_NULL,
        null=True
    )

    def save(self, *args, **kwargs):
        if self.product:
            self.product_name = self.product.name

        super().save(*args, **kwargs)


class DeliveryNoteSerial(models.Model):
    delivery_note_item = models.ForeignKey(
        DeliveryNoteItem,
        on_delete=models.CASCADE,
        related_name='serial_numbers'
    )

    # Normal serial item
    serial = models.ForeignKey(
        SerialNumber,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    # Batch serial item
    batch_serial = models.ForeignKey(
        BatchSerialNumber,
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
    delivery_note = models.OneToOneField(
        DeliveryNote,
        on_delete=models.CASCADE,
        related_name='acknowledgement'
    )

    received_by = models.CharField(max_length=100, blank=True)
    contact_number = models.CharField(max_length=20, blank=True)

    proof_of_delivery = models.FileField(
        upload_to='delivery_proof/%Y/%m/%d/',
        blank=True,
        null=True
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )


class DeliveryNoteAttachment(models.Model):
    delivery_note = models.ForeignKey(
        DeliveryNote,
        on_delete=models.CASCADE,
        related_name='attachments'
    )

    file = models.FileField(
        upload_to='delivery_notes/attachments/%Y/%m/%d/'
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    description = models.CharField(
        max_length=255,
        blank=True
    )


class DeliveryNoteComment(models.Model):
    delivery_note = models.ForeignKey(
        DeliveryNote,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    comment = models.TextField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)


class DeliveryNoteHistory(models.Model):
    delivery_note = models.ForeignKey(
        DeliveryNote,
        on_delete=models.CASCADE,
        related_name='history'
    )

    event_type = models.CharField(max_length=100)

    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    details = models.TextField(blank=True)

    timestamp = models.DateTimeField(auto_now_add=True)
