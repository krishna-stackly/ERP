# from django.db import models
# from django.conf import settings
# from django.core.validators import (
#     MinValueValidator,
#     MaxValueValidator,
#     RegexValidator
# )
# from django.db.models import Index, UniqueConstraint


# # =========================================================
# # COMMON CHOICES
# # =========================================================

# class CountryChoices(models.TextChoices):
#     INDIA = 'IN', 'India'
#     USA = 'US', 'United States'
#     CANADA = 'CA', 'Canada'
#     UK = 'GB', 'United Kingdom'
#     AUSTRALIA = 'AU', 'Australia'
#     GERMANY = 'DE', 'Germany'
#     FRANCE = 'FR', 'France'
#     SINGAPORE = 'SG', 'Singapore'
#     UAE = 'AE', 'United Arab Emirates'
#     CHINA = 'CN', 'China'
#     JAPAN = 'JP', 'Japan'


# WORKFLOW_STATUS_CHOICES = [
#     ('Draft', 'Draft'),
#     ('Submitted', 'Submitted'),
#     ('Under Review', 'Under Review'),
#     ('Approved', 'Approved'),
#     ('Rejected', 'Rejected'),
#     ('Blacklisted', 'Blacklisted'),
#     ('Inactive', 'Inactive'),
# ]

# SUPPLIER_STATUS_CHOICES = [
#     ('Active', 'Active'),
#     ('Inactive', 'Inactive'),
#     ('Blacklisted', 'Blacklisted'),
# ]

# SUPPLIER_TIER_CHOICES = [
#     ('Strategic', 'Strategic'),
#     ('Preferred', 'Preferred'),
#     ('Backup', 'Backup'),
# ]

# RISK_RATING_CHOICES = [
#     ('Low', 'Low'),
#     ('Medium', 'Medium'),
#     ('High', 'High'),
# ]

# PAYMENT_METHOD_CHOICES = [
#     ('Wire Transfer', 'Wire Transfer'),
#     ('ACH', 'ACH'),
#     ('Check', 'Check'),
#     ('Credit Card', 'Credit Card'),
#     ('UPI', 'UPI'),
#     ('NEFT', 'NEFT'),
#     ('RTGS', 'RTGS'),
# ]

# PAYMENT_TERMS_CHOICES = [
#     ('Net 15', 'Net 15'),
#     ('Net 30', 'Net 30'),
#     ('Net 45', 'Net 45'),
#     ('Net 60', 'Net 60'),
#     ('Prepaid', 'Prepaid'),
#     ('COD', 'COD'),
#     ('Custom', 'Custom'),
# ]

# SUPPLIER_TYPE_CHOICES = [
#     ('Manufacturer', 'Manufacturer'),
#     ('Distributor', 'Distributor'),
#     ('Service Provider', 'Service Provider'),
#     ('Trader', 'Trader'),
#     ('Wholesaler', 'Wholesaler'),
#     ('Importer', 'Importer'),
#     ('Exporter', 'Exporter'),
#     ('Contractor', 'Contractor'),
#     ('Other', 'Other'),
# ]

# CURRENCY_CHOICES = [
#     ('INR', 'Indian Rupee'),
#     ('USD', 'US Dollar'),
#     ('EUR', 'Euro'),
#     ('GBP', 'British Pound'),
#     ('SGD', 'Singapore Dollar'),
# ]

# ADDRESS_TYPE_CHOICES = [
#     ('Registered', 'Registered'),
#     ('Billing', 'Billing'),
#     ('Shipping', 'Shipping'),
#     ('Warehouse', 'Warehouse'),
#     ('Branch', 'Branch'),
# ]

# DOCUMENT_TYPE_CHOICES = [
#     ('GST Certificate', 'GST Certificate'),
#     ('PAN Card', 'PAN Card'),
#     ('MSME Certificate', 'MSME Certificate'),
#     ('ISO Certificate', 'ISO Certificate'),
#     ('Insurance', 'Insurance'),
#     ('Agreement', 'Agreement'),
#     ('NDA', 'NDA'),
#     ('Cancelled Cheque', 'Cancelled Cheque'),
#     ('Bank Proof', 'Bank Proof'),
#     ('Other', 'Other'),
# ]

