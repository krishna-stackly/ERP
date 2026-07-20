from django.db import models
from django.conf import settings

class Technician(models.Model):
    
    DEPARTMENT_CHOICES = [
        ("Electrical Maintenance Department", "Electrical Maintenance Department"),
        ("Mechanical Maintenance Department", "Mechanical Maintenance Department"),
        ("HVAC And Cooling System Maintenance Department", "HVAC And Cooling System Maintenance Department"),
        ("Utilities Maintenance Department", "Utilities Maintenance Department"),
        ("Safety & Compliance Department", "Safety & Compliance Department"),
        ("Instrumentation & Control Department", "Instrumentation & Control Department"),
        ("Production Line Maintenance Department", "Production Line Maintenance Department"),
        ("Civil & Structural", "Civil & Structural Maintenance Department"),
        ("IT & Automation Maintenance Department", "IT & Automation Support Department"),
        ("Warehouse Stores", "Warehouse Stores"),
        ("Administrative & IT Collections", "Administrative & IT Collections"),
    ]

    DESIGNATION_CHOICES =[
        ('Senior Mechanical Technician','Senior Mechanical Technician'),
        ('Junior Mechanical Technician','Junior Mechanical Technician'),
        ('Senior Electrical Technician','Senior Electrical Technicia'),
        ('Junior Electrical Technician','Junior Electrical Technician'),
        ('Instrumentation Technician','Instrumentation Technician'),
    ]

    SKILL_CATEGORY_CHOICES = [
        ("Mechanical Skills", "Mechanical Skills"),
        ("Electrical Skills", "Electrical Skills"),
        ("Instrumentation Skills", "Instrumentation Skills"),
        ("HVAC Skills", "HVAC Skills"),
        ("Utilities Skills", "Utilities Skills"),
        ("Civil & Masonry Skills", "Civil & Masonry Skills"),
        ("IT Skills", "IT Skills"),
    ]

    SKILL_LEVEL_CHOICES = [
        ("Basic", "Basic"),
        ("Intermediate", "Intermediate"),
        ("Expert", "Expert"),
    ]

    SHIFT_CHOICES = [
        ("Morning", "Morning"),
        ("Afternoon", "Afternoon"),
        ("Night", "Night"),
        ("Rotational", "Rotational"),
    ]

    LOCATION_CHOICES = [
        ("Main Manufacturing Plant", "Main Manufacturing Plant"),
        ("Utility & Support Areas", "Utility & Support Areas"),
        ("Production Lines", "Production Lines"),
        ("Maintenance & Service Areas", "Maintenance & Service Areas"),
        ("Warehouse Stores", "Warehouse Stores"),
        ("Administrative & IT Collections", "Administrative & IT Collections"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
        ("On Leave", "On Leave"),
        
    ]

    
    technician_id = models.CharField(max_length=20, unique=True)
    employee_code = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    date_of_joining = models.DateField()

    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES)
    designation = models.CharField(max_length=50, choices=DESIGNATION_CHOICES)

    mail_id = models.EmailField()
    contact_number = models.CharField(max_length=15)

    skill_category = models.CharField(max_length=50, choices=SKILL_CATEGORY_CHOICES)
    skill_level = models.CharField(max_length=20, choices=SKILL_LEVEL_CHOICES)

    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    work_location = models.CharField(max_length=50, choices=LOCATION_CHOICES)

    reporting_supervisor = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def save(self, *args, **kwargs):
        if not self.technician_id:
            last_id = Technician.objects.all().order_by("id").last()
            if last_id:
                # Extract numeric part and increment
                num = int(last_id.technician_id.split("-")[1]) + 1
            else:
                num = 1
            self.technician_id = f"TECH-{num:03d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.technician_id} - {self.full_name}"

  

class AssetMaintenance(models.Model):
   
    ASSET_CHOICES = [
        ("AST-1001", "AST-1001 - Cnc Lathe Machine"),
        ("AST-1002", "AST-1002 - Hydraulic Press"),
        ("AST-1003", "AST-1003 - Milling Machine"),
        ("AST-1004", "AST-1004 - Injection Moulding Machine"),
        ("AST-1005", "AST-1005 - Air Compressor"),
    ]

    MAINTENANCE_TYPE_CHOICES = [
        ("Preventive", "Preventive Maintenance"),
        ("Predictive", "Predictive Maintenance"),
        ("Breakdown", "Breakdown Maintenance"),
    ]

    FREQUENCY_CHOICES = [
        ("Daily", "Daily"),
        ("Weekly", "Weekly"),
        ("Monthly", "Monthly"),
        ("Yearly", "Yearly"),
    ]

    STATUS_CHOICES = [
        ("Planned", "Planned"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Overdue", "Overdue"),
        
    ]

  
    maintenance_id = models.CharField(max_length=30, unique=True, editable=False)
    asset_id = models.CharField(max_length=50, choices=ASSET_CHOICES)
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES)

    schedule_frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()

    last_serviced_date = models.DateField(null=True, blank=True)
    next_due_date = models.DateField(null=True, blank=True)

    assigned_technician = models.ForeignKey(
        "Technician",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maintenance_requests"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    remarks = models.TextField(blank=True, null=True)

    
    # Auto-generate Maintenance ID
   
    def save(self, *args, **kwargs):
        if not self.maintenance_id:
            last_record = AssetMaintenance.objects.all().order_by("id").last()
            if last_record:
                num = int(last_record.maintenance_id.split("-")[-1]) + 1
            else:
                num = 1
            self.maintenance_id = f"MNT-2025-{num:05d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.maintenance_id} - {self.asset_id} ({self.status})"

 


class AssetMaintenanceItem(models.Model):

    UOM_CHOICES = [
        ('Nos','Nos'), 
        ('Ltr','Ltr'),
        ('Set','Set'), 
        ('Kg','Kg'),
        ('Mtr','kg'),
    ]

    maintenance = models.ForeignKey(
        "AssetMaintenance",
        on_delete=models.CASCADE,
        related_name="line_items"
    )

    part_code = models.CharField(max_length=50)
    part_name = models.CharField(max_length=100)
    uom = models.CharField(max_length=20, choices=UOM_CHOICES)  
    quantity = models.PositiveIntegerField()
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, editable=False)


    Technician = models.CharField(max_length=100)
   

    def save(self, *args, **kwargs):
        self.total_cost = self.quantity * self.unit_cost
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.part_code} - {self.part_name} ({self.quantity} {self.uom})"

    
class AssetMaintenanceAttachment(models.Model):
    asset_maintenance = models.ForeignKey(
        "AssetMaintenance",
        on_delete=models.CASCADE,
        related_name="attachments"
    )
    file = models.FileField(upload_to="AssetMaintenance/attachments/%Y/%m/%d/")
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Attachment for {self.asset_maintenance.maintenance_id}"


class AssetMaintenanceComment(models.Model):
    asset_maintenance = models.ForeignKey(
        "AssetMaintenance",
        on_delete=models.CASCADE,
        related_name="comments"
    )
    comment = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.created_by} on {self.asset_maintenance.maintenance_id}"


class AssetMaintenanceHistory(models.Model):
    asset_maintenance = models.ForeignKey(
        "AssetMaintenance",
        on_delete=models.CASCADE,
        related_name="history"
    )
    event_type = models.CharField(max_length=100)
    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} on {self.asset_maintenance.maintenance_id}"