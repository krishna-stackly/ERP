
from django.urls import path

from masters.views import (

    # User Views
    ManageUsersListCreateView,
    ManageUserDetailView,

    # Branch Views
    BranchListCreateView,
    BranchDetailView,

    # Department Views
    DepartmentListView,
    DepartmentCreateView,
    DepartmentDetailView,

    # Role Views
    RoleListView,
    RoleDetailView,

    # Product Views
    ProductListCreateView,
    ProductDetailView,
    ProductImportView,
    ProductImportConfirmView,

    # Product Master Views
    CategoryListCreateView,
    CategoryDetailView,

    TaxCodeListCreateView,
    TaxCodeDetailView,

    UOMListCreateView,
    UOMDetailView,

    WarehouseListCreateView,
    WarehouseDetailView,

    SizeListCreateView,
    SizeDetailView,

    ColorListCreateView,
    ColorDetailView,

    ProductSupplierListCreateView,
    ProductSupplierDetailView,

    # Customer Views
    CustomerListCreateView,
    CustomerDetailView,
    CustomerImportView,
    CustomerImportConfirmView,

    # Customer Merge Views
    CustomerDuplicatesListView,
    CustomerMergeReviewView,
    CustomerMergeConfirmView,

    # Supplier Views
    SupplierListCreateView,
    SupplierDetailView,
    SupplierCommentView,
    SupplierAttachmentView,
    SupplierHistoryView,
    SupplierWorkflowActionView,

    # Serial Views
    MasterDropdownDataView,
)

