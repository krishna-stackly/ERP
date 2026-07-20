from django.db import transaction
from rest_framework import serializers

from masters.models.product_master_models import (
    Category,
    TaxCode,
    UOM,
    Warehouse,
    Size,
    Color,
    ProductSupplier,
    Product,
)


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField(read_only=True)
    parent_name = serializers.CharField(
        source='parent.name',
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'parent',
            'parent_name',
            'level',
            'children',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'level',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
            'children',
        ]

    def get_children(self, obj):
        return CategorySerializer(
            obj.children.all(),
            many=True
        ).data

    def validate(self, data):
        parent = data.get('parent')
        name = data.get('name')

        if parent and self.instance and parent == self.instance:
            raise serializers.ValidationError({
                "parent": "Cannot set a category as its own parent"
            })

        qs = Category.objects.filter(parent=parent, name=name)

        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.exists():
            raise serializers.ValidationError({
                "name": "This category name already exists under the selected parent"
            })

        return data

    def create(self, validated_data):
        return Category.objects.create(
            **validated_data,
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user
        )

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()
        return instance


class TaxCodeSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = TaxCode
        fields = [
            'id',
            'name',
            'percentage',
            'description',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class UOMSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = UOM
        fields = [
            'id',
            'name',
            'items',
            'description',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class WarehouseSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Warehouse
        fields = [
            'id',
            'name',
            'location',
            'manager_name',
            'contact_info',
            'notes',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class SizeSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Size
        fields = [
            'id',
            'name',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class ColorSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Color
        fields = [
            'id',
            'name',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class ProductSupplierSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = ProductSupplier
        fields = [
            'id',
            'name',
            'contact_person',
            'phone_number',
            'email',
            'address',
            'is_active',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )

    tax_code = serializers.PrimaryKeyRelatedField(
        queryset=TaxCode.objects.all(),
        required=False,
        allow_null=True
    )

    uom = serializers.PrimaryKeyRelatedField(
        queryset=UOM.objects.all(),
        required=False,
        allow_null=True
    )

    warehouse = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(),
        required=False,
        allow_null=True
    )

    size = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(),
        required=False,
        allow_null=True
    )

    color = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(),
        required=False,
        allow_null=True
    )

    supplier = serializers.PrimaryKeyRelatedField(
        queryset=ProductSupplier.objects.all(),
        required=False,
        allow_null=True
    )

    related_products = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        many=True,
        required=False
    )

    category_detail = CategorySerializer(
        source='category',
        read_only=True
    )

    tax_code_detail = TaxCodeSerializer(
        source='tax_code',
        read_only=True
    )

    uom_detail = UOMSerializer(
        source='uom',
        read_only=True
    )

    warehouse_detail = WarehouseSerializer(
        source='warehouse',
        read_only=True
    )

    size_detail = SizeSerializer(
        source='size',
        read_only=True
    )

    color_detail = ColorSerializer(
        source='color',
        read_only=True
    )

    supplier_detail = ProductSupplierSerializer(
        source='supplier',
        read_only=True
    )

    related_products_detail = serializers.SerializerMethodField(read_only=True)

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'product_id',
            'name',
            'product_type',
            'description',
            'category',
            'category_detail',
            'is_custom_category',
            'custom_category',
            'tax_code',
            'tax_code_detail',
            'is_custom_tax_code',
            'custom_tax_code',
            'uom',
            'uom_detail',
            'is_custom_uom',
            'custom_uom',
            'warehouse',
            'warehouse_detail',
            'is_custom_warehouse',
            'custom_warehouse',
            'size',
            'size_detail',
            'is_custom_size',
            'custom_size',
            'color',
            'color_detail',
            'is_custom_color',
            'custom_color',
            'supplier',
            'supplier_detail',
            'is_custom_supplier',
            'custom_supplier',
            'related_products',
            'related_products_detail',
            'is_custom_related_products',
            'custom_related_products',
            'unit_price',
            'discount',
            'quantity',
            'stock_level',
            'reorder_level',
            'weight',
            'specifications',
            'status',
            'product_usage',
            'image',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'id',
            'product_id',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
            'category_detail',
            'tax_code_detail',
            'uom_detail',
            'warehouse_detail',
            'size_detail',
            'color_detail',
            'supplier_detail',
            'related_products_detail',
        ]

    def get_related_products_detail(self, obj):
        return [
            {
                "id": product.id,
                "name": product.name
            }
            for product in obj.related_products.all()
        ]

    def validate(self, data):
        if self.instance is None:
            required = [
                'name',
                'product_type',
                'unit_price',
                'quantity',
                'stock_level',
                'status',
                'product_usage',
            ]

            for field in required:
                if field not in data or not data[field]:
                    raise serializers.ValidationError({
                        field: f"{field.replace('_', ' ').title()} is required"
                    })

        custom_pairs = [
            ('category', 'custom_category'),
            ('tax_code', 'custom_tax_code'),
            ('uom', 'custom_uom'),
            ('warehouse', 'custom_warehouse'),
            ('size', 'custom_size'),
            ('color', 'custom_color'),
            ('supplier', 'custom_supplier'),
            ('related_products', 'custom_related_products'),
        ]

        for normal, custom in custom_pairs:
            is_custom = data.get(f'is_custom_{normal}', False)
            custom_value = data.get(f'custom_{normal}', '')

            if (
                f'is_custom_{normal}' in data
                or f'custom_{normal}' in data
                or normal in data
            ):
                if is_custom and not custom_value:
                    raise serializers.ValidationError({
                        f'custom_{normal}':
                        f"Custom {normal.replace('_', ' ').title()} is required when custom is selected"
                    })

                if not is_custom and normal not in data and not self.instance:
                    raise serializers.ValidationError({
                        normal:
                        f"{normal.replace('_', ' ').title()} is required"
                    })

        return data

    @transaction.atomic
    def create(self, validated_data):
        related_products = validated_data.pop('related_products', [])

        product = Product.objects.create(
            **validated_data,
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user
        )

        product.related_products.set(related_products)

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        related_products = validated_data.pop('related_products', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.save()

        if related_products is not None:
            instance.related_products.set(related_products)

        return instance

    def get_created_by(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None

    def get_updated_by(self, obj):
        return obj.updated_by.get_full_name() if obj.updated_by else None
