from .models import Blog, DevInfo, Experience, Project, Certificate
from .serializers.dev_info_serializers import (
    DevBlogAdminSerializer, DevInfoAdminSerializer,
    DevExperienceAdminSerializer, DevProjectAdminSerializer,
    CertificateAdminSerializer,
)
from .serializers.contact_admin_serializer import UserInfoAdminControlSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from myprofile.models import UsersInfo

LANG_PARAMETER = OpenApiParameter(
    name='lang', type=OpenApiTypes.STR,
    location=OpenApiParameter.QUERY,
    description='Til tanlash: uz | ru | en',
    enum=['uz', 'ru', 'en'], default='uz', required=False,
)

class LangMixin:
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

@extend_schema(tags=['Admin — Info'], parameters=[LANG_PARAMETER])
class DevAdminInfoControl(LangMixin, viewsets.ModelViewSet):
    queryset           = DevInfo.objects.all()
    serializer_class   = DevInfoAdminSerializer
    permission_classes = [IsAdminUser]
    parser_classes     = [MultiPartParser, FormParser]

@extend_schema(tags=['Admin — Experience'], parameters=[LANG_PARAMETER])
class DevAdminExperienceControl(LangMixin, viewsets.ModelViewSet):
    queryset           = Experience.objects.select_related('dev').all()
    serializer_class   = DevExperienceAdminSerializer
    permission_classes = [IsAdminUser]

@extend_schema(tags=['Admin — Projects'], parameters=[LANG_PARAMETER])
class DevAdminProjectControl(LangMixin, viewsets.ModelViewSet):
    queryset           = Project.objects.select_related('dev').all()
    serializer_class   = DevProjectAdminSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

@extend_schema(tags=['Admin — Blog'], parameters=[LANG_PARAMETER])
class DevBlogControl(LangMixin, viewsets.ModelViewSet):
    queryset           = Blog.objects.all()
    serializer_class   = DevBlogAdminSerializer
    permission_classes = [IsAdminUser]
    parser_classes     = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


@extend_schema(tags=['Admin — Certificates'], parameters=[LANG_PARAMETER])
class DevAdminCertificateControl(LangMixin, viewsets.ModelViewSet):
    queryset           = Certificate.objects.select_related('dev').all()
    serializer_class   = CertificateAdminSerializer
    permission_classes = [IsAdminUser]
    parser_classes     = [MultiPartParser, FormParser]

@extend_schema(tags=['Admin — contact'])
class UserInfoAdminControlViewset(LangMixin, viewsets.ModelViewSet):
    queryset           = UsersInfo.objects.all()
    serializer_class   = UserInfoAdminControlSerializer
    permission_classes = [IsAdminUser]
    # parser_classes     = [MultiPartParser, FormParser]