# CONTACT_TYPE_CHOICES = [
#     ('Primary', 'Primary'),
#     ('Accounts', 'Accounts'),
#     ('Sales', 'Sales'),
#     ('Support', 'Support'),
#     ('Logistics', 'Logistics'),
#     ('Management', 'Management'),
# ]

# ACTIVITY_ACTION_CHOICES = [
#     ('Created', 'Created'),
#     ('Updated', 'Updated'),
#     ('Submitted', 'Submitted'),
#     ('Approved', 'Approved'),
#     ('Rejected', 'Rejected'),
#     ('Blacklisted', 'Blacklisted'),
#     ('Comment Added', 'Comment Added'),
#     ('Document Uploaded', 'Document Uploaded'),
#     ('Status Changed', 'Status Changed'),
# ]

# PRODUCT_STATUS_CHOICES = [
#     ('Active', 'Active'),
#     ('Inactive', 'Inactive'),
# ]


# # =========================================================
# # SUPPLIER MASTER
# # =========================================================

# class Supplier(models.Model):

#     supplier_id = models.CharField(
#         max_length=20,
#         unique=True,
#         editable=False,
#         blank=True
#     )

#     # =====================================================
#     # BASIC INFORMATION
#     # =====================================================

#     supplier_name = models.CharField(max_length=255)

#     legal_entity_name = models.CharField(max_length=255)

#     supplier_type = models.CharField(
#         max_length=50,
#         choices=SUPPLIER_TYPE_CHOICES
#     )

#     tax_id = models.CharField(
#         max_length=50,
#         unique=True,
#         verbose_name="GSTIN / VAT / TAX ID"
#     )

#     workflow_status = models.CharField(
#     max_length=50,
#     choices=WORKFLOW_STATUS_CHOICES,
#     default='Draft'
#     )

#     company_registration_number = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     country_of_registration = models.CharField(
#         max_length=5,
#         choices=CountryChoices.choices,
#         default=CountryChoices.INDIA
#     )

#     supplier_tier = models.CharField(
#         max_length=30,
#         choices=SUPPLIER_TIER_CHOICES,
#         blank=True,
#         null=True
#     )

#     supplier_status = models.CharField(
#         max_length=30,
#         choices=SUPPLIER_STATUS_CHOICES,
#         default='Active'
#     )


#     # =====================================================
#     # PROCUREMENT
#     # =====================================================

#     categories_served = models.TextField(blank=True, null=True)

#     product_details = models.TextField(blank=True, null=True)

#     incoterms = models.CharField(
#         max_length=50,
#         blank=True,
#         null=True
#     )

#     freight_terms = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     min_order_quantity = models.PositiveIntegerField(
#         blank=True,
#         null=True,
#         validators=[MinValueValidator(1)]
#     )

#     avg_lead_time_days = models.PositiveIntegerField(
#         default=30,
#         validators=[MinValueValidator(1)]
#     )

#     return_replacement_policy = models.TextField(
#         blank=True,
#         null=True
#     )

#     contract_references = models.TextField(
#         blank=True,
#         null=True
#     )

#     # =====================================================
#     # FINANCIAL
#     # =====================================================

#     payment_method = models.CharField(
#         max_length=50,
#         choices=PAYMENT_METHOD_CHOICES,
#         blank=True,
#         null=True
#     )

#     payment_terms = models.CharField(
#         max_length=50,
#         choices=PAYMENT_TERMS_CHOICES,
#         blank=True,
#         null=True
#     )

#     currency = models.CharField(
#         max_length=10,
#         choices=CURRENCY_CHOICES,
#         default='INR'
#     )

#     credit_limit = models.DecimalField(
#         max_digits=15,
#         decimal_places=2,
#         blank=True,
#         null=True
#     )

