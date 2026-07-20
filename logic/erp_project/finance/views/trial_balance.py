
from rest_framework import generics, views
from django.db import transaction
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from core.permissions import RoleBasedPermission
from rest_framework import status
from rest_framework.response import Response
from ..models.trial_balance import (
    Company,
    TrialBalance,
    TrialBalanceLineItem,
    LedgerEntry,
    TrialBalanceAttachment,
    TrialBalanceComment,
    TrialBalanceHistory,
) 
from ..serializers import (
    CompanySerializer,
    TrialBalanceSerializer,
    TrialBalanceWriteSerializer,
    TrialBalanceLineItemSerializer,
    LedgerEntrySerializer,
    TrialBalanceAttachmentSerializer,
    TrialBalanceCommentSerializer,
    TrialBalanceHistorySerializer,

)


# -------------------------------
# Company Dropdown API
# -------------------------------
class CompanyView(views.APIView):

    def get(self, request, pk):
        data = Company.objects.all()
        serializer = CompanySerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        serializer = CompanySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    

class CompanyDetailView(views.APIView):

    def get(self, request, pk):
        obj = get_object_or_404(Company, pk=pk)
        serializer = CompanySerializer(obj)
        return Response(serializer.data)

    def put(self, request, pk):
        obj = get_object_or_404(Company, pk=pk)
        serializer = CompanySerializer(obj, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        obj = get_object_or_404(Company, pk=pk)
        obj.delete()
        return Response({"message": "Deleted Successfully"})



# -------------------------------
# Create Trial Balance
# -------------------------------
class TrialBalanceListCreateView(generics.ListCreateAPIView):
    queryset = TrialBalance.objects.all().order_by("-created_at")

    def get_serializer_class(self):
        return TrialBalanceWriteSerializer if self.request.method == "POST" else TrialBalanceSerializer

    def list(self, request):
        page = int(request.query_params.get("page", 1))
        limit = int(request.query_params.get("limit", 10))

        paginator = Paginator(self.get_queryset(), limit)
        data = paginator.get_page(page)

        serializer = self.get_serializer(data, many=True)
        return Response({"data": serializer.data})

    @transaction.atomic
    def create(self, request, pk):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tb = serializer.save()
        return Response({"data": TrialBalanceSerializer(tb).data})


class TrialBalanceDetailView(views.APIView):

    def get(self, request, pk):
        obj = get_object_or_404(TrialBalance, pk=pk)
        serializer = TrialBalanceSerializer(obj)
        return Response(serializer.data)

    def put(self, request, pk):
        obj = get_object_or_404(TrialBalance, pk=pk)
        serializer = TrialBalanceSerializer(obj, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        obj = get_object_or_404(TrialBalance, pk=pk)
        obj.delete()
        return Response({"message": "Deleted Successfully"})

    

class TrialBalanceActionView(views.APIView):

    def post(self, request, pk):
        tb = get_object_or_404(TrialBalance, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'approve', 'posted', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = tb.status

        if action == 'save_draft':
            tb.status = 'draft'
            message = "Saved as draft"
        elif action == 'submit':
            tb.status = 'submitted'
            message = "Submitted successfully"
        elif action == 'approve':
            tb.status = 'approved'
            tb.approved_by = request.user
            message = "Approved successfully"
        elif action == 'posted':
            tb.status = 'posted'
            message = "Marked as posted"
        elif action == 'cancel':
            tb.status = 'cancelled'
            message = "Cancelled successfully"

        tb.save()

        TrialBalanceHistory.objects.create(
            trial_balance=tb,
            event_type=action,
            action_by=str(request.user),
            details=f"Changed to {tb.status}"
        )

        return Response({"message": message})    


# -------------------------------
# Debit Summary View
# -------------------------------
class DebitSummaryView(views.APIView):
    def get(self, request, tb_id):
        items = TrialBalanceLineItem.objects.filter(trial_balance_id=tb_id)

        data = []
        for i in items:
            data.append({
                "account_code": i.account_code,
                "account_name": i.account_name,
                "group_name": i.group_name,
                "opening_debit": i.opening_debit,
                "period_debit": i.period_debit,
                "closing_debit": i.closing_debit,
            })

        return Response(data)


# -------------------------------
# Credit Summary View
# -------------------------------
class CreditSummaryView(views.APIView):
    def get(self, request, tb_id):
        items = TrialBalanceLineItem.objects.filter(trial_balance_id=tb_id)

        data = []
        for i in items:
            data.append({
                "account_code": i.account_code,
                "account_name": i.account_name,
                "group_name": i.group_name,
                "opening_credit": i.opening_credit,
                "period_credit": i.period_credit,
                "closing_credit": i.closing_credit,
            })

        return Response(data)


# -------------------------------
# Ledger Drill Down
# -------------------------------
class LedgerView(views.APIView):

    def get(self, request):
        data = LedgerEntry.objects.all()
        serializer = LedgerEntrySerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        serializer = LedgerEntrySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# -----------------------------------
# Ledger Detail
# GET / PUT / DELETE
# -----------------------------------
class LedgerDetailView(views.APIView):

    def get(self, request, pk):
        obj = get_object_or_404(LedgerEntry, pk=pk)
        serializer = LedgerEntrySerializer(obj)
        return Response(serializer.data)

    def put(self, request, pk):
        obj = get_object_or_404(LedgerEntry, pk=pk)
        serializer = LedgerEntrySerializer(obj, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        obj = get_object_or_404(LedgerEntry, pk=pk)
        obj.delete()
        return Response({"message": "Deleted Successfully"})



# -------------------------------
# Full Consolidated View
# -------------------------------
class ConsolidatedView(views.APIView):
    def get(self, request, tb_id):
        items = TrialBalanceLineItem.objects.filter(trial_balance_id=tb_id)
        serializer = TrialBalanceLineItemSerializer(items, many=True)
        return Response(serializer.data)


# -------------------------------
# Attachments
# -------------------------------
class TrialBalanceAttachmentView(views.APIView):

    def get(self, request, pk):
        data = TrialBalanceAttachment.objects.all()
        serializer = TrialBalanceAttachmentSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        serializer = TrialBalanceAttachmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        obj = get_object_or_404(TrialBalanceAttachment, pk=pk)
        obj.delete()
        return Response({"message": "Deleted Successfully"})




# -------------------------------
# Comments
# -------------------------------
class TrialBalanceCommentView(views.APIView):

    def get(self, request, pk):
        data = TrialBalanceComment.objects.all()
        serializer = TrialBalanceCommentSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        serializer = TrialBalanceCommentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        obj = get_object_or_404(TrialBalanceComment, pk=pk)
        obj.delete()
        return Response({"message": "Deleted Successfully"})


# -------------------------------
# History
# -------------------------------
class TrialBalanceHistoryView(views.APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, tb_id):
        trial_balance = get_object_or_404(TrialBalance, pk=tb_id)

        history = trial_balance.history.all().order_by('-timestamp')
        serializer = TrialBalanceHistorySerializer(history, many=True)

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })

    def post(self, request, tb_id):
        trial_balance = get_object_or_404(TrialBalance, pk=tb_id)

        serializer = TrialBalanceHistorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                trial_balance=trial_balance,
                action_by=str(request.user)
            )

            return Response({
                "message": "History created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)