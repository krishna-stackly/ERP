from django.core.paginator import Paginator

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from masters.models import Branch
from masters.serializers.department_roles_serializers import BranchSerializer

from masters.views.pagination import StandardPagination


class BranchListCreateView(generics.ListCreateAPIView):
    queryset = Branch.objects.all()

    serializer_class = BranchSerializer

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
            "message": "Branches fetched successfully",
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

        return Response({
            "message": "Branch created successfully"
        }, status=status.HTTP_201_CREATED)


class BranchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Branch.objects.all()

    serializer_class = BranchSerializer

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "Branch fetched successfully",
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
            "message": "Branch updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()

        return Response({
            "message": "Branch deleted successfully"
        })
