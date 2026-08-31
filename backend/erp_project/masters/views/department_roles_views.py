from django.core.paginator import Paginator
from django.db.models import Q

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from masters.models import Department
from masters.models import Role
from masters.serializers import RoleReadSerializer

from masters.serializers.department_roles_serializers import (
    DepartmentListSerializer,
    DepartmentDetailSerializer,
    DepartmentCreateWithRolesSerializer,
    DepartmentUpdateWithRolesSerializer,
    DepartmentDropdownSerializer,
)

from masters.views.pagination import StandardPagination


class DepartmentListView(generics.ListAPIView):
    serializer_class = DepartmentListSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    pagination_class = StandardPagination

    def get_queryset(self):
        qs = Department.objects.select_related(
            'branch'
        ).all()

        branch_id = self.request.query_params.get(
            'branch'
        )

        search = self.request.query_params.get(
            'search'
        )

        dropdown = (
            self.request.query_params.get(
                'dropdown',
                'false'
            ).lower() == 'true'
        )

        if branch_id:
            qs = qs.filter(branch_id=branch_id)

        if search:
            qs = qs.filter(
                Q(code__icontains=search) |
                Q(department_name__icontains=search)
            )

        self.dropdown_mode = dropdown

        return qs

    def get_serializer_class(self):
        if getattr(self, 'dropdown_mode', False):
            return DepartmentDropdownSerializer

        return DepartmentListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        context['include_roles'] = (
            self.request.query_params.get(
                'include_roles',
                'true'
            ).lower() == 'true'
        )

        return context

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset()
        ).order_by('-id')

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
            "message": "Departments fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })


class DepartmentCreateView(generics.CreateAPIView):
    serializer_class = DepartmentCreateWithRolesSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_create(serializer)

        instance = serializer.instance

        return Response({
            "message": "Department created successfully",
            "data": DepartmentDetailSerializer(instance).data
        }, status=status.HTTP_201_CREATED)


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.select_related(
        'branch'
    ).all()

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return DepartmentUpdateWithRolesSerializer

        return DepartmentDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "Department fetched successfully",
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
            "message": "Department updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()

        return Response({
            "message": "Department deleted successfully"
        })



class RoleListView(generics.ListAPIView):
    serializer_class = RoleReadSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    pagination_class = StandardPagination

    def get_queryset(self):
        qs = Role.objects.select_related(
            'department',
            'branch'
        ).all()

        department_id = self.request.query_params.get(
            'department'
        )

        if department_id:
            qs = qs.filter(
                department_id=department_id
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
            "message": "Roles fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })


class RoleDetailView(generics.RetrieveAPIView):
    queryset = Role.objects.select_related(
        'department',
        'branch'
    ).all()

    serializer_class = RoleReadSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "Role fetched successfully",
            "data": serializer.data
        })
