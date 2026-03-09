from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    O'qish (SAFE_METHODS) hamma uchun ochiq,
    yozish (POST, PUT, DELETE) faqat admin foydalanuvchilarga ruxsat.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff