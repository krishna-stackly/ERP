

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models.cashflow import *
from ..serializers.cashflow import *

class CashFlowListCreateView(generics.ListCreateAPIView):
    queryset = CashFlow.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CashFlowWriteSerializer
        return CashFlowDetailSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response({
            "message": "Cashflow list fetched successfully",
            "data": serializer.data
        })
    
class CashFlowDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CashFlow.objects.all().prefetch_related(
    "comments",
    "attachments",
    "history",
    "line_items"
)

    def get_serializer_class(self):
        
        if self.request.method == "GET":
            return CashFlowDetailSerializer
        return CashFlowWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response({
            "message": "Cashflow fetched successfully",
            "data": serializer.data
        })
class CashFlowActionView(APIView):

    def post(self, request, pk):
        cf = get_object_or_404(CashFlow, pk=pk)
        action = request.data.get('action')

        ACTION_STATUS_MAP = {
            'submit': 'Submitted',
            'approve': 'Approved',
            'post': 'Posted',
            'cancel': 'Cancelled'
        }

        if action not in ACTION_STATUS_MAP:
            return Response({"message": "Invalid action"}, status=400)

        old_status = cf.status
        cf.status = ACTION_STATUS_MAP[action]
        cf.save()

        CashFlowHistory.objects.create(
            cash_flow=cf,
            event_type=action,
            action_by=request.user,
            details=f"{old_status} → {cf.status}"
        )

        return Response({"message": "Action applied successfully"})
class CashFlowCommentView(APIView):

    # ✅ GET 
    def get(self, request, pk):
        cf = get_object_or_404(CashFlow, pk=pk)
        comments = cf.comments.all().order_by('-id')
        serializer = CashFlowCommentSerializer(comments, many=True)

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    # POST
    def post(self, request, pk):
        cf = get_object_or_404(CashFlow, pk=pk)
        comment_text = request.data.get('comment')

        if not comment_text:
            return Response(
                {"message": "Comment required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        comment = CashFlowComment.objects.create(
            cash_flow=cf,
            comment=comment_text,
            created_by=request.user
        )

        return Response({
            "message": "Comment added successfully",
            "data": {
                "id": comment.id,
                "comment": comment.comment,
                "comment_by": str(comment.created_by),
                "timestamp": comment.timestamp
            }
        }, status=status.HTTP_201_CREATED)
class CashFlowAttachmentView(APIView):
    def get(self, request, pk):
        cf = get_object_or_404(CashFlow, pk=pk)
        attachments = cf.attachments.all().order_by('-id')

        data = []
        for att in attachments:
            data.append({
                "id": att.id,
                "file": att.file.url if att.file else None,
                "file_name": att.file.name if att.file else None,
                "uploaded_by": str(att.uploaded_by) if att.uploaded_by else None,
                "uploaded_at": att.created_at if hasattr(att, "created_at") else None
            })

        return Response({
            "message": "Attachments fetched successfully",
            "data": data
        })


    def post(self, request, pk):
        cf = get_object_or_404(CashFlow, pk=pk)

        file = request.FILES.get('file')
        if not file:
           return Response({"message": "File required"}, status=400)

        attachment = CashFlowAttachment.objects.create(
            cash_flow=cf,
            file=file,
            uploaded_by=request.user
        )

        CashFlowHistory.objects.create(
            cash_flow=cf,
            event_type="Attachment_Added",
            action_by=request.user,
            details=attachment.file.name
        )

        return Response({"message": "File uploaded"})
class CashFlowAttachmentDeleteView(APIView):
    def delete(self, request, pk, attachment_id):
        try:
            attachment = CashFlowAttachment.objects.get(
                id=attachment_id,
                cash_flow_id=pk
            )
            attachment.delete()
            return Response({"message": "Attachment deleted successfully"}, status=200)

        except CashFlowAttachment.DoesNotExist:
            return Response({"error": "Attachment not found"}, status=404)
    
from django.db.models import Sum, F, ExpressionWrapper, DecimalField

class CashFlowHistoryView(APIView):

    def get(self, request):

        items = CashFlowLineItem.objects.values('category').annotate(
            total=Sum(ExpressionWrapper(
                    F('credit') - F('debit'),
                    output_field=DecimalField()
                )
            )
        )

        result = {
            "Operating": 0,
            "Investing": 0,
            "Financing": 0
        }

        for i in items:
           category = i['category'].strip().capitalize()  # 🔥 normalize
           if category in result:
                result[category] = float(i['total'] or 0)

        return Response(result)
