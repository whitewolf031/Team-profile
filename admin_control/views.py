from .models import DevInfo, Experience, Project, Certificate
from blog_news.models import Blog
from .serializers.admin_news_serializers import AdminNewsListSerializer, AdminNewsSerializer
from .serializers.dev_info_serializers import (
    DevInfoAdminSerializer,
    DevExperienceAdminSerializer, DevProjectAdminSerializer,
    CertificateAdminSerializer,
)
from .serializers.contact_admin_serializer import UserInfoAdminControlSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from myprofile.models import UsersInfo
import logging
 
logger = logging.getLogger(__name__)

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

@extend_schema(tags=['Admin - news'])
class AdminNewsViewSet(LangMixin, viewsets.ModelViewSet):
    queryset           = Blog.objects.all().order_by('-created_at')
    permission_classes = [IsAdminUser]
    parser_classes     = [MultiPartParser, FormParser]
 
    def get_serializer_class(self):
        if self.action == 'list':
            return AdminNewsListSerializer
        return AdminNewsSerializer
 
    def _parse_booleans(self, data):
        """FormData dan string 'true'/'false' ni boolean ga o'zgartirish"""
        data = data.copy()
        for field in ('is_published', 'send_to_telegram'):
            if field in data:
                val = data[field]
                if isinstance(val, str):
                    data[field] = val.lower() in ('true', '1', 'yes')
        return data
 
    def create(self, request, *args, **kwargs):
        data       = self._parse_booleans(request.data)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
 
    def update(self, request, *args, **kwargs):
        partial  = kwargs.pop('partial', False)
        instance = self.get_object()
        data     = self._parse_booleans(request.data)
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)