from rest_framework import serializers
from .models import Blog
from typing import Optional

class UserNewsSerializer(serializers.ModelSerializer):
    title   = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    image = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()

    class Meta:
        model  = Blog
        fields = [
            "id",
            "author",
            "title",
            "content",
            "news_type",
            "image",
            "video",
            "created_at",
        ]

    def _get_lang(self):
        """Request dan tilni oladi, default: uz"""
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang', 'uz')
        return 'uz'

    def get_title(self, obj) -> str:
        return obj.get_title(self._get_lang())

    def get_content(self, obj) -> str:
        return obj.get_content(self._get_lang())

    def get_image(self, obj) -> Optional[str]:
        """Rasm mavjud bo'lsa absolute URL qaytaradi"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_video(self, obj) -> Optional[str]:
        """Video mavjud bo'lsa absolute URL qaytaradi"""
        if obj.video:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return None