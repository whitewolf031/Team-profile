from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers
from .models import Blog, DevInfo, Experience, Project, Certificate

# ─────────────────────────────────────────
# ADMIN serializers — barcha til fieldlari
# ─────────────────────────────────────────

class DevInfoAdminSerializer(serializers.ModelSerializer):
    """Admin: 3 tilda barcha fieldlar ko'rinadi va tahrirlash mumkin"""
    class Meta:
        model  = DevInfo
        fields = [
            'id',
            'full_name_uz', 'full_name_ru', 'full_name_en',
            'stack_uz',     'stack_ru',     'stack_en',
            'experience',
            'about_uz',     'about_ru',     'about_en',
            'email', 'phone', 'avatar', 'telegram_chat_id',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class DevExperienceAdminSerializer(serializers.ModelSerializer):
    """Admin: 3 tilda barcha fieldlar"""
    class Meta:
        model  = Experience
        fields = [
            'id', 'dev',
            'title_uz',           'title_ru',           'title_en',
            'company', 'employment_type', 'location',
            'start_date', 'end_date', 'is_current',
            'achievements_uz',    'achievements_ru',    'achievements_en',
            'responsibilities_uz','responsibilities_ru','responsibilities_en',
            'teaching_focus_uz',  'teaching_focus_ru',  'teaching_focus_en',
            'student_count', 'age_range',
        ]

class DevProjectAdminSerializer(serializers.ModelSerializer):
    """Admin: 3 tilda barcha fieldlar"""
    technologies = serializers.ListField(
        child=serializers.ChoiceField(choices=Project.TECHNOLOGY_CHOICES)
    )

    class Meta:
        model  = Project
        fields = [
            'id', 'dev',
            'title_uz',       'title_ru',       'title_en',
            'description_uz', 'description_ru', 'description_en',
            'technologies', 'project_url', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

class DevBlogAdminSerializer(serializers.ModelSerializer):
    """Admin: 3 tilda barcha fieldlar"""
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model  = Blog
        fields = [
            'id', 'author', 'author_name',
            'title_uz',   'title_ru',   'title_en',
            'content_uz', 'content_ru', 'content_en',
            'image', 'is_published', 'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'author_name']

class CertificateAdminSerializer(serializers.ModelSerializer):
    """Admin: 3 tilda barcha fieldlar"""
    class Meta:
        model  = Certificate
        fields = [
            'id', 'dev',
            'title_uz',  'title_ru',  'title_en',
            'issuer_uz', 'issuer_ru', 'issuer_en',
            'issued_date', 'image',
        ]
        read_only_fields = ['id']

# ─────────────────────────────────────────
# PUBLIC serializer — faqat so'ralgan til
# ─────────────────────────────────────────

class DevExperienceSerializer(serializers.ModelSerializer):
    title            = serializers.SerializerMethodField()
    achievements     = serializers.SerializerMethodField()
    responsibilities = serializers.SerializerMethodField()
    teaching_focus   = serializers.SerializerMethodField()

    class Meta:
        model  = Experience
        fields = [
            'id', 'dev',
            'title', 'company', 'employment_type', 'location',
            'start_date', 'end_date', 'is_current',
            'achievements', 'responsibilities', 'teaching_focus',
            'student_count', 'age_range',
        ]

    def _lang(self):
        req = self.context.get('request')
        return req.query_params.get('lang', 'uz') if req else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):            
        return obj.get_title(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_achievements(self, obj):     
        return obj.get_achievements(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_responsibilities(self, obj): 
        return obj.get_responsibilities(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_teaching_focus(self, obj):   
        return obj.get_teaching_focus(self._lang())

class DevProjectSerializer(serializers.ModelSerializer):
    title       = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model  = Project
        fields = ['id', 'dev', 'title', 'description',
                  'technologies', 'project_url', 'created_at']
        read_only_fields = ['id', 'created_at']

    def _lang(self):
        req = self.context.get('request')
        return req.query_params.get('lang', 'uz') if req else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):       return obj.get_title(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_description(self, obj): return obj.get_description(self._lang())

class DevBlogSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)
    title       = serializers.SerializerMethodField()
    content     = serializers.SerializerMethodField()

    class Meta:
        model  = Blog
        fields = ['id', 'author', 'author_name',
                  'title', 'content', 'image', 'is_published', 'created_at']
        read_only_fields = ['id', 'created_at', 'author_name']

    def _lang(self):
        req = self.context.get('request')
        return req.query_params.get('lang', 'uz') if req else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):   return obj.get_title(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_content(self, obj): return obj.get_content(self._lang())

class CertificateSerializer(serializers.ModelSerializer):
    title  = serializers.SerializerMethodField()
    issuer = serializers.SerializerMethodField()

    class Meta:
        model  = Certificate
        fields = ['id', 'dev', 'title', 'issuer', 'issued_date', 'image']
        read_only_fields = ['id']

    def _lang(self):
        req = self.context.get('request')
        return req.query_params.get('lang', 'uz') if req else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_title(self, obj):  return obj.get_title(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_issuer(self, obj): return obj.get_issuer(self._lang())

class DevInfoSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    stack     = serializers.SerializerMethodField()
    about     = serializers.SerializerMethodField()

    class Meta:
        model  = DevInfo
        fields = ['id', 'full_name', 'stack', 'experience',
                  'about', 'email', 'phone', 'avatar']

    def _lang(self):
        req = self.context.get('request')
        return req.query_params.get('lang', 'uz') if req else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_full_name(self, obj): 
        return obj.get_full_name(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_stack(self, obj):     
        return obj.get_stack(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_about(self, obj):     
        return obj.get_about(self._lang())

class DevInfoDetailSerializer(serializers.ModelSerializer):
    """Detail endpoint — nested ma'lumotlar bilan, faqat so'ralgan tilda"""
    full_name    = serializers.SerializerMethodField()
    stack        = serializers.SerializerMethodField()
    about        = serializers.SerializerMethodField()
    experiences  = serializers.SerializerMethodField()
    projects     = serializers.SerializerMethodField()
    certificates = serializers.SerializerMethodField()

    class Meta:
        model  = DevInfo
        fields = [
            'id', 'full_name', 'stack', 'experience', 'about',
            'email', 'phone', 'avatar', 'telegram_chat_id',
            'created_at', 'updated_at',
            'experiences', 'projects', 'certificates',
        ]

    def _lang(self):
        req = self.context.get('request')
        return req.query_params.get('lang', 'uz') if req else 'uz'

    @extend_schema_field(OpenApiTypes.STR)
    def get_full_name(self, obj): return obj.get_full_name(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_stack(self, obj):     return obj.get_stack(self._lang())

    @extend_schema_field(OpenApiTypes.STR)
    def get_about(self, obj):     return obj.get_about(self._lang())

    @extend_schema_field(DevExperienceSerializer(many=True))
    def get_experiences(self, obj):
        return DevExperienceSerializer(
            obj.experiences.all(), many=True, context=self.context
        ).data

    @extend_schema_field(DevProjectSerializer(many=True))
    def get_projects(self, obj):
        return DevProjectSerializer(
            obj.projects.all(), many=True, context=self.context
        ).data

    @extend_schema_field(CertificateSerializer(many=True))
    def get_certificates(self, obj):
        return CertificateSerializer(
            obj.certificates.all(), many=True, context=self.context
        ).data