#     opening_balance = models.DecimalField(
#         max_digits=15,
#         decimal_places=2,
#         default=0
#     )

#     current_balance = models.DecimalField(
#         max_digits=15,
#         decimal_places=2,
#         default=0
#     )

#     tax_withholding_setup = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     tds_applicable = models.BooleanField(default=False)

#     tds_percentage = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         blank=True,
#         null=True
#     )

#     # =====================================================
#     # COMPLIANCE & RISK
#     # =====================================================

#     certifications = models.TextField(
#         blank=True,
#         null=True
#     )

#     compliance_status = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     risk_rating = models.CharField(
#         max_length=20,
#         choices=RISK_RATING_CHOICES,
#         default='Low'
#     )

#     risk_notes = models.TextField(
#         blank=True,
#         null=True
#     )

#     mitigation_plan = models.TextField(
#         blank=True,
#         null=True
#     )

#     last_risk_assessment = models.DateField(
#         blank=True,
#         null=True
#     )

#     gst_expiry_date = models.DateField(
#         blank=True,
#         null=True
#     )

#     insurance_expiry_date = models.DateField(
#         blank=True,
#         null=True
#     )

#     contract_expiry_date = models.DateField(
#         blank=True,
#         null=True
#     )

#     # =====================================================
#     # PERFORMANCE
#     # =====================================================

#     on_time_delivery_rate = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         blank=True,
#         null=True,
#         validators=[
#             MinValueValidator(0),
#             MaxValueValidator(100)
#         ]
#     )

#     quality_rating = models.DecimalField(
#         max_digits=3,
#         decimal_places=1,
#         blank=True,
#         null=True,
#         validators=[
#             MinValueValidator(0),
#             MaxValueValidator(5)
#         ]
#     )

#     defect_return_rate = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         blank=True,
#         null=True,
#         validators=[
#             MinValueValidator(0),
#             MaxValueValidator(100)
#         ]
#     )

#     last_evaluation_date = models.DateField(
#         blank=True,
#         null=True
#     )

#     improvement_plans = models.TextField(
#         blank=True,
#         null=True
#     )

#     complaints_registered = models.TextField(
#         blank=True,
#         null=True
#     )

#     contract_breaches = models.TextField(
#         blank=True,
#         null=True
#     )

#     # =====================================================
#     # ERP / BRANCH / COMPANY
#     # =====================================================

#     branch = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     company = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     business_unit = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     cost_center = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     # =====================================================
#     # APPROVAL FLOW
#     # =====================================================

#     submitted_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='supplier_submitted_by'
#     )

#     submitted_at = models.DateTimeField(
#         blank=True,
#         null=True
#     )

#     approved_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='supplier_approved_by'
#     )

#     approved_at = models.DateTimeField(
#         blank=True,
#         null=True
#     )

#     rejected_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='supplier_rejected_by'
#     )

#     rejected_at = models.DateTimeField(
#         blank=True,
#         null=True
#     )

#     approval_remarks = models.TextField(
#         blank=True,
#         null=True
#     )

#     # =====================================================
#     # AUDIT
#     # =====================================================

#     is_active = models.BooleanField(default=True)

#     is_deleted = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     updated_at = models.DateTimeField(auto_now=True)

#     created_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         related_name='created_suppliers'
#     )

#     updated_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         related_name='updated_suppliers'
#     )

#     # =====================================================
#     # META
#     # =====================================================

#     class Meta:
#         ordering = ['-id']

#         verbose_name = "Supplier"

#         verbose_name_plural = "Suppliers"

#         indexes = [
#             Index(fields=['supplier_id']),
#             Index(fields=['supplier_name']),
#             Index(fields=['workflow_status']),
#             Index(fields=['supplier_status']),
#             Index(fields=['tax_id']),
#         ]

#         constraints = [
#             UniqueConstraint(
#                 fields=['tax_id'],
#                 name='unique_supplier_tax_id'
#             )
#         ]

#     # =====================================================
#     # SAVE
#     # =====================================================

#     def save(self, *args, **kwargs):

#         if not self.supplier_id:

