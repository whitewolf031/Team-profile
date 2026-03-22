from rest_framework import serializers
from myprofile.models import UsersInfo
from admin_control.models import DevInfo, Experience, Project, Certificate, Blog
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes


class ContactSerializer(serializers.ModelSerializer):
    dev_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = UsersInfo
        fields = ['id', 'name', 'email', 'message', 'dev_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data.pop('dev_id', None)
        return super().create(validated_data)


class PublicExperienceSerializer(serializers.ModelSerializer):
    title            = serializers.SerializerMethodField()
    achievements     = serializers.SerializerMethodField()
    responsibilities = serializers.SerializerMethodField()
    teaching_focus   = serializers.SerializerMethodField()  # ✅ field e'lon qilindi

    class Meta:
        model = Experience
        fields = [
            'id', 'dev',
            'title', 'company', 'employment_type', 'location',
            'start_date', 'end_date', 'is_current',
            'achievements', 'responsibilities', 'teaching_focus',
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
    def get_teaching_focus(self, obj):          # ✅ typo tuzatildi
        return obj.get_teaching_fucus(self._get_lang())


class PublicProjectSerializer(serializers.ModelSerializer):
    title       = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'dev',
            'title', 'description',
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


class PublicBlogSerializer(serializers.ModelSerializer):
    title   = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            'id', 'author',
            'title', 'content',
            'image', 'is_published', 'created_at',
        ]

    def _get_lang(self):
        request = self.context.get('request')
        return request.query_params.get('lang', 'uz') if request else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):
        return obj.get_title(self._get_lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_content(self, obj):
        return obj.get_content(self._get_lang())


class PublicDevInfoSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    stack     = serializers.SerializerMethodField()
    about     = serializers.SerializerMethodField()

    class Meta:
        model = DevInfo
        fields = [
            'id', 'full_name', 'stack', 'experience',
            'about', 'email', 'phone', 'avatar',
        ]

    def _get_lang(self):
        request = self.context.get('request')
        return request.query_params.get('lang', 'uz') if request else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_full_name(self, obj):
        lang = self._get_lang()
        if lang == 'ru':
            return obj.full_name_ru or obj.full_name_uz  # ✅ fallback
        elif lang == 'en':
            return obj.full_name_en or obj.full_name_uz  # ✅ fallback
        return obj.full_name_uz

    @extend_schema_field(OpenApiTypes.STR)
    def get_stack(self, obj):
        lang = self._get_lang()
        if lang == 'ru':
            return obj.stack_ru or obj.stack_uz          # ✅ fallback
        elif lang == 'en':
            return obj.stack_en or obj.stack_uz          # ✅ fallback
        return obj.stack_uz

    @extend_schema_field(OpenApiTypes.STR)
    def get_about(self, obj):
        return obj.get_about(self._get_lang())