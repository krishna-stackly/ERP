


from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from django.db import transaction
from core.permissions import RoleBasedPermission
from core.utils import validation_error_response


from ..models.account_payable import AccountsPayableVoucher, AccountsPayableVoucherHistory, AccountsPayableVoucherAttachment
from ..serializers.account_payable import (
    AccountsPayableVoucherSerializer,
    AccountsPayableVoucherWriteSerializer,
    AccountsPayableVoucherCommentSerializer,
    AccountsPayableVoucherAttachmentSerializer,
    AccountsPayableVoucherHistorySerializer,
)




class AccountsPayableVoucherListCreateView(generics.ListCreateAPIView):
    queryset = AccountsPayableVoucher.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        return AccountsPayableVoucherWriteSerializer if self.request.method == "POST" else AccountsPayableVoucherSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = int(request.query_params.get("page", 1))
        limit = int(request.query_params.get("limit", 10))

        paginator = Paginator(queryset, limit)
        data = paginator.get_page(page)

        serializer = self.get_serializer(data, many=True)

        return Response({
            "message": "AP Vouchers fetched",
            "data": serializer.data,
            "total": paginator.count,
            "pages": paginator.num_pages
        })

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        voucher = serializer.save()

        return Response({
            "message": "AP Voucher created",
            "data": AccountsPayableVoucherSerializer(voucher).data
        }, status=status.HTTP_201_CREATED)



class AccountsPayableVoucherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AccountsPayableVoucher.objects.all()
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_serializer_class(self):
        return AccountsPayableVoucherSerializer if self.request.method == "GET" else AccountsPayableVoucherWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response({
            "message": "Accounts Payable Voucher fetched successfully",
            "data": serializer.data
        })

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            return validation_error_response(serializer)

        serializer.save()

        return Response({
            "message": "Accounts Payable Voucher updated successfully"
        })

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response({
            "message": "Accounts Payable Voucher deleted successfully"
        })


class AccountsPayableVoucherActionView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def post(self, request, pk):
        voucher = get_object_or_404(AccountsPayableVoucher, pk=pk)
        action = request.data.get('action')

        if action not in ['save_draft', 'submit', 'approve', 'paid', 'cancel']:
            return Response({"message": "Invalid action"}, status=400)

        old_status = voucher.approval_status

        if action == 'save_draft':
            voucher.approval_status = 'draft'
            message = "Saved as draft"
        elif action == 'submit':
            voucher.approval_status = 'submitted'
            message = "Submitted successfully"
        elif action == 'approve':
            voucher.approval_status = 'approved'
            voucher.approved_by = request.user
            message = "Approved successfully"
        elif action == 'paid':
            voucher.approval_status = 'paid'
            message = "Marked as paid"
        elif action == 'cancel':
            voucher.approval_status = 'cancelled'
            message = "Cancelled successfully"

        voucher.save()

        AccountsPayableVoucherHistory.objects.create(
            accounts_payable=voucher,
            event_type=action,
            action_by=request.user,
            details=f"Status changed from {old_status} to {voucher.approval_status}"
        )

        return Response({"message": message})


class AccountsPayableVoucherCommentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        voucher = get_object_or_404(AccountsPayableVoucher, pk=pk)
        comments = voucher.comments.all().order_by('-timestamp')

        serializer = AccountsPayableVoucherCommentSerializer(comments, many=True)

        return Response({
            "message": "Comments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        voucher = get_object_or_404(AccountsPayableVoucher, pk=pk)

        serializer = AccountsPayableVoucherCommentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        comment = serializer.save(
            accounts_payable=voucher,
            created_by=request.user
        )

        AccountsPayableVoucherHistory.objects.create(
            accounts_payable=voucher,
            event_type="Comment Added",
            action_by=request.user,
            details=comment.comment[:100]
        )

        return Response({
            "message": "Comment added successfully",
            "data": AccountsPayableVoucherCommentSerializer(comment).data
        }, status=status.HTTP_201_CREATED)


class AccountsPayableVoucherAttachmentView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        voucher = get_object_or_404(AccountsPayableVoucher, pk=pk)
        attachments = voucher.attachments.all()

        serializer = AccountsPayableVoucherAttachmentSerializer(attachments, many=True)

        return Response({
            "message": "Attachments fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        voucher = get_object_or_404(AccountsPayableVoucher, pk=pk)

        serializer = AccountsPayableVoucherAttachmentSerializer(data=request.data)
        if not serializer.is_valid():
            return validation_error_response(serializer)

        attachment = serializer.save(
            accounts_payable=voucher,
            uploaded_by=request.user
        )

        AccountsPayableVoucherHistory.objects.create(
            accounts_payable=voucher,
            event_type="Attachment Uploaded",
            action_by=request.user,
            details=f"File: {attachment.file.name}"
        )

        return Response({
            "message": "Attachment uploaded successfully",
            "data": AccountsPayableVoucherAttachmentSerializer(attachment).data
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, attach_pk):
        voucher = get_object_or_404(AccountsPayableVoucher, pk=pk)
        attachment = get_object_or_404(
            AccountsPayableVoucherAttachment,
            pk=attach_pk,
            accounts_payable=voucher
        )

        file_name = attachment.file.name
        attachment.delete()

        AccountsPayableVoucherHistory.objects.create(
            accounts_payable=voucher,
            event_type="Attachment Deleted",
            action_by=request.user,
            details=f"File: {file_name}"
        )

        return Response({"message": "Attachment deleted successfully"}, status=204)


class AccountsPayableVoucherHistoryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        voucher = get_object_or_404(AccountsPayableVoucher, pk=pk)

        history = voucher.history.all().order_by('-timestamp')
        serializer = AccountsPayableVoucherHistorySerializer(history, many=True)

        return Response({
            "message": "History fetched successfully",
            "data": serializer.data
        })

    def post(self, request, pk):
        voucher = get_object_or_404(AccountsPayableVoucher, pk=pk)

        serializer = AccountsPayableVoucherHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                accounts_payable=voucher,
                action_by=request.user
            )

            return Response({
                "message": "History created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=400)
        

   
# Accounts Receivable Voucher Views
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.paginator import Paginator
from django.db import transaction
from django.shortcuts import get_object_or_404
 
# from .models import AccountsReceivableVoucher, AccountsReceivableVoucherHistory, AccountsReceivableVoucherAttachment
# from .serializers import (
#     AccountsReceivableVoucherCommentSerializer,
#     AccountsReceivableVoucherAttachmentSerializer,
#     AccountsReceivableVoucherSerializer,
#     AccountsReceivableVoucherHistorySerializer,
#     AccountsReceivableVoucherWriteSerializer,
# )
# from core.permissions import RoleBasedPermission
# from core.utils import validation_error_response


# class AccountsReceivableVoucherListCreateView(generics.ListCreateAPIView):
#     queryset = AccountsReceivableVoucher.objects.all().order_by('-created_at')
#     permission_classes = [IsAuthenticated, RoleBasedPermission]

#     def get_serializer_class(self):
#         if self.request.method == "POST":
#             return AccountsReceivableVoucherWriteSerializer
#         return AccountsReceivableVoucherSerializer

#     def list(self, request, *args, **kwargs):
#         queryset = self.filter_queryset(self.get_queryset())
#         page_number = int(request.query_params.get('page', 1))
#         page_size = int(request.query_params.get('limit', 10))
#         paginator = Paginator(queryset, page_size)
#         page = paginator.get_page(page_number)
#         serializer = self.get_serializer(page, many=True)
#         from_count = (page.number - 1) * page_size + 1
#         to_count = from_count + len(page.object_list) - 1 if page.object_list else 0
#         return Response({
#             "message": "Accounts Receivable Vouchers fetched successfully",
#             "data": {
#                 "from": from_count,
#                 "to": to_count,
#                 "totalCount": paginator.count,
#                 "totalPages": paginator.num_pages,
#                 "data": serializer.data
#             }
#         })

#     @transaction.atomic
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if not serializer.is_valid():
#             return validation_error_response(serializer)
#         voucher = serializer.save()
#         return Response({
#             "message": "Accounts Receivable Voucher created successfully",
#             "data": AccountsReceivableVoucherSerializer(voucher).data
#         }, status=status.HTTP_201_CREATED)


# class AccountsReceivableVoucherDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = AccountsReceivableVoucher.objects.select_related(
#         'customer_name', 'sales_order', 'delivery_note',
#          'department', 'branch',
        
#          'created_by', 'approved_by'
#     )
#     permission_classes = [IsAuthenticated, RoleBasedPermission]
#     lookup_field = 'pk'

#     def get_serializer_class(self):
#         if self.request.method == 'GET':
#             return AccountsReceivableVoucherSerializer
#         return AccountsReceivableVoucherWriteSerializer

#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
#         return Response({
#             "message": "Accounts Receivable Voucher fetched successfully",
#             "data": serializer.data
#         })

#     @transaction.atomic
#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', True)
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         if not serializer.is_valid():
#             return validation_error_response(serializer)
#         self.perform_update(serializer)
#         return Response({
#             "message": "Accounts Receivable Voucher updated successfully"
#         })

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.delete()
#         return Response({"message": "Accounts Receivable Voucher deleted successfully"})
    

# class AccountsReceivableVoucherActionView(APIView):
#     permission_classes = [IsAuthenticated, RoleBasedPermission]
 
#     def post(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         action = request.data.get('action')
 
#         if action not in ['save_draft', 'submit', 'approve', 'post', 'cancel']:
#             return Response({"message": "Invalid action"}, status=400)
 
#         old_status = voucher.status
 
#         if action == 'save_draft':
#             voucher.status = 'draft'
#             message = "Accounts Receivable Voucher saved as draft"
#         elif action == 'submit':
#             voucher.status = 'submitted'
#             message = "Accounts Receivable Voucher submitted successfully"
#         elif action == 'approve':
#             voucher.status = 'approved'
#             voucher.approved_by = request.user
#             message = "Accounts Receivable Voucher approved successfully"
#         elif action == 'post':
#             voucher.status = 'posted'
#             message = "Accounts Receivable Voucher posted successfully"
#         elif action == 'cancel':
#             voucher.status = 'cancelled'
#             message = "Accounts Receivable Voucher cancelled successfully"
 
#         voucher.save()
 
#         AccountsReceivableVoucherHistory.objects.create(
#             accounts_receivable=voucher,
#             event_type=action,
#             action_by=request.user,
#             details=f"Status changed from {old_status} to {voucher.status}"
#         )
 
#         return Response({"message": message})
    
# class AccountsReceivableVoucherCommentView(APIView):
#     permission_classes = [IsAuthenticated, RoleBasedPermission]
 
#     def get(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         comments = voucher.comments.all().order_by('-timestamp')
#         serializer = AccountsReceivableVoucherCommentSerializer(comments, many=True)
#         return Response({
#             "message": "Comments fetched successfully",
#             "data": serializer.data
#         })
 
#     def post(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         serializer = AccountsReceivableVoucherCommentSerializer(data=request.data)
#         if not serializer.is_valid():
#             return validation_error_response(serializer)
 
#         comment = serializer.save(accounts_receivable=voucher, created_by=request.user)
 
#         AccountsReceivableVoucherHistory.objects.create(
#             accounts_receivable=voucher,
#             event_type="Comment Added",
#             action_by=request.user,
#             details=comment.comment[:100]
#         )
 
#         return Response({
#             "message": "Comment added successfully",
#             "data": AccountsReceivableVoucherCommentSerializer(comment).data
#         }, status=status.HTTP_201_CREATED)
    

# class AccountsReceivableVoucherAttachmentView(APIView):
#     permission_classes = [IsAuthenticated, RoleBasedPermission]
#     parser_classes = (MultiPartParser, FormParser)

#     def get(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         attachments = voucher.attachments.all()
#         serializer = AccountsReceivableVoucherAttachmentSerializer(attachments, many=True)
#         return Response({
#             "message": "Attachments fetched successfully",
#             "data": serializer.data
#         })

#     def post(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         serializer = AccountsReceivableVoucherAttachmentSerializer(data=request.data)
#         if not serializer.is_valid():
#             return validation_error_response(serializer)

#         attachment = serializer.save(accounts_receivable=voucher, uploaded_by=request.user)

#         AccountsReceivableVoucherHistory.objects.create(
#             accounts_receivable=voucher,
#             event_type="Attachment Uploaded",
#             action_by=request.user,
#             details=f"File: {attachment.file.name}"
#         )

#         return Response({
#             "message": "Attachment uploaded successfully",
#             "data": AccountsReceivableVoucherAttachmentSerializer(attachment).data
#         }, status=status.HTTP_201_CREATED)

#     def delete(self, request, pk, attach_pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         attachment = get_object_or_404(AccountsReceivableVoucherAttachment, pk=attach_pk, accounts_receivable=voucher)
#         file_name = attachment.file.name
#         attachment.delete()

#         AccountsReceivableVoucherHistory.objects.create(
#             accounts_receivable=voucher,
#             event_type="Attachment Deleted",
#             action_by=request.user,
#             details=f"File: {file_name}"
#         )

#         return Response({"message": "Attachment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# from rest_framework import status
# from django.shortcuts import get_object_or_404

# class AccountsReceivableVoucherHistoryView(APIView):
#     permission_classes = [IsAuthenticated, RoleBasedPermission]

#     def get(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         history = voucher.history.all().order_by('-timestamp')
#         serializer = AccountsReceivableVoucherHistorySerializer(history, many=True)
#         return Response({
#             "message": "History fetched successfully",
#             "data": serializer.data
#         })

#     def post(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)

#         serializer = AccountsReceivableVoucherHistorySerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(
#                 accounts_receivable=voucher,
#                 action_by=request.user   # auto assign logged-in user
#             )
#             return Response({
#                 "message": "History created successfully",
#                 "data": serializer.data
#             }, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class AccountsReceivableVoucherPDFView(APIView):
#     permission_classes = [IsAuthenticated, RoleBasedPermission]

#     def get(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         context = {
#             'voucher': voucher,
#             'items': voucher.items.all(),
#             'now': timezone.now(),
#             'request': request,
#         }
#         html_string = render_to_string('accounts_receivable_voucher_pdf.html', context)
#         html = HTML(string=html_string, base_url=request.build_absolute_uri())
#         pdf_buffer = BytesIO()
#         html.write_pdf(pdf_buffer)
#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = f'attachment; filename="AR_Voucher_{voucher.id}.pdf"'
#         response.write(pdf_buffer.getvalue())
#         return response
    

# class AccountsReceivableVoucherEmailView(APIView):
#     permission_classes = [IsAuthenticated, RoleBasedPermission]

#     def post(self, request, pk):
#         voucher = get_object_or_404(AccountsReceivableVoucher, pk=pk)
#         recipient = request.data.get('email')
#         if not recipient:
#             return Response({"message": "Email is required"}, status=400)

#         context = {
#             'voucher': voucher,
#         }

#         html_message = render_to_string('accounts_receivable_email.html', context)

#         email = EmailMessage(
#             subject=f'Accounts Receivable Voucher {voucher.id}',
#             body=html_message,
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             to=[recipient]
#         )
#         email.content_subtype = 'html'
#         email.send()
#         return Response({"message": "Email sent successfully"})     

  
