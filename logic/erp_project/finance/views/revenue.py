from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.paginator import Paginator

from core.permissions import RoleBasedPermission
from core.utils import validation_error_response

from ..models.revenue import (
    Revenue, RevenueLineItem, RevenueAttachment,
    RevenueComment, RevenueHistory
)
from ..serializers.revenue import (
    RevenueSerializer, RevenueWriteSerializer,
    RevenueAttachmentSerializer, RevenueCommentSerializer,
    RevenueHistorySerializer, RevenueLineItemSerializer
)


# --- Revenue ---
class RevenueListCreateView(generics.ListCreateAPIView):
    queryset = Revenue.objects.select_related(
        'customer', 'invoice', 'sales_order', 'branch', 'created_by', 'updated_by'
    ).order_by('-created_at')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return RevenueWriteSerializer
        return RevenueSerializer

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
            "message": "Revenues fetched successfully",
            "data": {
                "from": from_count,
                "to": to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data": serializer.data
            }
        })

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return validation_error_response(serializer)

        revenue_obj = serializer.save()
        return Response({
            "message": "Revenue created successfully",
            "data": RevenueSerializer(revenue_obj).data
        }, status=status.HTTP_201_CREATED)


class RevenueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Revenue.objects.all()
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RevenueSerializer
        return RevenueWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Revenue fetched successfully",
            "data": serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})

        if not serializer.is_valid():
            return validation_error_response(serializer)

        self.perform_update(serializer)
        return Response({
            "message": "Revenue updated successfully",
            "data": RevenueSerializer(instance).data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status in ['Posted', 'Approved']:
            return Response(
                {"message": f"Cannot delete a revenue that is already {instance.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        rev_no = instance.revenue_id
        instance.delete()

        return Response({
            "message": f"Revenue {rev_no} deleted successfully"
        }, status=status.HTTP_200_OK)


class RevenueActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        revenue_obj = get_object_or_404(Revenue, pk=pk)
        action = request.data.get('action')

        valid_actions = ['Draft', 'Submitted', 'Approved', 'Posted', 'Cancelled']
        if action not in valid_actions:
            return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        old_status = revenue_obj.status
        revenue_obj.status = action
        revenue_obj.save()

        RevenueHistory.objects.create(
            revenue=revenue_obj,
            event_type=f"Status Change: {action}",
            action_by=request.user,
            details=f"Status changed from {old_status} to {revenue_obj.status}"
        )

        return Response({
            "message": f"Revenue status updated to {action}",
            "status": revenue_obj.status
        })


class RevenueCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        revenue_obj = get_object_or_404(Revenue, pk=pk)
        comments = revenue_obj.comments.all().order_by('-timestamp')
        serializer = RevenueCommentSerializer(comments, many=True)
        return Response({"data": serializer.data})

    def post(self, request, pk):
        revenue_obj = get_object_or_404(Revenue, pk=pk)
        serializer = RevenueCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(revenue=revenue_obj, created_by=request.user)
            return Response({"message": "Comment added", "data": RevenueCommentSerializer(comment).data}, status=201)
        return validation_error_response(serializer)


class RevenueAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        revenue_obj = get_object_or_404(Revenue, pk=pk)
        attachments = revenue_obj.attachments.all()
        serializer = RevenueAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        revenue_obj = get_object_or_404(Revenue, pk=pk)
        serializer = RevenueAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(revenue=revenue_obj, uploaded_by=request.user)

        RevenueHistory.objects.create(
            revenue=revenue_obj,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": RevenueAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        revenue_obj = get_object_or_404(Revenue, pk=pk)
        attachment = get_object_or_404(RevenueAttachment, pk=attach_pk, revenue=revenue_obj)

        file_name = attachment.file.name
        attachment.delete()

        RevenueHistory.objects.create(
            revenue=revenue_obj,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class RevenueHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        revenue_obj = get_object_or_404(Revenue, pk=pk)
        history = revenue_obj.history.all().order_by('-timestamp')
        serializer = RevenueHistorySerializer(history, many=True)
        return Response({"data": serializer.data})
