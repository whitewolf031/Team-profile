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
from rest_framework.decorators import action
from blog_news.telegram import send_blog_to_telegram
import logging
import threading
 
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

@extend_schema(tags=['Admin — Projects'])
class DevAdminProjectControl(viewsets.ModelViewSet):
    """
    Adminlar uchun loyihalarni boshqarish (CRUD).
    Rasm yuklash uchun MultiPartParser ishlatiladi.
    """
    queryset = Project.objects.select_related('dev').all().order_by('-created_at')
    serializer_class = DevProjectAdminSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        """
        Serializer ichida request va lang dan foydalanish uchun context yuboramiz.
        """
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        """
        Loyiha yaratilayotganda qo'shimcha mantiq kerak bo'lsa (masalan dev ni avtomatik biriktirish):
        """
        serializer.save()

    @extend_schema(summary="Loyihalar ro'yxatini olish")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Yangi loyiha qo'shish")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

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

@extend_schema(tags=['Admin — news'])
class AdminNewsViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by('-created_at')
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.action == 'list':
            return AdminNewsListSerializer
        return AdminNewsSerializer

    def _parse_data(self, data):
        """PickleError (500) va Boolean xatolarini oldini olish"""
        if hasattr(data, 'dict'):
            new_data = data.dict()
        else:
            new_data = dict(data)
            
        for field in ('is_published', 'send_to_telegram'):
            if field in new_data:
                val = new_data[field]
                if isinstance(val, str):
                    new_data[field] = val.lower() in ('true', '1', 'yes')
        return new_data

    def create(self, request, *args, **kwargs):
        data = self._parse_data(request.data)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # author endi request.user emas, frontenddan kelgan DevInfo ID-si bo'ladi
        instance = serializer.save()
        
        # Telegramga yuborish (Sizning telegram.py orqali)
        if instance.send_to_telegram:
            thread = threading.Thread(target=self.send_to_telegram_worker, args=(instance.id,))
            thread.daemon = True
            thread.start()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = self._parse_data(request.data)
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_instance = serializer.save()
        
        # Agar hali yuborilmagan bo'lsa va checkbox belgilansa yuboramiz
        if updated_instance.send_to_telegram and not updated_instance.telegram_sent:
            thread = threading.Thread(target=self.send_to_telegram_worker, args=(updated_instance.id,))
            thread.daemon = True
            thread.start()

        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def authors_list(self, request):
        """Frontenddagi 'Muallif' selecti uchun barcha DevInfolarni beradi"""
        authors = DevInfo.objects.all()
        return Response([{"id": a.id, "full_name": a.full_name_uz} for a in authors])

    def send_to_telegram_worker(self, blog_id):
        """Fonda telegram.py funksiyasini ishlatuvchi worker"""
        try:
            blog = Blog.objects.get(id=blog_id)
            # Sizning telegram.py dagi funksiyangiz
            success = send_blog_to_telegram(blog)
            
            if success:
                blog.telegram_sent = True
                blog.save(update_fields=['telegram_sent'])
                logger.info(f"Blog #{blog_id} muvaffaqiyatli Telegramga yuborildi.")
        except Exception as e:
            logger.error(f"Workerda xato (Blog ID: {blog_id}): {e}")