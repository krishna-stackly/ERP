#Bank Reconciliation View:

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import (
    BankReconciliation,
    BankReconciliationItem,
    BankReconciliationComment,
    BankReconciliationAttachment,
    BankReconciliationHistory
)

from ..serializers import (
    BankReconciliationWriteSerializer,
    BankReconciliationDetailSerializer,
    BankReconciliationItemSerializer,
    BankReconciliationCommentSerializer,
    BankReconciliationAttachmentSerializer,
    BankReconciliationHistorySerializer,
)

class BankReconciliationCreateView(APIView):

    def get(self, request):

        reconciliations = BankReconciliation.objects.all()

        serializer = BankReconciliationDetailSerializer(
            reconciliations,
            many=True
        )

        return Response({
            "message": "Bank reconciliation list fetched",
            "data": serializer.data
        })

    def post(self, request):

        serializer = BankReconciliationWriteSerializer(
            data=request.data
        )

        if serializer.is_valid():

            reconciliation = serializer.save(
                created_by=request.user
            )

            BankReconciliationHistory.objects.create(
                reconciliation=reconciliation,
                event_type="Created",
                details="Bank reconciliation created",
                action_by=request.user
            )

            return Response({
                "message": "Bank reconciliation created"
            }, status=201)

        return Response(serializer.errors, status=400)



class BankReconciliationDetailView(APIView):

    def get(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        serializer = BankReconciliationDetailSerializer(
            reconciliation
        )

        return Response({
            "message": "Bank reconciliation fetched",
            "data": serializer.data
        })


class BankReconciliationUpdateView(APIView):

    def put(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        if reconciliation.approval_status != "draft":
            return Response({
                "error": "Only draft can edit"
            }, status=400)

        serializer = BankReconciliationWriteSerializer(
            reconciliation,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            reconciliation = serializer.save()

            BankReconciliationHistory.objects.create(
                reconciliation=reconciliation,
                event_type="Updated",
                details="Bank reconciliation updated",
                action_by=request.user
            )

            return Response({
                "message": "Bank reconciliation updated"
            })

        return Response(serializer.errors, status=400)


class BankReconciliationSubmitView(APIView):

    def post(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        if reconciliation.approval_status != "draft":
            return Response({
                "error": "Only draft can submit"
            }, status=400)

        reconciliation.approval_status = "submitted"
        reconciliation.save()

        BankReconciliationHistory.objects.create(
            reconciliation=reconciliation,
            event_type="Submitted",
            details="Bank reconciliation submitted",
            action_by=request.user
        )

        return Response({
            "message": "Bank reconciliation submitted"
        })



class BankReconciliationApproveView(APIView):

    def post(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        if reconciliation.approval_status != "submitted":
            return Response({
                "error": "Only submitted can approve"
            }, status=400)

        reconciliation.approval_status = "approved"
        reconciliation.approved_by = request.user
        reconciliation.save()

        BankReconciliationHistory.objects.create(
            reconciliation=reconciliation,
            event_type="Approved",
            details="Bank reconciliation approved",
            action_by=request.user
        )

        return Response({
            "message": "Bank reconciliation approved"
        })



class BankReconciliationRejectView(APIView):

    def post(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        if reconciliation.approval_status =="submitted":
            return Response({
                "error": "Already rejected"
            }, status=400)

        reconciliation.approval_status = "rejected"
        reconciliation.save()

        BankReconciliationHistory.objects.create(
            reconciliation=reconciliation,
            event_type="Rejected",
            details="Bank reconciliation rejected",
            action_by=request.user
        )

        return Response({
            "message": "Bank reconciliation rejected"
        })


class BankReconciliationItemView(APIView):

    def get(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        items = reconciliation.items.all().order_by("-id")

        serializer = BankReconciliationItemSerializer(
            items,
            many=True
        )

        return Response({
            "message": "Line items fetched",
            "data": serializer.data
        })

    def post(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        serializer = BankReconciliationItemSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                reconciliation=reconciliation
            )

            BankReconciliationHistory.objects.create(
                reconciliation=reconciliation,
                event_type="Line Item Added",
                details="Line item added",
                action_by=request.user
            )

            return Response({
                "message": "Line item added"
            }, status=201)

        return Response(serializer.errors, status=400)



class BankReconciliationCommentView(APIView):

    def get(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        comments = reconciliation.comments.all().order_by("-id")

        serializer = BankReconciliationCommentSerializer(
            comments,
            many=True
        )

        return Response({
            "message": "Comments fetched",
            "data": serializer.data
        })

    def post(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        comment = request.data.get("comment")

        if not comment:
            return Response({
                "error": "Comment required"
            }, status=400)

        BankReconciliationComment.objects.create(
            reconciliation=reconciliation,
            comment=comment,
            created_by=request.user
        )

        BankReconciliationHistory.objects.create(
            reconciliation=reconciliation,
            event_type="Comment Added",
            details=comment,
            action_by=request.user
        )

        return Response({
            "message": "Comment added"
        })


class BankReconciliationAttachmentView(APIView):

    def get(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        attachments = reconciliation.attachments.all()

        serializer = BankReconciliationAttachmentSerializer(
            attachments,
            many=True
        )

        return Response({
            "message": "Attachments fetched",
            "data": serializer.data
        })

    def post(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        file = request.FILES.get("file")

        if not file:
            return Response({
                "error": "File required"
            }, status=400)

        BankReconciliationAttachment.objects.create(
            reconciliation=reconciliation,
            file=file,
            uploaded_by=request.user
        )

        BankReconciliationHistory.objects.create(
            reconciliation=reconciliation,
            event_type="Attachment Added",
            details=file.name,
            action_by=request.user
        )

        return Response({
            "message": "Attachment uploaded"
        })



class BankReconciliationHistoryView(APIView):

    def get(self, request, pk):

        reconciliation = get_object_or_404(
            BankReconciliation,
            pk=pk
        )

        history = reconciliation.history.all().order_by("-id")

        serializer = BankReconciliationHistorySerializer(
            history,
            many=True
        )

        return Response({
            "message": "History fetched",
            "data": serializer.data
        })