#             last_supplier = Supplier.objects.order_by('-id').first()

#             next_id = 1

#             if last_supplier and last_supplier.supplier_id:

#                 try:
#                     next_id = int(
#                         last_supplier.supplier_id.split('-')[1]
#                     ) + 1

#                 except:
#                     next_id = 1

#             self.supplier_id = f"SUP-{next_id:05d}"

#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.supplier_id} - {self.supplier_name}"


# # =========================================================
# # SUPPLIER CONTACTS
# # =========================================================

# class SupplierContact(models.Model):

#     supplier = models.ForeignKey(
#         Supplier,
#         on_delete=models.CASCADE,
#         related_name='contacts'
#     )

#     contact_type = models.CharField(
#         max_length=50,
#         choices=CONTACT_TYPE_CHOICES,
#         default='Primary'
#     )

#     first_name = models.CharField(max_length=100)

#     last_name = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     designation = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     email = models.EmailField()

#     phone = models.CharField(
#         max_length=20,
#         validators=[
#             RegexValidator(
#                 regex=r'^[0-9+\-\s]+$',
#                 message='Invalid phone number'
#             )
#         ]
#     )

#     alternate_phone = models.CharField(
#         max_length=20,
#         blank=True,
#         null=True
#     )

#     department = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     is_primary = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-is_primary', 'id']

#     def __str__(self):
#         return f"{self.first_name} - {self.supplier.supplier_name}"


# # =========================================================
# # SUPPLIER ADDRESSES
# # =========================================================

# class SupplierAddress(models.Model):

#     supplier = models.ForeignKey(
#         Supplier,
#         on_delete=models.CASCADE,
#         related_name='addresses'
#     )

#     address_type = models.CharField(
#         max_length=50,
#         choices=ADDRESS_TYPE_CHOICES
#     )

#     address_line_1 = models.CharField(max_length=255)

#     address_line_2 = models.CharField(
#         max_length=255,
#         blank=True,
#         null=True
#     )

#     city = models.CharField(max_length=100)

#     state = models.CharField(max_length=100)

#     postal_code = models.CharField(max_length=20)

#     country = models.CharField(
#         max_length=5,
#         choices=CountryChoices.choices,
#         default=CountryChoices.INDIA
#     )

#     landmark = models.CharField(
#         max_length=255,
#         blank=True,
#         null=True
#     )

#     is_default = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['id']

#     def __str__(self):
#         return f"{self.address_type} - {self.supplier.supplier_name}"


# # =========================================================
# # SUPPLIER BANK DETAILS
# # =========================================================

# class SupplierBankAccount(models.Model):

#     supplier = models.ForeignKey(
#         Supplier,
#         on_delete=models.CASCADE,
#         related_name='bank_accounts'
#     )

#     bank_name = models.CharField(max_length=255)

#     account_holder_name = models.CharField(max_length=255)

#     account_number = models.CharField(max_length=100)

#     ifsc_code = models.CharField(
#         max_length=20,
#         blank=True,
#         null=True
#     )

#     swift_code = models.CharField(
#         max_length=20,
#         blank=True,
#         null=True
#     )

#     iban_number = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     branch_name = models.CharField(
#         max_length=255,
#         blank=True,
#         null=True
#     )

#     currency = models.CharField(
#         max_length=10,
#         choices=CURRENCY_CHOICES,
#         default='INR'
#     )

#     is_primary = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.bank_name} - {self.supplier.supplier_name}"


# # =========================================================
# # SUPPLIER PRODUCT MAPPING
# # =========================================================

# class SupplierProduct(models.Model):

#     supplier = models.ForeignKey(
#         Supplier,
#         on_delete=models.CASCADE,
#         related_name='supplier_products'
#     )

#     product_name = models.CharField(max_length=255)

#     supplier_sku = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     category = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     unit_price = models.DecimalField(
#         max_digits=15,
#         decimal_places=2,
#         default=0
#     )

#     currency = models.CharField(
#         max_length=10,
#         choices=CURRENCY_CHOICES,
#         default='INR'
#     )

