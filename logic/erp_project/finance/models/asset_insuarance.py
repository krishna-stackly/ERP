from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone



class Asset(models.Model):
    asset_id = models.CharField(max_length=50, unique=True, blank=True)
    asset_name = models.CharField(max_length=200)
    asset_category = models.CharField(
        max_length=100,
        choices=[
            ("Machinery & Equipments", "Machinery & Equipments"),
            ("Building & Structures", "Building & Structures"),
            ("Vehicles", "Vehicles"),
            ("IT & Electronics", "IT & Electronics"),
            ("Furniture", "Furniture"),
        ]
    )
    location = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    custom_floor = models.CharField(max_length=100, blank=True, null=True)
    purchase_value = models.DecimalField(max_digits=15, decimal_places=2)
    current_book_value = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Active", "Active"),
            ("Inactive", "Inactive")
        ]
    )

    def save(self, *args, **kwargs):
     if self.asset_id is None or self.asset_id == "":
        last_asset = Asset.objects.order_by("-id").first()
        next_number = 1

        if last_asset and last_asset.asset_id:
            try:
                next_number = int(
                    last_asset.asset_id.replace("AST-", "")
                ) + 1
            except ValueError:
                pass

        self.asset_id = f"AST-{next_number:05d}"

     super().save(*args, **kwargs)


class asset_InsuranceCompany(models.Model):
    company_name = models.CharField(max_length=200)
    sector_type = models.CharField(
        max_length=50,
        choices=[("Public", "Public"), ("Private", "Private"), ("Foreign", "Foreign")]
    )
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    irdai_license_no = models.CharField(max_length=50)
    address = models.TextField()

    def __str__(self):
        return self.company_name


class asset_ResponsibleEntity(models.Model):
    RESPONSIBILITY_CHOICES = [
        ("Individual", "Individual"),
        ("Department", "Department"),
        ("Committee", "Committee"),
    ]
    name = models.CharField(max_length=200)
    responsibility_type = models.CharField(max_length=50, choices=RESPONSIBILITY_CHOICES)
    contact_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.responsibility_type})"


class AssetInsurancePolicy(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="insurance_policies")
    insurance_company = models.ForeignKey(asset_InsuranceCompany, on_delete=models.CASCADE)
    policy_number = models.CharField(max_length=100)
    policy_type = models.CharField(max_length=100)  # e.g., Fire, Theft, All-Risk, etc.
    coverage_amount = models.DecimalField(max_digits=15, decimal_places=2)
    policy_start_date = models.DateField()
    policy_end_date = models.DateField()
    renewal_reminder_days = models.IntegerField(
        choices=[(30, "30 Days"), (45, "45 Days"), (60, "60 Days"), (90, "90 Days")]
    )
    insured_by = models.ForeignKey(asset_ResponsibleEntity, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Policy {self.policy_number} for {self.asset.asset_name}"


class asset_PremiumPayment(models.Model):
    FREQUENCY_CHOICES = [
        ("Annually", "Annually"),
        ("Semi-Annually", "Semi-Annually"),
        ("Quarterly", "Quarterly"),
        ("Monthly", "Monthly"),
        ("One Time", "One Time"),
    ]
    MODE_CHOICES = [
        ("Cheque", "Cheque"),
        ("Online Portal", "Online Portal"),
        ("Auto-Debit", "Auto-Debit"),
        ("Bank Transfer", "Bank Transfer"),
        ("Cash", "Cash"),
    ]

    policy = models.ForeignKey(AssetInsurancePolicy, on_delete=models.CASCADE, related_name="premium_payments")
    annual_premium_amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_frequency = models.CharField(max_length=50, choices=FREQUENCY_CHOICES)
    premium_due_date = models.DateField()
    payment_mode = models.CharField(max_length=50, choices=MODE_CHOICES)
    gst_on_premium = models.DecimalField(max_digits=15, decimal_places=2)
    total_premium_incl_gst = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f"Premium for {self.policy.policy_number}"


class asset_PolicyLineItem(models.Model):
    policy = models.ForeignKey(AssetInsurancePolicy, on_delete=models.CASCADE, related_name="line_items")
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.asset.asset_name} under {self.policy.policy_number}"


class asset_PolicyAttachment(models.Model):
    policy = models.ForeignKey(AssetInsurancePolicy, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="insurance_attachments/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.policy.policy_number}"


class asset_PolicyComment(models.Model):
    policy = models.ForeignKey(AssetInsurancePolicy, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,  on_delete=models.SET_NULL,null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment on {self.policy.policy_number}"


class asset_PolicyHistory(models.Model):
    policy = models.ForeignKey(AssetInsurancePolicy, on_delete=models.CASCADE, related_name="history")
    action = models.CharField(max_length=200)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True)
    performed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History for {self.policy.policy_number}"
