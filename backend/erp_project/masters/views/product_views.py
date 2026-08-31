import pandas as pd

from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Q

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from masters.models import Product

from masters.serializers import (
    ProductSerializer,
)

from masters.views.pagination import StandardPagination


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.select_related(
        'category',
        'tax_code',
        'uom',
        'warehouse',
        'size',
        'color',
        'supplier'
    ).prefetch_related('related_products')

    serializer_class = ProductSerializer

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
        ).strip()

        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(product_id__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search) |
                Q(supplier__name__icontains=search)
            )

        return qs

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
            "message": "Products fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_create(serializer)

        instance = serializer.instance

        return Response({
            "message": "Product created successfully",
            "data": ProductSerializer(instance).data
        }, status=status.HTTP_201_CREATED)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related(
        'category',
        'tax_code',
        'uom',
        'warehouse',
        'size',
        'color',
        'supplier'
    ).prefetch_related('related_products')

    serializer_class = ProductSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "Product fetched successfully",
            "data": serializer.data
        })

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
            "message": "Product updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()

        return Response({
            "message": "Product deleted successfully"
        })


class ProductImportView(APIView):
    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def post(self, request):
        file = request.FILES.get('file')

        if not file:
            return Response(
                {'error': 'No file uploaded'},
                status=400
            )

        try:
            if file.name.endswith('.csv'):
                df = pd.read_csv(file)

            elif file.name.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file)

            else:
                return Response(
                    {'error': 'Unsupported file format'},
                    status=400
                )

        except Exception as e:
            return Response(
                {'error': f'File read error: {str(e)}'},
                status=400
            )

        required = [
            'name',
            'product_type',
            'unit_price',
            'quantity',
            'stock_level',
            'status',
            'product_usage'
        ]

        missing = [
            col for col in required
            if col not in df.columns
        ]

        if missing:
            return Response({
                'error': f'Missing columns: {", ".join(missing)}'
            }, status=400)

        valid_rows = []
        invalid_rows = []
        skipped_rows = []

        seen_names = set()

        for index, row in df.iterrows():
            row_dict = row.to_dict()

            if all(
                pd.isna(v) or v == ''
                for v in row_dict.values()
            ):
                skipped_rows.append(index + 1)
                continue

            missing_in_row = [
                col for col in required
                if pd.isna(row_dict.get(col))
                or row_dict.get(col) == ''
            ]

            if missing_in_row:
                invalid_rows.append({
                    'row': index + 1,
                    'errors': [
                        f"{col} is required"
                        for col in missing_in_row
                    ]
                })
                continue

            name = str(
                row_dict.get('name', '')
            ).strip()

            if name in seen_names:
                skipped_rows.append(index + 1)
                continue

            seen_names.add(name)

            data = {
                'name': name,
                'product_type': row_dict.get(
                    'product_type',
                    ''
                ),
                'description': row_dict.get(
                    'description',
                    ''
                ),
                'unit_price': float(
                    row_dict.get('unit_price', 0)
                ),
                'discount': float(
                    row_dict.get('discount', 0)
                ),
                'quantity': int(
                    row_dict.get('quantity', 0)
                ),
                'stock_level': int(
                    row_dict.get('stock_level', 0)
                ),
                'reorder_level': int(
                    row_dict.get('reorder_level', 0)
                ),
                'weight': row_dict.get(
                    'weight',
                    ''
                ),
                'specifications': row_dict.get(
                    'specifications',
                    ''
                ),
                'status': row_dict.get(
                    'status',
                    'Active'
                ),
                'product_usage': row_dict.get(
                    'product_usage',
                    'Both'
                ),
                'category': row_dict.get(
                    'category',
                    None
                ),
                'tax_code': row_dict.get(
                    'tax_code',
                    None
                ),
                'uom': row_dict.get(
                    'uom',
                    None
                ),
                'warehouse': row_dict.get(
                    'warehouse',
                    None
                ),
                'size': row_dict.get(
                    'size',
                    None
                ),
                'color': row_dict.get(
                    'color',
                    None
                ),
                'supplier': row_dict.get(
                    'supplier',
                    None
                ),
            }

            serializer = ProductSerializer(
                data=data,
                context={'request': request}
            )

            if serializer.is_valid():
                valid_rows.append(data)

            else:
                invalid_rows.append({
                    'row': index + 1,
                    'errors': serializer.errors
                })

        return Response({
            'valid_count': len(valid_rows),
            'invalid_count': len(invalid_rows),
            'skipped_count': len(skipped_rows),
            'valid_rows': valid_rows,
            'invalid_rows': invalid_rows,
            'message': 'Validation complete. Click Import to save valid rows.'
        }, status=200)


class ProductImportConfirmView(APIView):
    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    @transaction.atomic
    def post(self, request):
        valid_rows = request.data.get(
            'valid_rows',
            []
        )

        if not valid_rows:
            return Response({
                'error': 'No valid rows'
            }, status=400)

        created = []
        errors = []

        for row in valid_rows:
            serializer = ProductSerializer(
                data=row,
                context={'request': request}
            )

            if serializer.is_valid():
                product = serializer.save()

                created.append(
                    ProductSerializer(product).data
                )

            else:
                errors.append(serializer.errors)

        return Response({
            'created_count': len(created),
            'error_count': len(errors),
            'created': created,
            'errors': errors,
            'message': 'Import complete. Review product data.'
        }, status=201)