#     lead_time_days = models.PositiveIntegerField(
#         default=1
#     )

#     minimum_order_quantity = models.PositiveIntegerField(
#         default=1
#     )

#     product_status = models.CharField(
#         max_length=20,
#         choices=PRODUCT_STATUS_CHOICES,
#         default='Active'
#     )

#     remarks = models.TextField(
#         blank=True,
#         null=True
#     )

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.product_name} - {self.supplier.supplier_name}"


# # =========================================================
# # SUPPLIER DOCUMENTS
# # =========================================================

# class SupplierDocument(models.Model):

#     supplier = models.ForeignKey(
#         Supplier,
#         on_delete=models.CASCADE,
#         related_name='documents'
#     )

#     document_type = models.CharField(
#         max_length=100,
#         choices=DOCUMENT_TYPE_CHOICES
#     )

#     document_name = models.CharField(max_length=255)

#     document_number = models.CharField(
#         max_length=100,
#         blank=True,
#         null=True
#     )

#     file = models.FileField(
#         upload_to='supplier_documents/%Y/%m/%d/'
#     )

#     issue_date = models.DateField(
#         blank=True,
#         null=True
#     )

#     expiry_date = models.DateField(
#         blank=True,
#         null=True
#     )

#     version = models.CharField(
#         max_length=20,
#         blank=True,
#         null=True
#     )

#     remarks = models.TextField(
#         blank=True,
#         null=True
#     )

#     is_verified = models.BooleanField(default=False)

#     verified_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         blank=True,
#         null=True
#     )

#     uploaded_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True,
#         related_name='uploaded_supplier_documents'
#     )

#     uploaded_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-uploaded_at']

#     def __str__(self):
#         return f"{self.document_type} - {self.supplier.supplier_name}"


# # =========================================================
# # SUPPLIER COMMENTS
# # =========================================================

# class SupplierComment(models.Model):

#     supplier = models.ForeignKey(
#         Supplier,
#         on_delete=models.CASCADE,
#         related_name='comments'
#     )

#     parent_comment = models.ForeignKey(
#         'self',
#         on_delete=models.CASCADE,
#         blank=True,
#         null=True
#     )

#     comment = models.TextField()

#     attachment = models.FileField(
#         upload_to='supplier_comments/',
#         blank=True,
#         null=True
#     )

#     is_internal = models.BooleanField(default=True)

#     commented_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True
#     )

#     commented_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-commented_at']

#     def __str__(self):
#         return f"Comment - {self.supplier.supplier_name}"


# # =========================================================
# # SUPPLIER ACTIVITY LOG
# # =========================================================

# class SupplierActivity(models.Model):

#     supplier = models.ForeignKey(
#         Supplier,
#         on_delete=models.CASCADE,
#         related_name='activities'
#     )

#     action = models.CharField(
#         max_length=100,
#         choices=ACTIVITY_ACTION_CHOICES
#     )

#     old_value = models.TextField(
#         blank=True,
#         null=True
#     )

#     new_value = models.TextField(
#         blank=True,
#         null=True
#     )

#     remarks = models.TextField(
#         blank=True,
#         null=True
#     )

#     performed_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True
#     )

#     performed_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-performed_at']

#     def __str__(self):
#         return f"{self.action} - {self.supplier.supplier_name}"


# # =========================================================
# # SUPPLIER APPROVALS
# # =========================================================

# class SupplierApproval(models.Model):

#     supplier = models.ForeignKey(
#         Supplier,
#         on_delete=models.CASCADE,
#         related_name='approvals'
#     )

#     workflow_status = models.CharField(
#         max_length=50,
#         choices=WORKFLOW_STATUS_CHOICES
#     )

#     remarks = models.TextField(
#         blank=True,
#         null=True
#     )

#     approved_by = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.SET_NULL,
#         null=True
#     )

#     approved_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['-approved_at']

#     def __str__(self):
#         return f"{self.workflow_status} - {self.supplier.supplier_name}"