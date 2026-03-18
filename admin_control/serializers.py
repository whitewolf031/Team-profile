from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers
from .models import Blog, DevInfo, Experience, Project, Certificate

class DevInfoAdminSerializer(serializers.ModelSerializer):
    """Admin uchun — barcha til fieldlari ko'rinadi"""
    class Meta:
        model = DevInfo
        fields = [
            'id', 
            'full_name_uz', 'full_name_ru', 'full_name_en', 
            'stack_uz', 'stack_ru', 'stack_en', 
            'experience',
            'about_uz', 'about_ru', 'about_en',
            'email',
            'phone', 'avatar',
            'telegram_chat_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class DevExperienceAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'dev',
            'title_uz', 'title_ru', 'title_en',
            'company', 'employment_type', 'location',
            'start_date', 'end_date', 'is_current',
            'achievements_uz', 'achievements_ru', 'achievements_en',
            'responsibilities_uz', 'responsibilities_ru', 'responsibilities_en',
            'teaching_focus_uz', 'teaching_focus_ru', 'teaching_focus_en',
            'student_count', 'age_range',
        ]

    def _get_lang(self):
        request = self.context.get('request')
        return request.query_params.get('lang', 'uz') if request else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):
        return obj.get_title(self._get_lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_achievements(self, obj):
        return obj.get_achievements(self._get_lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_responsibilities(self, obj):
        return obj.get_responsibilities(self._get_lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_teaching_focus(self, obj):
        lang = self._get_lang()
        if lang == 'ru':
            return obj.teaching_focus_ru or obj.teaching_focus_uz
        elif lang == 'en':
            return obj.teaching_focus_en or obj.teaching_focus_uz
        return obj.teaching_focus_uz


class DevProjectAdminSerializer(serializers.ModelSerializer):
    technologies = serializers.ListField(
        child=serializers.ChoiceField(choices=Project.TECHNOLOGY_CHOICES)
    )

    class Meta:
        model = Project
        fields = [
            'id', 'dev',
            'title_uz', 'title_ru', 'title_en',
            'description_uz', 'description_ru', 'description_en',
            'technologies', 'project_url', 'created_at',
        ]

    def _get_lang(self):
        request = self.context.get('request')
        return request.query_params.get('lang', 'uz') if request else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):
        return obj.get_title(self._get_lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_description(self, obj):
        return obj.get_description(self._get_lang())


class DevBlogAdminSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id', 'author', 'author_name',
            'title_uz', 'title_ru', 'title_en',
            'content_uz', 'content_ru', 'content_en',
            'image', 'is_published', 'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'author_name']
    def _get_lang(self):
        request = self.context.get('request')
        return request.query_params.get('lang', 'uz') if request else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):
        return obj.get_title(self._get_lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_content(self, obj):
        return obj.get_content(self._get_lang())


class CertificateAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = [
            'id', 'dev',
            'title_uz', 'title_ru', 'title_en',
            'issuer_uz', 'issuer_ru', 'issuer_en',
            'issued_date', 'image',
        ]

    def _get_lang(self):
        request = self.context.get('request')
        return request.query_params.get('lang', 'uz') if request else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):
        return obj.get_title(self._get_lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_issuer(self, obj):
        return obj.get_issuer(self._get_lang())


class DevInfoDetailSerializer(serializers.ModelSerializer):
    about        = serializers.SerializerMethodField()
    experiences  = serializers.SerializerMethodField()
    projects     = serializers.SerializerMethodField()
    certificates = serializers.SerializerMethodField()

    class Meta:
        model = DevInfo
        fields = ['id', 'full_name', 'stack', 'experience', 'about',
                  'email', 'phone', 'avatar', 'telegram_chat_id',
                  'created_at', 'updated_at',
                  'experiences', 'projects', 'certificates']

    def _get_lang(self):
        request = self.context.get('request')
        return request.query_params.get('lang', 'uz') if request else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_about(self, obj):
        return obj.get_about(self._get_lang())

    @extend_schema_field(DevExperienceAdminSerializer(many=True))
    def get_experiences(self, obj):
        return DevExperienceAdminSerializer(
            obj.experiences.all(), many=True, context=self.context
        ).data

    @extend_schema_field(DevProjectAdminSerializer(many=True))
    def get_projects(self, obj):
        return DevProjectAdminSerializer(
            obj.projects.all(), many=True, context=self.context
        ).data

    @extend_schema_field(CertificateAdminSerializer(many=True))
    def get_certificates(self, obj):
        return CertificateAdminSerializer(
            obj.certificates.all(), many=True, context=self.context
        ).data