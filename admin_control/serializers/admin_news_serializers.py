from rest_framework import serializers
from blog_news.models import Blog

class AdminNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Blog
        fields = [
            "id",
            "author",
            "title_uz", "title_ru", "title_en",
            "content_uz", "content_ru", "content_en",
            "news_type",
            "image", "video",
            "is_published",
            "send_to_telegram",
            "telegram_sent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id", "author", "telegram_sent", "created_at", "updated_at",
        ]
        extra_kwargs = {
            "title_ru":    {"required": False, "allow_blank": True, "allow_null": True},
            "title_en":    {"required": False, "allow_blank": True, "allow_null": True},
            "content_ru":  {"required": False, "allow_blank": True, "allow_null": True},
            "content_en":  {"required": False, "allow_blank": True, "allow_null": True},
            "image":       {"required": False, "allow_null": True},
            "video":       {"required": False, "allow_null": True},
            "is_published":     {"required": False},
            "send_to_telegram": {"required": False},
        }

    def validate(self, attrs):
        title_uz   = attrs.get('title_uz',   '') or ''
        content_uz = attrs.get('content_uz', '') or ''

        if not title_uz.strip():
            raise serializers.ValidationError({"title_uz": "O'zbekcha sarlavha majburiy."})
        if not content_uz.strip():
            raise serializers.ValidationError({"content_uz": "O'zbekcha kontent majburiy."})
        return attrs

    def validate_image(self, value):
        if value and hasattr(value, 'size'):
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Rasm hajmi 10MB dan oshmasligi kerak.")
            allowed = ['image/jpeg', 'image/png', 'image/webp']
            if hasattr(value, 'content_type') and value.content_type not in allowed:
                raise serializers.ValidationError("Faqat JPEG, PNG, WEBP formatlar qabul qilinadi.")
        return value

    def validate_video(self, value):
        if value and hasattr(value, 'size'):
            if value.size > 100 * 1024 * 1024:
                raise serializers.ValidationError("Video hajmi 100MB dan oshmasligi kerak.")
        return value

    def to_representation(self, instance):
        data    = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        if instance.video and request:
            data['video'] = request.build_absolute_uri(instance.video.url)
        return data

class AdminNewsListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = Blog
        fields = [
            "id", "title_uz", "news_type",
            "is_published", "send_to_telegram", "telegram_sent",
            "image_url", "created_at",
        ]
        read_only_fields = fields

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None