from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.core.paginator import Paginator

from core.permissions import RoleBasedPermission

from crm.models.enquiry_models import Enquiry
from crm.serializers.enquiry_serializers import (
    EnquirySerializer,
    EnquiryWriteSerializer,
)


class EnquiryListCreateView(generics.ListCreateAPIView):
    queryset = Enquiry.objects.select_related('user').order_by('-created_at')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EnquirySerializer
        return EnquiryWriteSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or user.role.role.lower() == 'admin':
            return Enquiry.objects.all().order_by('-created_at')

        return Enquiry.objects.filter(user=user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('limit', 10))

        paginator = Paginator(queryset, page_size)
        page = paginator.get_page(page_number)

        serializer = self.get_serializer(page, many=True)

        from_count = (page.number - 1) * page_size + 1
        to_count = from_count + len(page.object_list) - 1 if page.object_list else 0

        if not page.object_list:
            return Response({
                "message": "No Data Found",
                "data": {
                    "from": 0,
                    "to": 0,
                    "totalCount": 0,
                    "totalPages": 0,
                    "data": []
                }
            })

        return Response({
            "message": "Enquiries fetched successfully",
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
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=400)

        self.perform_create(serializer)

        detail_serializer = EnquirySerializer(
            serializer.instance,
            context={'request': request}
        )

        return Response({
            "message": "Enquiry created successfully",
            "data": detail_serializer.data
        }, status=status.HTTP_201_CREATED)


class EnquiryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Enquiry.objects.select_related('user')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EnquirySerializer
        return EnquiryWriteSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or user.role.role.lower() == 'admin':
            return Enquiry.objects.all()

        return Enquiry.objects.filter(user=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response({
            "message": "Enquiry fetched successfully",
            "data": serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=400)

        self.perform_update(serializer)

        return Response({
            "message": "Enquiry updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response({
            "message": "Enquiry deleted successfully"
        })
