import logging

from django.conf import settings
from django.core.mail import EmailMessage
from django.core.paginator import Paginator
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from masters.models import CustomUser

from masters.serializers.user_serializers import (
    CustomUserCreateSerializer,
    CustomUserDetailSerializer,
    CustomUserUpdateSerializer,
)

from masters.views.pagination import StandardPagination

logger = logging.getLogger(__name__)


class ManageUsersListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    pagination_class = StandardPagination

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CustomUserCreateSerializer
        return CustomUserDetailSerializer

    def get_queryset(self):
        qs = CustomUser.objects.select_related(
            'branch',
            'department',
            'role'
        ).order_by('id')

        search = self.request.query_params.get(
            'search',
            ''
        ).strip()

        if search:
            qs = qs.filter(
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(employee_id__icontains=search) |
                Q(role__role__icontains=search) |
                Q(department__department_name__icontains=search) |
                Q(branch__name__icontains=search)
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
            "message": "Users fetched successfully",
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
            errors = serializer.errors

            first_error = None

            for field, messages in errors.items():
                if isinstance(messages, list):
                    first_error = messages[0]
                else:
                    first_error = str(messages)
                break

            return Response(
                {"error": first_error},
                status=status.HTTP_400_BAD_REQUEST
            )

        self.perform_create(serializer)

        instance = serializer.instance

        password = get_random_string(
            length=8,
            allowed_chars='abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
        )

        instance.set_password(password)

        instance.save(update_fields=['password'])

        context = {
            'first_name': instance.first_name or "User",
            'email': instance.email,
            'password': password,
            'site_name': 'Stackly ERP',
            'site_link': settings.FRONTEND_URL.rstrip('/') + '/signin',
            'expiry_hours': 24,
        }

        subject = 'Welcome to Stackly ERP - Your Account Credentials'

        html_message = render_to_string(
            'emails/user_registration.html',
            context
        )

        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[instance.email],
        )

        email.content_subtype = 'html'

        try:
            email.send(fail_silently=False)

            logger.info(
                f"Welcome email sent successfully to {instance.email}"
            )

        except Exception as e:
            logger.error(
                f"Failed to send welcome email to {instance.email}: {str(e)}"
            )

        return Response({
            "message": "User created successfully",
            "data": CustomUserDetailSerializer(instance).data
        }, status=status.HTTP_201_CREATED)


class ManageUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()

    permission_classes = [
        IsAuthenticated,
        RoleBasedPermission
    ]

    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CustomUserUpdateSerializer

        return CustomUserDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            "message": "User fetched successfully",
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
            "message": "User updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_superuser:
            return Response(
                {"message": "Superuser cannot be deleted."},
                status=status.HTTP_403_FORBIDDEN
            )

        if instance == request.user:
            return Response(
                {"message": "You cannot delete your own account."},
                status=status.HTTP_403_FORBIDDEN
            )

        instance.delete()

        return Response({
            "message": "User deleted successfully"
        })
