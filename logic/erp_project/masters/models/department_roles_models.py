from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager    
from django.conf import settings
from django.utils import timezone
from django.db.models import JSONField, UniqueConstraint
from django.core.validators import RegexValidator
  


class Branch(models.Model):
    name = models.CharField(max_length=100, unique=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_branches'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_branches'
    )

    class Meta:
        verbose_name = "Branch"
        verbose_name_plural = "Branches"
        ordering = ['name']

    def __str__(self):
        return self.name


class Department(models.Model):
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        null=True
    )

    code = models.CharField(max_length=50, unique=True)
    department_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_departments'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_departments'
    )

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        constraints = [
            UniqueConstraint(
                fields=['branch', 'department_name'],
                name='unique_dept_name_per_branch'
            ),
            UniqueConstraint(
                fields=['code'],
                name='unique_department_code'
            ),
        ]
        indexes = [
            models.Index(fields=['branch', 'department_name']),
            models.Index(fields=['code']),
        ]

    def __str__(self):
        return self.department_name


class Role(models.Model):
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        null=True
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='roles'
    )

    role = models.CharField(max_length=25)
    description = models.TextField(blank=True, null=True)
    permissions = JSONField(default=dict, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_roles'
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='updated_roles'
    )

    class Meta:
        verbose_name = "Role"
        verbose_name_plural = "Roles"
        constraints = [
            UniqueConstraint(
                fields=['department', 'role'],
                name='unique_role_per_department'
            ),
        ]
        indexes = [
            models.Index(fields=['department', 'role']),
        ]

    def __str__(self):
        return self.role