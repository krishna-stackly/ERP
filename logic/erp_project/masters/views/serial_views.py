from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import RoleBasedPermission

from masters.models import (
    Branch,
    Department,
    Role,
    Category,
    TaxCode,
    UOM,
    Warehouse,
    Size,
    Color,
    ProductSupplier,
)

from masters.serializers import (
    BranchSerializer,
    DepartmentDropdownSerializer,
    RoleReadSerializer,
    CategorySerializer,
    TaxCodeSerializer,
    UOMSerializer,
    WarehouseSerializer,
    SizeSerializer,
    ColorSerializer,
    ProductSupplierSerializer,
)


class MasterDropdownDataView(APIView):
    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def get(self, request):
        return Response({
            "branches": BranchSerializer(
                Branch.objects.filter(is_active=True),
                many=True
            ).data,

            "departments": DepartmentDropdownSerializer(
                Department.objects.filter(is_active=True),
                many=True
            ).data,

            "roles": RoleReadSerializer(
                Role.objects.filter(is_active=True),
                many=True
            ).data,

            "categories": CategorySerializer(
                Category.objects.filter(is_active=True),
                many=True
            ).data,

            "tax_codes": TaxCodeSerializer(
                TaxCode.objects.filter(is_active=True),
                many=True
            ).data,

            "uoms": UOMSerializer(
                UOM.objects.filter(is_active=True),
                many=True
            ).data,

            "warehouses": WarehouseSerializer(
                Warehouse.objects.filter(is_active=True),
                many=True
            ).data,

            "sizes": SizeSerializer(
                Size.objects.filter(is_active=True),
                many=True
            ).data,

            "colors": ColorSerializer(
                Color.objects.filter(is_active=True),
                many=True
            ).data,

            "product_suppliers": ProductSupplierSerializer(
                ProductSupplier.objects.filter(
                    is_active=True
                ),
                many=True
            ).data
        })
