from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DevAdminInfoControl, DevAdminExperienceControl, DevAdminProjectControl, DevBlogControl, DevAdminCertificateControl

router = DefaultRouter()
router.register(r'admin-control/dev', DevAdminInfoControl, basename="admin-dev")
router.register(r'admin-control/experience', DevAdminExperienceControl, basename="admin-experience")
router.register(r'admin-control/projects', DevAdminProjectControl, basename="admin-projects")
router.register(r'admin-control/blog', DevBlogControl, basename="admin-blog")
router.register(r'admin-control/sertificate', DevAdminCertificateControl, basename="admin-sertificate")

urlpatterns = [
    path('', include(router.urls))
]