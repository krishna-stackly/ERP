from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from ..models.asset_insuarance import (
    Asset,
    asset_InsuranceCompany,
    asset_ResponsibleEntity,
    AssetInsurancePolicy,
    asset_PremiumPayment,
    asset_PolicyLineItem,
    asset_PolicyAttachment,
    asset_PolicyComment,
    asset_PolicyHistory,
)

from ..serializers.asset_insuarance import (
    AssetSerializer,
    InsuranceCompanySerializer,
    ResponsibleEntitySerializer,
    AssetInsurancePolicySerializer,
    AssetInsurancePolicyWriteSerializer,
    PremiumPaymentSerializer,
    PolicyLineItemSerializer,
    PolicyAttachmentSerializer,
    PolicyCommentSerializer,
    PolicyHistorySerializer,
)


class AssetInsurancePolicyListCreateView(generics.ListCreateAPIView):
    queryset = AssetInsurancePolicy.objects.all().order_by("-policy_start_date")
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AssetInsurancePolicyWriteSerializer
        return AssetInsurancePolicySerializer

    def create(self, request, *args, **kwargs):
        serializer = AssetInsurancePolicyWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        policy = serializer.save()

        return Response(
            AssetInsurancePolicySerializer(policy).data,
            status=status.HTTP_201_CREATED
        )


class AssetInsurancePolicyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AssetInsurancePolicy.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return AssetInsurancePolicyWriteSerializer
        return AssetInsurancePolicySerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = AssetInsurancePolicyWriteSerializer(
            instance,
            data=request.data,
            partial=request.method == "PATCH"
        )

        serializer.is_valid(raise_exception=True)
        policy = serializer.save()

        return Response(
            AssetInsurancePolicySerializer(policy).data,
            status=status.HTTP_200_OK
        )


class AssetInsurancePolicyActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        policy = get_object_or_404(AssetInsurancePolicy, pk=pk)

        action = request.data.get("action")

        if action == "submit":
            policy.status = "Submitted"
        elif action == "approve":
            policy.status = "Approved"
        elif action == "cancel":
            policy.status = "Cancelled"
        else:
            return Response(
                {"error": "Invalid action"},
                status=status.HTTP_400_BAD_REQUEST
            )

        policy.save()

        asset_PolicyHistory.objects.create(
            policy=policy,
            action=policy.status,
            performed_by=request.user
        )

        return Response(
            {"status": f"Policy {action} successful"},
            status=status.HTTP_200_OK
        )


class AssetViewSet(generics.ListCreateAPIView):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]


class InsuranceCompanyViewSet(generics.ListCreateAPIView):
    queryset = asset_InsuranceCompany.objects.all()
    serializer_class = InsuranceCompanySerializer
    permission_classes = [IsAuthenticated]


class ResponsibleEntityViewSet(generics.ListCreateAPIView):
    queryset = asset_ResponsibleEntity.objects.all()
    serializer_class = ResponsibleEntitySerializer
    permission_classes = [IsAuthenticated]


class PolicyLineItemView(generics.ListCreateAPIView):
    serializer_class = PolicyLineItemSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("REQUEST DATA =", request.data)
        return super().post(request, *args, **kwargs)

    def get_queryset(self):
        return asset_PolicyLineItem.objects.filter(
            policy_id=self.kwargs["pk"]
        )

    def perform_create(self, serializer):
        policy = get_object_or_404(
            AssetInsurancePolicy,
            pk=self.kwargs["pk"]
        )
        serializer.save(policy=policy)


class PremiumPaymentView(generics.ListCreateAPIView):
    serializer_class = PremiumPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return asset_PremiumPayment.objects.filter(
            policy_id=self.kwargs["pk"]
        )

    def perform_create(self, serializer):
        policy = get_object_or_404(
            AssetInsurancePolicy,
            pk=self.kwargs["pk"]
        )
        serializer.save(policy=policy)


class PolicyAttachmentView(generics.ListCreateAPIView):
    serializer_class = PolicyAttachmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return asset_PolicyAttachment.objects.filter(
            policy_id=self.kwargs["pk"]
        )

    def perform_create(self, serializer):
        policy = get_object_or_404(
            AssetInsurancePolicy,
            pk=self.kwargs["pk"]
        )
        serializer.save(policy=policy)


class PolicyAttachmentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, attach_pk):
        attachment = get_object_or_404(
            asset_PolicyAttachment,
            pk=attach_pk,
            policy_id=pk
        )

        attachment.delete()

        return Response(
            {"status": "Attachment deleted"},
            status=status.HTTP_204_NO_CONTENT
        )


class PolicyCommentView(generics.ListCreateAPIView):
    serializer_class = PolicyCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return asset_PolicyComment.objects.filter(
            policy_id=self.kwargs["pk"]
        )

    def perform_create(self, serializer):
        policy = get_object_or_404(
            AssetInsurancePolicy,
            pk=self.kwargs["pk"]
        )

        serializer.save(
            policy=policy,
            created_by=self.request.user
        )


class PolicyHistoryView(generics.ListAPIView):
    serializer_class = PolicyHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return asset_PolicyHistory.objects.filter(
            policy_id=self.kwargs["pk"]
        ).order_by("-performed_at")