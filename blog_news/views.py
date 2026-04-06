# blog_news/views.py — foydalanuvchi uchun
from rest_framework import generics, permissions, filters
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Blog
from .serializers import UserNewsSerializer

LANG_PARAM = OpenApiParameter(
    name='lang', type=OpenApiTypes.STR,
    location=OpenApiParameter.QUERY,
    enum=['uz', 'ru', 'en'], default='uz', required=False,
)
TYPE_PARAM = OpenApiParameter(
    name='news_type', type=OpenApiTypes.STR,
    location=OpenApiParameter.QUERY,
    enum=['world-news', 'it-news', 'cybersecurity-news'], required=False,
    description='Tur bo\'yicha filter',
)

@extend_schema(tags=['User - news'], parameters=[LANG_PARAM, TYPE_PARAM])
class UserNewsList(generics.ListAPIView):
    serializer_class   = UserNewsSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Blog.objects.filter(is_published=True).order_by('-created_at')
        news_type = self.request.query_params.get('news_type')
        if news_type:
            qs = qs.filter(news_type=news_type)
        return qs

@extend_schema(tags=['User - news'], parameters=[LANG_PARAM])
class UserNewsDetail(generics.RetrieveAPIView):
    queryset           = Blog.objects.filter(is_published=True)
    serializer_class   = UserNewsSerializer
    permission_classes = [permissions.AllowAny]