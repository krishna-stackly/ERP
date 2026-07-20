from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from decimal import Decimal
from masters.models import (
    Branch, Department, Role,
    Category, TaxCode, UOM, Warehouse,
    Size, Color, ProductSupplier,
    Product, Customer, Supplier
)

User = get_user_model()


class Command(BaseCommand):
    help = "Seed complete ERP demo data with structured permissions"

    @transaction.atomic
    def handle(self, *args, **kwargs):

        self.stdout.write(self.style.SUCCESS("Starting ERP Seeding..."))

        # --------------------------------------------------
        # Get Existing Superuser
        # --------------------------------------------------
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write(self.style.ERROR("No superuser found."))
            return

        # --------------------------------------------------
        # 1️⃣ Branches
        # --------------------------------------------------
        branch_names = ["Head Office", "Chennai", "Mumbai", "Delhi", "Hyderabad"]
        branches = []

        for name in branch_names:
            branch, _ = Branch.objects.get_or_create(
                name=name,
                defaults={
                    "created_by": admin_user,
                    "updated_by": admin_user
                }
            )
            branches.append(branch)

        head_office = branches[0]

        # --------------------------------------------------
        # 2️⃣ Departments + Roles (FULL STRUCTURE)
        # --------------------------------------------------

        departments_data = [
            {
                "code": "HR004",
                "name": "Human Resources",
                "roles": [
                    {
                        "role": "HR Manager",
                        "permissions": {
                            "employee": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            },
                            "attendance": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            },
                            "payroll": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            }
                        }
                    },
                    {
                        "role": "HR Executive",
                        "permissions": {
                            "employee": {
                                "full_access": False,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": False
                            },
                            "attendance": {
                                "full_access": False,
                                "view": True,
                                "create": True,
                                "edit": False,
                                "delete": False
                            },
                            "payroll": {
                                "full_access": False,
                                "view": True,
                                "create": False,
                                "edit": False,
                                "delete": False
                            }
                        }
                    }
                ]
            },
            {
                "code": "SAL001",
                "name": "Sales",
                "roles": [
                    {
                        "role": "Sales Manager",
                        "permissions": {
                            "customer": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            },
                            "product": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            },
                            "sales_order": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            }
                        }
                    },
                    {
                        "role": "Sales Representative",
                        "permissions": {
                            "customer": {
                                "full_access": False,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": False
                            },
                            "product": {
                                "full_access": False,
                                "view": True,
                                "create": False,
                                "edit": False,
                                "delete": False
                            },
                            "sales_order": {
                                "full_access": False,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": False
                            }
                        }
                    }
                ]
            },
            {
                "code": "IT001",
                "name": "IT",
                "roles": [
                    {
                        "role": "IT Admin",
                        "permissions": {
                            "users": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            },
                            "roles": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            },
                            "departments": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            }
                        }
                    }
                ]
            },
            {
                "code": "FIN001",
                "name": "Finance",
                "roles": [
                    {
                        "role": "Finance Manager",
                        "permissions": {
                            "invoice": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            },
                            "expenses": {
                                "full_access": True,
                                "view": True,
                                "create": True,
                                "edit": True,
                                "delete": True
                            },
                            "reports": {
                                "full_access": False,
                                "view": True,
                                "create": False,
                                "edit": False,
                                "delete": False
                            }
                        }
                    }
                ]
            }
        ]

        department_objects = {}

        for dept in departments_data:
            department, _ = Department.objects.get_or_create(
                code=dept["code"],
                branch=head_office,
                defaults={
                    "department_name": dept["name"],
                    "created_by": admin_user,
                    "updated_by": admin_user
                }
            )

            Role.objects.filter(department=department).delete()

            for role in dept["roles"]:
                Role.objects.create(
                    department=department,
                    branch=head_office,
                    role=role["role"],
                    description=role["role"],
                    permissions=role["permissions"],
                    created_by=admin_user,
                    updated_by=admin_user
                )

            department_objects[dept["name"]] = department

        # --------------------------------------------------
        # 3️⃣ Users
        # --------------------------------------------------

        sales_dept = department_objects["Sales"]
        sales_manager_role = Role.objects.get(role="Sales Manager")
        sales_rep_role = Role.objects.get(role="Sales Representative")

        manager_user, _ = User.objects.get_or_create(
            email="manager@erp.com",
            defaults={
                "first_name": "Sales",
                "last_name": "Manager",
                "branch": head_office,
                "department": sales_dept,
                "role": sales_manager_role,
                "created_by": admin_user
            }
        )
        manager_user.set_password("test123")
        manager_user.save()

        for i in range(1, 6):
            user = User.objects.create(
                email=f"sales{i}@erp.com",
                first_name=f"Sales{i}",
                branch=head_office,
                department=sales_dept,
                role=sales_rep_role,
                reporting_to=manager_user,
                created_by=admin_user
            )
            user.set_password("test123")
            user.save()

        # --------------------------------------------------
        # 4️⃣ Master Data + Products + Customers + Suppliers
        # (same as before — unchanged)
        # --------------------------------------------------

        categories = [Category.objects.create(name=f"Category {i}", created_by=admin_user) for i in range(1, 11)]

        tax = TaxCode.objects.create(name="GST 18%", percentage=Decimal("18.00"), created_by=admin_user)
        uom = UOM.objects.create(name="Piece", items=1, created_by=admin_user)
        warehouse = Warehouse.objects.create(name="Main Warehouse", location="Chennai", created_by=admin_user)
        size = Size.objects.create(name="Medium", created_by=admin_user)
        color = Color.objects.create(name="Red", created_by=admin_user)
        supplier_master = ProductSupplier.objects.create(name="ABC Traders", created_by=admin_user)

        for i in range(1, 11):
            Product.objects.create(
                name=f"Product {i}",
                product_type="Goods",
                category=categories[i - 1],
                unit_price=Decimal("100.00"),
                tax_code=tax,
                quantity=100,
                uom=uom,
                warehouse=warehouse,
                size=size,
                color=color,
                supplier=supplier_master,
                status="Active",
                product_usage="Both",
                created_by=admin_user
            )

        sales_rep = User.objects.filter(role__role="Sales Representative").first()

        for i in range(1, 11):
            Customer.objects.create(
                first_name=f"Customer{i}",
                customer_type="Business",
                email=f"customer{i}@mail.com",
                phone_number="9876543210",
                assigned_sales_rep=sales_rep,
                created_by=admin_user
            )

        for i in range(1, 6):
            Supplier.objects.create(
                tax_id=f"TAX{i}",
                supplier_name=f"Supplier {i}",
                legal_entity_name=f"Supplier {i} Pvt Ltd",
                primary_contact_first_name="John",
                primary_contact_email=f"supplier{i}@mail.com",
                primary_contact_phone="9876543210",
                registered_address="Chennai",
                created_by=admin_user
            )

        self.stdout.write(self.style.SUCCESS("ERP Demo Data Seeded Successfully!"))
