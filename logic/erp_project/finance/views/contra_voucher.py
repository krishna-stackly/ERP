from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..models .contra_voucher import (
    ContraVoucher,
    ContraVoucherLineItem,
    ContraVoucherAttachment,
    ContraVoucherComment,
    ContraVoucherHistory,
    Requester,
    Approver,
    Preparer,
)
from ..serializers.contra_voucher import (
    ContraVoucherSerializer,
    ContraVoucherWriteSerializer,
    ContraVoucherLineItemSerializer,
    ContraVoucherAttachmentSerializer,
    ContraVoucherCommentSerializer,
    ContraVoucherHistorySerializer,
    RequesterSerializer,
    ApproverSerializer,
    PreparerSerializer,
)


class ContraVoucherListCreateView(generics.ListCreateAPIView):
    queryset = ContraVoucher.objects.all().order_by('-generated_on')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ContraVoucherWriteSerializer
        return ContraVoucherSerializer


class ContraVoucherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContraVoucher.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ContraVoucherWriteSerializer
        return ContraVoucherSerializer
    
    
    
class RequesterListCreateView(generics.ListCreateAPIView):
    queryset = Requester.objects.all()
    serializer_class = RequesterSerializer
    permission_classes = [IsAuthenticated]


class RequesterDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Requester.objects.all()
    serializer_class = RequesterSerializer
    permission_classes = [IsAuthenticated]


class ApproverListCreateView(generics.ListCreateAPIView):
    queryset = Approver.objects.all()
    serializer_class = ApproverSerializer
    permission_classes = [IsAuthenticated]


class ApproverDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Approver.objects.all()
    serializer_class = ApproverSerializer
    permission_classes = [IsAuthenticated]


class PreparerListCreateView(generics.ListCreateAPIView):
    queryset = Preparer.objects.all()
    serializer_class = PreparerSerializer
    permission_classes = [IsAuthenticated]


class PreparerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Preparer.objects.all()
    serializer_class = PreparerSerializer
    permission_classes = [IsAuthenticated]



class ContraVoucherActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        voucher = generics.get_object_or_404(ContraVoucher, pk=pk)
        action = request.data.get('action')

        if action == 'submit':
            voucher.is_submitted = True
            voucher.is_draft = False
        elif action == 'approve':
            voucher.is_approved = True
        elif action == 'post':
            voucher.is_posted = True
        elif action == 'cancel':
            voucher.is_draft = False
            voucher.is_submitted = False
            voucher.is_approved = False
            voucher.is_posted = False
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        voucher.save()
        event_map = {
    "submit": "Submitted",
    "approve": "Approved",
    "post": "Posted",
    "cancel": "Cancelled",
        }  
        ContraVoucherHistory.objects.create(
        voucher=voucher,
        event_type=event_map.get(action, action.capitalize()),
        action_by=request.user,
        )
        return Response({"status": f"Voucher {action} successful"})


class ContraVoucherCommentView(generics.ListCreateAPIView):
    serializer_class = ContraVoucherCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ContraVoucherComment.objects.filter(voucher_id=self.kwargs['pk'])

    def perform_create(self, serializer):
        voucher = generics.get_object_or_404(ContraVoucher, pk=self.kwargs['pk'])
        serializer.save(voucher=voucher, created_by=self.request.user)


class ContraVoucherAttachmentView(generics.ListCreateAPIView):
    serializer_class = ContraVoucherAttachmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ContraVoucherAttachment.objects.filter(voucher_id=self.kwargs['pk'])

    def perform_create(self, serializer):
        voucher = generics.get_object_or_404(ContraVoucher, pk=self.kwargs['pk'])
        serializer.save(voucher=voucher, uploaded_by=self.request.user)


class ContraVoucherAttachmentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, attach_pk):
        attachment = generics.get_object_or_404(ContraVoucherAttachment, pk=attach_pk, voucher_id=pk)
        attachment.delete()
        return Response({"status": "Attachment deleted"}, status=status.HTTP_204_NO_CONTENT)

class ContraVoucherHistoryView(generics.ListAPIView):
    serializer_class = ContraVoucherHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ContraVoucherHistory.objects.filter(voucher_id=self.kwargs['pk']).order_by('-timestamp')