urlpatterns = [

    # =====================================================
    # USERS
    # =====================================================

    path(
        'users/',
        ManageUsersListCreateView.as_view(),
        name='users-list-create'
    ),

    path(
        'users/<int:pk>/',
        ManageUserDetailView.as_view(),
        name='users-detail'
    ),

    # =====================================================
    # BRANCHES
    # =====================================================

    path(
        'branches/',
        BranchListCreateView.as_view(),
        name='branches-list-create'
    ),

    path(
        'branches/<int:pk>/',
        BranchDetailView.as_view(),
        name='branches-detail'
    ),

    # =====================================================
    # DEPARTMENTS
    # =====================================================

    path(
        'departments/',
        DepartmentListView.as_view(),
        name='departments-list'
    ),

    path(
        'departments/create/',
        DepartmentCreateView.as_view(),
        name='departments-create'
    ),

    path(
        'departments/<int:pk>/',
        DepartmentDetailView.as_view(),
        name='departments-detail'
    ),

    # =====================================================
    # ROLES
    # =====================================================

    path(
        'roles/',
        RoleListView.as_view(),
        name='roles-list'
    ),

    path(
        'roles/<int:pk>/',
        RoleDetailView.as_view(),
        name='roles-detail'
    ),

    # =====================================================
    # PRODUCTS
    # =====================================================

    path(
        'products/',
        ProductListCreateView.as_view(),
        name='products-list-create'
    ),

    path(
        'products/<int:pk>/',
        ProductDetailView.as_view(),
        name='products-detail'
    ),

    path(
        'products/import/',
        ProductImportView.as_view(),
        name='products-import'
    ),

    path(
        'products/import/confirm/',
        ProductImportConfirmView.as_view(),
        name='products-import-confirm'
    ),

    # =====================================================
    # CATEGORIES
    # =====================================================

    path(
        'categories/',
        CategoryListCreateView.as_view(),
        name='categories-list-create'
    ),

    path(
        'categories/<int:pk>/',
        CategoryDetailView.as_view(),
        name='categories-detail'
    ),

    # =====================================================
    # TAX CODES
    # =====================================================

    path(
        'tax-codes/',
        TaxCodeListCreateView.as_view(),
        name='tax-codes-list-create'
    ),

    path(
        'tax-codes/<int:pk>/',
        TaxCodeDetailView.as_view(),
        name='tax-codes-detail'
    ),

    # =====================================================
    # UOMS
    # =====================================================

    path(
        'uoms/',
        UOMListCreateView.as_view(),
        name='uoms-list-create'
    ),

    path(
        'uoms/<int:pk>/',
        UOMDetailView.as_view(),
        name='uoms-detail'
    ),

    # =====================================================
    # WAREHOUSES
    # =====================================================

    path(
        'warehouses/',
        WarehouseListCreateView.as_view(),
        name='warehouses-list-create'
    ),

    path(
        'warehouses/<int:pk>/',
        WarehouseDetailView.as_view(),
        name='warehouses-detail'
    ),

    # =====================================================
    # SIZES
    # =====================================================

    path(
        'sizes/',
        SizeListCreateView.as_view(),
        name='sizes-list-create'
    ),

    path(
        'sizes/<int:pk>/',
        SizeDetailView.as_view(),
        name='sizes-detail'
    ),

    # =====================================================
    # COLORS
    # =====================================================

    path(
        'colors/',
        ColorListCreateView.as_view(),
        name='colors-list-create'
    ),

    path(
        'colors/<int:pk>/',
        ColorDetailView.as_view(),
        name='colors-detail'
    ),

    # =====================================================
    # PRODUCT SUPPLIERS
    # =====================================================

    path(
        'product-suppliers/',
        ProductSupplierListCreateView.as_view(),
        name='product-suppliers-list-create'
    ),

    path(
        'product-suppliers/<int:pk>/',
        ProductSupplierDetailView.as_view(),
        name='product-suppliers-detail'
    ),

    # =====================================================
    # CUSTOMERS
    # =====================================================

    path(
        'customers/',
        CustomerListCreateView.as_view(),
        name='customers-list-create'
    ),

    path(
        'customers/<int:pk>/',
        CustomerDetailView.as_view(),
        name='customers-detail'
    ),

    path(
        'customers/import/',
        CustomerImportView.as_view(),
        name='customers-import'
    ),

    path(
        'customers/import/confirm/',
        CustomerImportConfirmView.as_view(),
        name='customers-import-confirm'
    ),

    # =====================================================
    # CUSTOMER MERGE
    # =====================================================

    path(
        'customers/duplicates/',
        CustomerDuplicatesListView.as_view(),
        name='customers-duplicates'
    ),

    path(
        'customers/merge/review/',
        CustomerMergeReviewView.as_view(),
        name='customers-merge-review'
    ),

    path(
        'customers/merge/confirm/',
        CustomerMergeConfirmView.as_view(),
        name='customers-merge-confirm'
    ),

    # =====================================================
    # SUPPLIERS
    # =====================================================

    path(
        'suppliers/',
        SupplierListCreateView.as_view(),
        name='suppliers-list-create'
    ),

    path(
        'suppliers/<int:pk>/',
        SupplierDetailView.as_view(),
        name='suppliers-detail'
    ),

    path(
        'suppliers/<int:pk>/comments/',
        SupplierCommentView.as_view(),
        name='suppliers-comments'
    ),

    path(
        'suppliers/<int:pk>/attachments/',
        SupplierAttachmentView.as_view(),
        name='suppliers-attachments'
    ),

    path(
        'suppliers/<int:pk>/attachments/<int:attach_pk>/',
        SupplierAttachmentView.as_view(),
        name='suppliers-attachments-delete'
    ),

    path(
        'suppliers/<int:pk>/history/',
        SupplierHistoryView.as_view(),
        name='suppliers-history'
    ),

    path(
        'suppliers/<int:pk>/workflow/',
        SupplierWorkflowActionView.as_view(),
        name='suppliers-workflow'
    ),

    # =====================================================
    # MASTER DROPDOWNS
    # =====================================================

    path(
        'dropdowns/',
        MasterDropdownDataView.as_view(),
        name='master-dropdowns'
    ),
]
