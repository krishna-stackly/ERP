from django.core.paginator import Paginator

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from masters.models import (
    Category,
    TaxCode,
    UOM,
    Warehouse,
    Size,
    Color,
    ProductSupplier,
)

from masters.serializers import (
    CategorySerializer,
    TaxCodeSerializer,
    UOMSerializer,
    WarehouseSerializer,
    SizeSerializer,
    ColorSerializer,
    ProductSupplierSerializer,
)

from masters.views.pagination import StandardPagination


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by(
        'level',
        'name'
    )

    serializer_class = CategorySerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def get_queryset(self):
        qs = super().get_queryset()

        parent_id = self.request.query_params.get(
            'parent'
        )

        if parent_id:
            qs = qs.filter(parent_id=parent_id)

        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        headers = self.get_success_headers(
            serializer.data
        )

        return Response({
            "message": "Category created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        return Response({
            "message": "Category updated successfully",
            "data": serializer.data
        })


class TaxCodeListCreateView(generics.ListCreateAPIView):
    queryset = TaxCode.objects.all()

    serializer_class = TaxCodeSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    pagination_class = StandardPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page_number = int(
            request.query_params.get('page', 1)
        )

        page_size = int(
            request.query_params.get('limit', 10)
        )

        paginator = Paginator(queryset, page_size)

        page = paginator.get_page(page_number)

        serializer = self.get_serializer(
            page,
            many=True
        )

        from_count = (
            (page.number - 1) * page_size
        ) + 1

        to_count = (
            from_count + len(page.object_list) - 1
            if page.object_list else 0
        )

        return Response({
            "message": "Tax Codes fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_create(serializer)

        instance = serializer.instance

        return Response({
            "message": "Tax Code created successfully",
            "data": TaxCodeSerializer(instance).data
        }, status=status.HTTP_201_CREATED)


class TaxCodeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaxCode.objects.all()

    serializer_class = TaxCodeSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "Tax Code fetched successfully",
            "data": serializer.data
        })

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_update(serializer)

        return Response({
            "message": "Tax Code updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()

        return Response({
            "message": "Tax Code deleted successfully"
        })

class UOMListCreateView(generics.ListCreateAPIView):
    queryset = UOM.objects.all()

    serializer_class = UOMSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    pagination_class = StandardPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page_number = int(
            request.query_params.get('page', 1)
        )

        page_size = int(
            request.query_params.get('limit', 10)
        )

        paginator = Paginator(queryset, page_size)

        page = paginator.get_page(page_number)

        serializer = self.get_serializer(
            page,
            many=True
        )

        from_count = (
            (page.number - 1) * page_size
        ) + 1

        to_count = (
            from_count + len(page.object_list) - 1
            if page.object_list else 0
        )

        return Response({
            "message": "UOMs fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_create(serializer)

        instance = serializer.instance

        return Response({
            "message": "UOM created successfully",
            "data": UOMSerializer(instance).data
        }, status=status.HTTP_201_CREATED)


class UOMDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UOM.objects.all()

    serializer_class = UOMSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "UOM fetched successfully",
            "data": serializer.data
        })

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_update(serializer)

        return Response({
            "message": "UOM updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()

        return Response({
            "message": "UOM deleted successfully"
        })

class WarehouseListCreateView(generics.ListCreateAPIView):
    queryset = Warehouse.objects.all()

    serializer_class = WarehouseSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    pagination_class = StandardPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page_number = int(
            request.query_params.get('page', 1)
        )

        page_size = int(
            request.query_params.get('limit', 10)
        )

        paginator = Paginator(queryset, page_size)

        page = paginator.get_page(page_number)

        serializer = self.get_serializer(
            page,
            many=True
        )

        from_count = (
            (page.number - 1) * page_size
        ) + 1

        to_count = (
            from_count + len(page.object_list) - 1
            if page.object_list else 0
        )

        return Response({
            "message": "Warehouses fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_create(serializer)

        instance = serializer.instance

        return Response({
            "message": "Warehouse created successfully",
            "data": WarehouseSerializer(instance).data
        }, status=status.HTTP_201_CREATED)


class WarehouseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Warehouse.objects.all()

    serializer_class = WarehouseSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "Warehouse fetched successfully",
            "data": serializer.data
        })

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_update(serializer)

        return Response({
            "message": "Warehouse updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()

        return Response({
            "message": "Warehouse deleted successfully"
        })


class SizeListCreateView(generics.ListCreateAPIView):
    queryset = Size.objects.all()

    serializer_class = SizeSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response({
            "message": "Size created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


class SizeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Size.objects.all()

    serializer_class = SizeSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        return Response({
            "message": "Size updated successfully",
            "data": serializer.data
        })


class ColorListCreateView(generics.ListCreateAPIView):
    queryset = Color.objects.all()

    serializer_class = ColorSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response({
            "message": "Color created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


class ColorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Color.objects.all()

    serializer_class = ColorSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        return Response({
            "message": "Color updated successfully",
            "data": serializer.data
        })


class ProductSupplierListCreateView(generics.ListCreateAPIView):
    queryset = ProductSupplier.objects.all()

    serializer_class = ProductSupplierSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    pagination_class = StandardPagination

    def get_queryset(self):
        qs = super().get_queryset()

        search = self.request.query_params.get(
            'search',
            ''
        )

        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(contact_person__icontains=search) |
                Q(email__icontains=search)
            )

        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response({
            "message": "Product Supplier created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


class ProductSupplierDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = ProductSupplier.objects.all()

    serializer_class = ProductSupplierSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        return Response({
            "message": "Product Supplier updated successfully",
            "data": serializer.data
        })
