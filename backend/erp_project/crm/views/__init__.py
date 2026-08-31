from .enquiry_views import (
    EnquiryListCreateView,
    EnquiryDetailView,
)

from .quotation_views import (
    QuotationListCreateView,
    QuotationDetailView,
    QuotationCommentView,
    QuotationHistoryView,
    QuotationActionView,
    QuotationAttachmentView,
    QuotationPDFView,
    QuotationMailView,
)

from .sales_order_views import (
    SalesOrderListCreateView,
    SalesOrderDetailView,
    SalesOrderActionView,
    SalesOrderCommentView,
    SalesOrderHistoryView,
    SalesOrderPDFView,
    SalesOrderMailView,
    GeneratePurchaseOrderFromSalesOrderView,
    GenerateDeliveryNoteFromSalesOrderView,
    GenerateInvoiceFromSalesOrderView,
)

from .delivery_note_views import (
    DeliveryNoteListCreateView,
    DeliveryNoteDetailView,
    DeliveryNoteActionView,
    DeliveryNoteCommentView,
    DeliveryNoteAttachmentView,
    DeliveryNoteHistoryView,
    DeliveryNotePDFView,
    DeliveryNoteEmailView,
    GenerateInvoiceFromDeliveryNoteView,
)

from .invoice_views import (
    InvoiceListCreateView,
    InvoiceDetailView,
    InvoiceActionView,
    InvoiceCommentView,
    InvoiceAttachmentView,
    InvoiceHistoryView,
    InvoicePDFView,
    InvoiceEmailView,
    GenerateInvoiceReturnFromInvoiceView,
)

from .invoice_return_views import (
    InvoiceReturnListCreateView,
    InvoiceReturnDetailView,
    InvoiceReturnActionView,
    InvoiceReturnCommentView,
    InvoiceReturnAttachmentView,
    InvoiceReturnHistoryView,
    InvoiceReturnPDFView,
    InvoiceReturnEmailView,
)

from .delivery_note_return_views import (
    GenerateDeliveryNoteReturnFromInvoiceReturnView,
    DeliveryNoteReturnListCreateView,
    DeliveryNoteReturnDetailView,
    DeliveryNoteReturnActionView,
    DeliveryNoteReturnCommentView,
    DeliveryNoteReturnAttachmentView,
    DeliveryNoteReturnHistoryView,
    DeliveryNoteReturnPDFView,
    DeliveryNoteReturnEmailView,
)
