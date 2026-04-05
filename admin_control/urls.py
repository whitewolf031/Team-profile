from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DevAdminInfoControl, 
    DevAdminExperienceControl, 
    DevAdminProjectControl, 
    DevAdminCertificateControl,
    UserInfoAdminControlViewset,
    AdminNewsViewSet
)

router = DefaultRouter()
router.register(r'admin-control/dev', DevAdminInfoControl, basename="admin-dev")
router.register(r'admin-control/experience', DevAdminExperienceControl, basename="admin-experience")
router.register(r'admin-control/projects', DevAdminProjectControl, basename="admin-projects")
router.register(r'admin-control/sertificate', DevAdminCertificateControl, basename="admin-sertificate")
router.register(r'admin-control/contact', UserInfoAdminControlViewset, basename="admin-contact-control")
router.register(r'admin-control/news', AdminNewsViewSet, basename="admin-news")

urlpatterns = [
    path('', include(router.urls))
]