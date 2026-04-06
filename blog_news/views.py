from rest_framework import generics, permissions
from drf_spectacular.utils import extend_schema
from .models import Blog
from .serializers import UserNewsSerializer

@extend_schema(tags=['User - news'])
class UserNewsList(generics.ListAPIView):
    queryset           = Blog.objects.filter(is_published=True).order_by('-created_at')
    serializer_class   = UserNewsSerializer
    permission_classes = [permissions.AllowAny]