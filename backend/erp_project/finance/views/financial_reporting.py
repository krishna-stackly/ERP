
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from ..models.financial_reporting import (
    FinancialReport,
    FinancialReportData,
    FinancialLineItem,
    FinancialReportAttachment,
    FinancialReportComment,
    FinancialReportHistory,
)
from ..serializers.financial_reporting import (
    FinancialReportSerializer,
    FinancialReportDataSerializer,
    FinancialLineItemSerializer,
    FinancialReportHistorySerializer,
    FinancialReportCommentSerializer,
    FinancialReportAttachmentSerializer
)


class FinancialReportAPIView(APIView):

    def get(self, request):
        reports = FinancialReport.objects.all().order_by("-id")
        return Response(FinancialReportSerializer(reports, many=True).data)

    def post(self, request):
        serializer = FinancialReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class FinancialReportDetailAPIView(APIView):

    def get_object(self, pk):
        return FinancialReport.objects.get(id=pk)

    def get(self, request, pk):
        return Response(FinancialReportSerializer(self.get_object(pk)).data)

    def put(self, request, pk):
        report = self.get_object(pk)
        serializer = FinancialReportSerializer(report, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        report = self.get_object(pk)

        FinancialReportHistory.objects.create(
            report=report,
            action="Deleted",
            performed_by="System"
        )

        report.delete()
        return Response({"message": "Deleted"})

class FinancialReportActionView(APIView):

    def post(self, request, pk):
        report = get_object_or_404(FinancialReport, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'approve', 'posted', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = report.status

        if action == 'save_draft':
            report.status = 'draft'
            message = "Saved as draft"
        elif action == 'submit':
            report.status = 'submitted'
            message = "Submitted successfully"
        elif action == 'approve':
            report.status = 'approved'
            report.approved_by = request.user
            message = "Approved successfully"
        elif action == 'posted':
            report.status = 'posted'
            message = "Marked as posted"
        elif action == 'cancel':
            report.status = 'cancelled'
            message = "Cancelled successfully"

        report.save()

        FinancialReportHistory.objects.create(
            report=report,
            action=f"Status changed from {old_status} to {report.status}",
            performed_by="System"
        )

        return Response({
            "message": "Status updated successfully",
            "status":report.status
        })

class FinancialReportAttachmentAPIView(APIView):

    def get(self, request, report_id):
        data = FinancialReportAttachment.objects.filter(report_id=report_id).order_by("-id")
        return Response(FinancialReportAttachmentSerializer(data, many=True).data)

    def post(self, request, report_id):
        req = request.data.copy()
        req["report"] = report_id

        serializer = FinancialReportAttachmentSerializer(data=req)
        if serializer.is_valid():
            serializer.save()

            FinancialReportHistory.objects.create(
                report_id=report_id,
                action="Attachment Added",
                performed_by="System"
            )

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def delete(self, request, report_id):
        obj = FinancialReportAttachment.objects.get(id=request.data.get("id"), report_id=report_id)
        obj.delete()

        FinancialReportHistory.objects.create(
            report_id=report_id,
            action="Attachment Deleted",
            performed_by="System"
        )

        return Response({"message": "Deleted"})
    

class FinancialReportCommentAPIView(APIView):

    def get(self, request, report_id):
        data = FinancialReportComment.objects.filter(report_id=report_id).order_by("-id")
        return Response(FinancialReportCommentSerializer(data, many=True).data)

    def post(self, request, report_id):
        req = request.data.copy()
        req["report"] = report_id

        serializer = FinancialReportCommentSerializer(data=req)
        if serializer.is_valid():
            serializer.save(report_id=report_id)

            FinancialReportHistory.objects.create(
                report_id=report_id,
                action="Comment Added",
                performed_by="System"
            )

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def delete(self, request, report_id):
        obj = FinancialReportComment.objects.get(id=request.data.get("id"), report_id=report_id)
        obj.delete()

        FinancialReportHistory.objects.create(
            report_id=report_id,
            action="Comment Deleted",
            performed_by="System"
        )

        return Response({"message": "Deleted"})


class FinancialReportHistoryAPIView(APIView):

    def get(self, request, report_id):
        data = FinancialReportHistory.objects.filter(report_id=report_id).order_by("-timestamp")
        return Response(FinancialReportHistorySerializer(data, many=True).data)

    def post(self, request, report_id):
        req = request.data.copy()
        req["report"] = report_id

        serializer = FinancialReportHistorySerializer(data=req)
        if serializer.is_valid():
            serializer.save(report_id=report_id)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def delete(self, request, report_id):
        obj = FinancialReportHistory.objects.get(id=request.data.get("id"), report_id=report_id)
        obj.delete()
        return Response({"message": "Deleted"})    