from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from fuzzywuzzy import fuzz

from core.permissions import RoleBasedPermission

from masters.models import Customer
from masters.serializers import CustomerSerializer


class CustomerDuplicatesListView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request):
        customers = Customer.objects.filter(
            is_active=True
        ).select_related('assigned_sales_rep')

        duplicate_groups = []
        name_groups = {}

        for customer in customers:
            full_name = (
                f"{customer.first_name} {customer.last_name or ''}"
                .strip()
                .lower()
            )

            company = (customer.company_name or "").strip().lower()

            key = full_name if full_name else company

            if not key:
                continue

            found = False

            for existing_key, group in name_groups.items():
                similarity = fuzz.token_sort_ratio(key, existing_key)

                if similarity > 85:
                    group.append(customer)
                    found = True
                    break

            if not found:
                name_groups[key] = [customer]

        for group in name_groups.values():
            if len(group) > 1:
                primary = group[0]
                duplicates = group[1:]

                duplicate_groups.append({
                    'primary': CustomerSerializer(primary).data,
                    'duplicates': CustomerSerializer(duplicates, many=True).data,
                    'matching_fields': ['Name', 'Company Name'],
                    'potential_conflicts': [
                        'Email',
                        'Phone',
                        'Address',
                        'GST ID'
                    ]
                })

        return Response({
            'duplicate_groups': duplicate_groups,
            'total_groups': len(duplicate_groups),
            'message': 'Potential duplicates based on name/company similarity'
        }, status=200)


class CustomerMergeReviewView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request):
        primary_id = request.data.get('primary_id')
        duplicate_ids = request.data.get('duplicate_ids', [])

        if not primary_id or not duplicate_ids:
            return Response({
                'error': 'Primary ID and at least one duplicate ID required'
            }, status=400)

        try:
            primary = Customer.objects.get(id=primary_id)
            duplicates = Customer.objects.filter(id__in=duplicate_ids)

            if not duplicates.exists():
                return Response({
                    'error': 'No valid duplicates found'
                }, status=400)

            fields_to_compare = [
                'first_name',
                'last_name',
                'email',
                'phone_number',
                'company_name',
                'address',
                'street',
                'city',
                'state',
                'zip_code',
                'country',
                'gst_tax_id',
                'credit_limit',
                'billing_address',
                'shipping_address',
            ]

            comparison = []

            for field in fields_to_compare:
                primary_value = getattr(primary, field, None)
                duplicate_values = [
                    getattr(duplicate, field, None)
                    for duplicate in duplicates
                ]

                conflict = (
                    len(set([value for value in duplicate_values if value is not None])) > 1
                    or primary_value != duplicate_values[0]
                    if duplicate_values else False
                )

                comparison.append({
                    'field': field.replace('_', ' ').title(),
                    'primary_value': primary_value,
                    'duplicate_values': duplicate_values,
                    'conflict': conflict
                })

            return Response({
                'primary': CustomerSerializer(primary).data,
                'duplicates': CustomerSerializer(duplicates, many=True).data,
                'comparison': comparison
            }, status=200)

        except Customer.DoesNotExist:
            return Response({
                'error': 'Primary or duplicate not found'
            }, status=404)


class CustomerMergeConfirmView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    @transaction.atomic
    def post(self, request):
        primary_id = request.data.get('primary_id')
        duplicate_ids = request.data.get('duplicate_ids', [])
        field_choices = request.data.get('field_choices', {})

        if not primary_id or not duplicate_ids:
            return Response({
                'error': 'Primary ID and duplicate IDs required'
            }, status=400)

        try:
            primary = Customer.objects.get(id=primary_id)
            duplicates = Customer.objects.filter(id__in=duplicate_ids)

            if not duplicates.exists():
                return Response({
                    'error': 'No valid duplicates'
                }, status=400)

            for field, choice in field_choices.items():
                if choice == 'left':
                    value = getattr(primary, field)
                else:
                    value = getattr(duplicates.first(), field)

                setattr(primary, field, value)

            primary.save()
            duplicates.delete()

            return Response({
                'message': 'Merge successful',
                'primary': CustomerSerializer(primary).data
            }, status=200)

        except Customer.DoesNotExist:
            return Response({
                'error': 'Primary or duplicate not found'
            }, status=404)
