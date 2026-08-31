from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.paginator import Paginator
from django.db import transaction
from django.shortcuts import get_object_or_404

from ..models.asset_maintenance import (
    Technician,
    AssetMaintenance,
    AssetMaintenanceAttachment,
    AssetMaintenanceHistory,
)
from ..serializers.asset_maintenance import (
    TechnicianSerializer,
    AssetMaintenanceSerializer,
    AssetMaintenanceWriteSerializer,
    AssetMaintenanceAttachmentSerializer,
    AssetMaintenanceCommentSerializer,
    AssetMaintenanceHistorySerializer,
)
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response


# ─────────────────────────────────────────────────────────────────────────────
# TECHNICIAN — LIST + CREATE
# ─────────────────────────────────────────────────────────────────────────────

class TechnicianListCreateView(generics.ListCreateAPIView):
    queryset           = Technician.objects.all().order_by('-id')
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    serializer_class   = TechnicianSerializer

    def list(self, request, *args, **kwargs):
        queryset   = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "message": "Technicians fetched successfully",
            "data": serializer.data
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        technician = serializer.save()
        return Response({
            "message": "Technician created successfully",
            "data": TechnicianSerializer(technician).data
        }, status=status.HTTP_201_CREATED)
            
# ─────────────────────────────────────────────────────────────────────────────
# TECHNICIAN — RETRIEVE + UPDATE + DELETE
# ─────────────────────────────────────────────────────────────────────────────

class TechnicianDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Technician.objects.all()
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    serializer_class   = TechnicianSerializer
    lookup_field       = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance   = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Technician fetched successfully",
            "data": serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial    = kwargs.pop('partial', True)
        instance   = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        if not serializer.is_valid():
            return validation_error_response(serializer)
        self.perform_update(serializer)
        return Response({
            "message": "Technician updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"message": "Technician deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ─────────────────────────────────────────────────────────────────────────────
# ASSET MAINTENANCE — LIST + CREATE
# ─────────────────────────────────────────────────────────────────────────────

class AssetMaintenanceListCreateView(generics.ListCreateAPIView):
    queryset = AssetMaintenance.objects.select_related(
        'assigned_technician'
    ).order_by('-id')
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AssetMaintenanceWriteSerializer
        return AssetMaintenanceSerializer

    def list(self, request, *args, **kwargs):
        queryset    = self.filter_queryset(self.get_queryset())
        page_number = int(request.query_params.get('page', 1))
        page_size   = int(request.query_params.get('limit', 10))
        paginator   = Paginator(queryset, page_size)
        page        = paginator.get_page(page_number)
        serializer  = self.get_serializer(page, many=True)
        from_count  = (page.number - 1) * page_size + 1
        to_count    = from_count + len(page.object_list) - 1 if page.object_list else 0
        return Response({
            "message": "Asset Maintenance records fetched successfully",
            "data": {
                "from":       from_count,
                "to":         to_count,
                "totalCount": paginator.count,
                "totalPages": paginator.num_pages,
                "data":       serializer.data
            }
        })

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)
        maintenance = serializer.save()
        return Response({
            "message": "Asset Maintenance record created successfully",
            "data": AssetMaintenanceSerializer(maintenance).data
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────────────────────────────────────
# ASSET MAINTENANCE — RETRIEVE + UPDATE + DELETE
# ─────────────────────────────────────────────────────────────────────────────

class AssetMaintenanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AssetMaintenance.objects.select_related(
        'assigned_technician'
    )
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AssetMaintenanceSerializer
        return AssetMaintenanceWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance   = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "message": "Asset Maintenance record fetched successfully",
            "data": serializer.data
        })

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial    = kwargs.pop('partial', True)
        instance   = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        if not serializer.is_valid():
            return validation_error_response(serializer)
        self.perform_update(serializer)
        return Response({
            "message": "Asset Maintenance record updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"message": "Asset Maintenance record deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ─────────────────────────────────────────────────────────────────────────────
# ACTION VIEW  (status transitions)
# ─────────────────────────────────────────────────────────────────────────────

class AssetMaintenanceActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        maintenance = get_object_or_404(AssetMaintenance, pk=pk)
        action      = request.data.get('action')

        if action not in ['mark_planned', 'mark_in_progress', 'mark_completed', 'mark_overdue']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = maintenance.status

        if action == 'mark_planned':
            maintenance.status = 'Planned'
            message = "Asset Maintenance marked as Planned"

        elif action == 'mark_in_progress':
            maintenance.status = 'In Progress'
            message = "Asset Maintenance marked as In Progress"

        elif action == 'mark_completed':
            maintenance.status = 'Completed'
            message = "Asset Maintenance marked as Completed"

        elif action == 'mark_overdue':
            maintenance.status = 'Overdue'
            message = "Asset Maintenance marked as Overdue"

        maintenance.save()

        AssetMaintenanceHistory.objects.create(
            asset_maintenance=maintenance,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {maintenance.status}"
        )

        return Response({"message": message})


# ─────────────────────────────────────────────────────────────────────────────
# COMMENT VIEW
# ─────────────────────────────────────────────────────────────────────────────

class AssetMaintenanceCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        maintenance = get_object_or_404(AssetMaintenance, pk=pk)
        comments    = maintenance.comments.all().order_by('-timestamp')
        serializer  = AssetMaintenanceCommentSerializer(comments, many=True)
        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        maintenance = get_object_or_404(AssetMaintenance, pk=pk)
        serializer  = AssetMaintenanceCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            asset_maintenance=maintenance,
            created_by=request.user
        )

        AssetMaintenanceHistory.objects.create(
            asset_maintenance=maintenance,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": AssetMaintenanceCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────────────────────────────────────
# ATTACHMENT VIEW
# ─────────────────────────────────────────────────────────────────────────────

class AssetMaintenanceAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes     = (MultiPartParser, FormParser)

    def get(self, request, pk):
        maintenance = get_object_or_404(AssetMaintenance, pk=pk)
        attachments = maintenance.attachments.all()
        serializer  = AssetMaintenanceAttachmentSerializer(attachments, many=True)
        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        maintenance = get_object_or_404(AssetMaintenance, pk=pk)
        serializer  = AssetMaintenanceAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            asset_maintenance=maintenance,
            uploaded_by=request.user
        )

        AssetMaintenanceHistory.objects.create(
            asset_maintenance=maintenance,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": AssetMaintenanceAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        maintenance = get_object_or_404(AssetMaintenance, pk=pk)
        attachment  = get_object_or_404(
            AssetMaintenanceAttachment,
            pk=attach_pk,
            asset_maintenance=maintenance
        )
        file_name = attachment.file.name
        attachment.delete()

        AssetMaintenanceHistory.objects.create(
            asset_maintenance=maintenance,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response(
            {"message": "Attachment deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# ─────────────────────────────────────────────────────────────────────────────
# HISTORY VIEW
# ─────────────────────────────────────────────────────────────────────────────

class AssetMaintenanceHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        maintenance = get_object_or_404(AssetMaintenance, pk=pk)
        history     = maintenance.history.all().order_by('-timestamp')
        serializer  = AssetMaintenanceHistorySerializer(history, many=True)
        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })