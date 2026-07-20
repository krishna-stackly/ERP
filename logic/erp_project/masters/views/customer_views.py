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

from masters.models import Customer
from masters.serializers import CustomerSerializer
from masters.views.pagination import StandardPagination


class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.all().order_by('-last_edit_date')
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    pagination_class = StandardPagination

    def get_queryset(self):
        qs = super().get_queryset()

        status_value = self.request.query_params.get('status')
        if status_value and status_value != 'All':
            qs = qs.filter(status=status_value)

        customer_type = self.request.query_params.get('customer_type')
        if customer_type and customer_type != 'All':
            qs = qs.filter(customer_type=customer_type)

        sales_rep = self.request.query_params.get('assigned_sales_rep')
        if sales_rep:
            qs = qs.filter(assigned_sales_rep_id=sales_rep)

        search = self.request.query_params.get('search', '').strip()
        if search:
            terms = [term.strip() for term in search.split() if term.strip()]
            for term in terms:
                qs = qs.filter(
                    Q(first_name__icontains=term) |
                    Q(last_name__icontains=term) |
                    Q(email__icontains=term) |
                    Q(phone_number__icontains=term) |
                    Q(company_name__icontains=term) |
                    Q(customer_id__icontains=term)
                )

        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('limit', 10))

        paginator = Paginator(queryset, page_size)
        page = paginator.get_page(page_number)

        serializer = self.get_serializer(page, many=True)

        from_count = (page.number - 1) * page_size + 1
        to_count = from_count + len(page.object_list) - 1 if page.object_list else 0

        return Response({
            "message": "Customers fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_create(serializer)

        return Response({
            "message": "Customer created successfully",
            "data": CustomerSerializer(serializer.instance).data
        }, status=status.HTTP_201_CREATED)


class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        return Response({
            "message": "Customer fetched successfully",
            "data": CustomerSerializer(instance).data
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
            "message": "Customer updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Customer deleted successfully"
        })


class CustomerImportView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request):
        file = request.FILES.get('file')

        if not file:
            return Response({
                'error': 'No file uploaded'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            if file.name.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.name.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file)
            else:
                return Response({
                    'error': 'Unsupported file format. Use CSV or Excel'
                }, status=400)
        except Exception as error:
            return Response({
                'error': f'File read error: {str(error)}'
            }, status=400)

        required_columns = [
            'first_name',
            'email',
            'phone_number',
            'customer_type',
            'status'
        ]

        missing = [
            column for column in required_columns
            if column not in df.columns
        ]

        if missing:
            return Response({
                'error': f'Missing required columns: {", ".join(missing)}'
            }, status=400)

        valid_rows = []
        invalid_rows = []
        skipped_rows = []
        seen_emails = set()

        for index, row in df.iterrows():
            row_dict = row.to_dict()

            if all(pd.isna(value) or value == '' for value in row_dict.values()):
                skipped_rows.append(index + 1)
                continue

            missing_in_row = [
                column for column in required_columns
                if pd.isna(row_dict.get(column)) or row_dict.get(column) == ''
            ]

            if missing_in_row:
                invalid_rows.append({
                    'row': index + 1,
                    'errors': [f"{column} is required" for column in missing_in_row]
                })
                continue

            email = str(row_dict.get('email', '')).strip()

            if not email:
                invalid_rows.append({
                    'row': index + 1,
                    'errors': ['Email is required']
                })
                continue

            if email in seen_emails or Customer.objects.filter(email=email).exists():
                skipped_rows.append(index + 1)
                continue

            seen_emails.add(email)

            data = {
                'first_name': row_dict.get('first_name', ''),
                'last_name': row_dict.get('last_name', ''),
                'customer_type': row_dict.get('customer_type', ''),
                'email': email,
                'phone_number': str(row_dict.get('phone_number', '')),
                'status': row_dict.get('status', 'Active'),
                'address': row_dict.get('address', ''),
                'street': row_dict.get('street', ''),
                'city': row_dict.get('city', ''),
                'state': row_dict.get('state', ''),
                'zip_code': row_dict.get('zip_code', ''),
                'country': row_dict.get('country', 'India'),
                'company_name': row_dict.get('company_name', ''),
                'industry': row_dict.get('industry', ''),
                'location': row_dict.get('location', ''),
                'gst_tax_id': row_dict.get('gst_tax_id', ''),
                'credit_limit': float(row_dict.get('credit_limit', 0.00)),
                'billing_address': row_dict.get('billing_address', ''),
                'shipping_address': row_dict.get('shipping_address', ''),
                'payment_terms': row_dict.get('payment_terms', ''),
                'credit_term': row_dict.get('credit_term', ''),
            }

            serializer = CustomerSerializer(
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
            'skipped_rows': skipped_rows,
            'message': 'Validation complete. Click Import to save valid rows.'
        }, status=status.HTTP_200_OK)


class CustomerImportConfirmView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request):
        valid_rows = request.data.get('valid_rows', [])

        if not valid_rows:
            return Response({
                'error': 'No valid rows to import'
            }, status=400)

        created = []
        errors = []

        for row in valid_rows:
            serializer = CustomerSerializer(
                data=row,
                context={'request': request}
            )

            if serializer.is_valid():
                customer = serializer.save()
                created.append(CustomerSerializer(customer).data)
            else:
                errors.append(serializer.errors)

        return Response({
            'created_count': len(created),
            'error_count': len(errors),
            'created': created,
            'errors': errors,
            'message': 'Import complete. Review billing and shipping addresses.'
        }, status=status.HTTP_201_CREATED)
