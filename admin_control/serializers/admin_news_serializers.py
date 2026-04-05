from rest_framework import serializers
from blog_news.models import Blog

class AdminNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Blog
        fields = [
            "id",
            "author",

            # Title — 3 tilda
            "title_uz",
            "title_ru",
            "title_en",

            # Content — 3 tilda
            "content_uz",
            "content_ru",
            "content_en",

            "news_type",
            "image",
            "video",
            "is_published",
            "send_to_telegram",
            "telegram_sent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "telegram_sent",   # admin o'zgartira olmaydi — signal boshqaradi
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        # title_uz majburiy
        if not attrs.get('title_uz'):
            raise serializers.ValidationError({
                "title_uz": "O'zbekcha sarlavha majburiy."
            })

        # content_uz majburiy
        if not attrs.get('content_uz'):
            raise serializers.ValidationError({
                "content_uz": "O'zbekcha kontent majburiy."
            })

        return attrs

    def validate_image(self, value):
        if value:
            # Max 10MB
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Rasm hajmi 10MB dan oshmasligi kerak.")

            allowed = ['image/jpeg', 'image/png', 'image/webp']
            if value.content_type not in allowed:
                raise serializers.ValidationError("Faqat JPEG, PNG, WEBP formatlar qabul qilinadi.")

        return value

    def validate_video(self, value):
        if value:
            # Max 100MB
            if value.size > 100 * 1024 * 1024:
                raise serializers.ValidationError("Video hajmi 100MB dan oshmasligi kerak.")

            allowed = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv']
            if value.content_type not in allowed:
                raise serializers.ValidationError("Faqat MP4, AVI, MOV, MKV formatlar qabul qilinadi.")

        return value

    def to_representation(self, instance):
        """Response da rasm va video absolute URL bo'ladi"""
        data    = super().to_representation(instance)
        request = self.context.get('request')

        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)

        if instance.video and request:
            data['video'] = request.build_absolute_uri(instance.video.url)

        return data


class AdminNewsListSerializer(serializers.ModelSerializer):
    """Ro'yxat uchun — og'ir maydonlarsiz"""

    class Meta:
        model  = Blog
        fields = [
            "id",
            "title_uz",
            "news_type",
            "is_published",
            "send_to_telegram",
            "telegram_sent",
            "created_at",
        ]
        read_only_fields = fields