from .models import Blog, DevInfo, Experience, Project
from .serializers import DevBlogSerializer, DevInfoSerializer, DevExperienceSerializer, DevProjectSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema


@extend_schema(tags=['Admin blog control'])
class DevBlogControl(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = DevBlogSerializer
    permission_classes = [IsAdminUser]

    # ⭐ Image upload ishlashi uchun juda muhim
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

@extend_schema(tags=['Admin Info Control'])
class DevAdminInfoControl(viewsets.ModelViewSet):
    queryset = DevInfo.objects.all()
    serializer_class = DevInfoSerializer
    permission_classes = [IsAdminUser]

@extend_schema(tags=['Admin Experience Control'])
class DevAdminExperienceControl(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = DevExperienceSerializer
    permission_classes = [IsAdminUser]

@extend_schema(tags=['Admin Project Control'])
class DevAdminProjectControl(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = DevProjectSerializer
    permission_classes = [IsAdminUser]