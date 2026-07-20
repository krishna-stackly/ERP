from decimal import Decimal

from django.db import models
from django.conf import settings
from django.db.models import UniqueConstraint, Index
from django.core.validators import MinValueValidator


class Category(models.Model):
    name = models.CharField(max_length=100)

    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Parent Category"
    )

    level = models.PositiveIntegerField(default=0, editable=False)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_categories'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_categories'
    )

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['level', 'name']
        constraints = [
            UniqueConstraint(
                fields=['name', 'parent'],
                name='unique_category_name_per_parent'
            )
        ]

    def __str__(self):
        if self.parent:
            return f"{self.parent} → {self.name}"
        return self.name

    def save(self, *args, **kwargs):
        if self.parent:
            self.level = self.parent.level + 1
        else:
            self.level = 0

        if self.level > 4:
            raise ValueError("Maximum category nesting depth is 4 levels")

        super().save(*args, **kwargs)


class TaxCode(models.Model):
    name = models.CharField(max_length=100, unique=True)

    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )

    description = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_tax_codes'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_tax_codes'
    )

    class Meta:
        verbose_name = "Tax Code"
        verbose_name_plural = "Tax Codes"
        ordering = ['name']
        constraints = [
            UniqueConstraint(fields=['name'], name='unique_tax_code_name')
        ]
        indexes = [
            Index(fields=['name', 'is_active'])
        ]

    def __str__(self):
        return self.name


class UOM(models.Model):
    name = models.CharField(max_length=100, unique=True)
    items = models.IntegerField(validators=[MinValueValidator(1)])
    description = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_uoms'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_uoms'
    )

    class Meta:
        verbose_name = "UOM"
        verbose_name_plural = "UOMs"
        ordering = ['name']
        constraints = [
            UniqueConstraint(fields=['name'], name='unique_uom_name')
        ]
        indexes = [
            Index(fields=['name', 'is_active'])
        ]

    def __str__(self):
        return self.name


class Warehouse(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=200)
    manager_name = models.CharField(max_length=100, blank=True, null=True)
    contact_info = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_warehouses'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_warehouses'
    )

    class Meta:
        verbose_name = "Warehouse"
        verbose_name_plural = "Warehouses"
        ordering = ['name']
        constraints = [
            UniqueConstraint(fields=['name'], name='unique_warehouse_name')
        ]
        indexes = [
            Index(fields=['name', 'is_active'])
        ]

    def __str__(self):
        return self.name


class Size(models.Model):
    name = models.CharField(max_length=50, unique=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_sizes'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_sizes'
    )

    class Meta:
        verbose_name = "Size"
        verbose_name_plural = "Sizes"
        ordering = ['name']
        constraints = [
            UniqueConstraint(fields=['name'], name='unique_size_name')
        ]
        indexes = [
            Index(fields=['name', 'is_active'])
        ]

    def __str__(self):
        return self.name


class Color(models.Model):
    name = models.CharField(max_length=50, unique=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_colors'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_colors'
    )

    class Meta:
        verbose_name = "Color"
        verbose_name_plural = "Colors"
        ordering = ['name']
        constraints = [
            UniqueConstraint(fields=['name'], name='unique_color_name')
        ]
        indexes = [
            Index(fields=['name', 'is_active'])
        ]

    def __str__(self):
        return self.name


class ProductSupplier(models.Model):
    name = models.CharField(max_length=100, unique=True)
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_product_suppliers'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_product_suppliers'
    )

    class Meta:
        verbose_name = "Product Supplier"
        verbose_name_plural = "Product Suppliers"
        ordering = ['name']
        constraints = [
            UniqueConstraint(
                fields=['name'],
                name='unique_product_supplier_name'
            )
        ]
        indexes = [
            Index(fields=['name', 'is_active'])
        ]

    def __str__(self):
        return self.name


class Product(models.Model):
    product_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)

    product_type = models.CharField(
        max_length=50,
        choices=[
            ('Goods', 'Goods'),
            ('Services', 'Services'),
            ('Combo', 'Combo')
        ]
    )

    description = models.TextField(blank=True, null=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    is_custom_category = models.BooleanField(default=False)
    custom_category = models.CharField(max_length=255, blank=True, null=True)

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.0)]
    )

    discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0.0)]
    )

    tax_code = models.ForeignKey(
        TaxCode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    is_custom_tax_code = models.BooleanField(default=False)
    custom_tax_code = models.CharField(max_length=255, blank=True, null=True)

    quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    uom = models.ForeignKey(
        UOM,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    is_custom_uom = models.BooleanField(default=False)
    custom_uom = models.CharField(max_length=255, blank=True, null=True)

    stock_level = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    reorder_level = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    is_custom_warehouse = models.BooleanField(default=False)
    custom_warehouse = models.CharField(max_length=255, blank=True, null=True)

    size = models.ForeignKey(
        Size,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    is_custom_size = models.BooleanField(default=False)
    custom_size = models.CharField(max_length=255, blank=True, null=True)

    color = models.ForeignKey(
        Color,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    is_custom_color = models.BooleanField(default=False)
    custom_color = models.CharField(max_length=255, blank=True, null=True)

    weight = models.CharField(max_length=50, blank=True, null=True)
    specifications = models.TextField(blank=True, null=True)

    related_products = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        related_name='related_to'
    )

    is_custom_related_products = models.BooleanField(default=False)
    custom_related_products = models.CharField(max_length=255, blank=True, null=True)

    supplier = models.ForeignKey(
        ProductSupplier,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    is_custom_supplier = models.BooleanField(default=False)
    custom_supplier = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ('Active', 'Active'),
            ('Inactive', 'Inactive'),
            ('Discontinued', 'Discontinued')
        ]
    )

    product_usage = models.CharField(
        max_length=20,
        choices=[
            ('Purchase', 'Purchase'),
            ('Sale', 'Sale'),
            ('Both', 'Both')
        ]
    )

    image = models.ImageField(
        upload_to='product_images/%Y/%m/%d/',
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_products'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_products'
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['name']
        indexes = [
            Index(fields=['name', 'status', 'is_active']),
            Index(fields=['product_id'])
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new and not self.product_id:
            self.product_id = f'CVB{self.id:03d}'
            super().save(update_fields=['product_id'])
