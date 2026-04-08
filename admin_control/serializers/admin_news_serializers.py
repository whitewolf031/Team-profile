from rest_framework import serializers
from blog_news.models import Blog
from typing import Optional
from admin_control.models import DevInfo

class AdminNewsSerializer(serializers.ModelSerializer):
    # author ID orqali DevInfo modeliga bog'lanadi
    author = serializers.PrimaryKeyRelatedField(
        queryset=DevInfo.objects.all(),
        required=True
    )

    class Meta:
        model = Blog
        fields = [
            "id", "author",
            "title_uz", "title_ru", "title_en",
            "content_uz", "content_ru", "content_en",
            "news_type", "image", "video",
            "is_published", "send_to_telegram", "telegram_sent",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "telegram_sent", "created_at", "updated_at"]

    def validate(self, attrs):
        # Yangi post yaratilayotganda majburiy maydonlar
        if not self.instance:
            if not attrs.get('title_uz'):
                raise serializers.ValidationError({"title_uz": "O'zbekcha sarlavha majburiy."})
            if not attrs.get('content_uz'):
                raise serializers.ValidationError({"content_uz": "O'zbekcha matn majburiy."})
        return attrs

    def validate_image(self, value):
        if value and not isinstance(value, str) and hasattr(value, 'size'):
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Rasm 10MB dan oshmasin")
        return value

    def validate_video(self, value):
        if value and not isinstance(value, str) and hasattr(value, 'size'):
            if value.size > 100 * 1024 * 1024:
                raise serializers.ValidationError("Video 100MB dan oshmasin")
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        # Muallifning ismini qo'shib yuboramiz
        if instance.author:
            data['author_name'] = instance.author.full_name_uz
            
        # To'liq URL manzillarini hosil qilish
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        if instance.video and request:
            data['video'] = request.build_absolute_uri(instance.video.url)
        return data

class AdminNewsListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    author_name = serializers.CharField(source='author.full_name_uz', read_only=True)

    class Meta:
        model = Blog
        fields = [
            "id", "title_uz", "news_type", "author_name",
            "is_published", "send_to_telegram", "telegram_sent",
            "image_url", "created_at",
        ]

    def get_image_url(self, obj) -> Optional[str]:
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None