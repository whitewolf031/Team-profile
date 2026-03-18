from rest_framework import serializers
from myprofile.models import UsersInfo
from admin_control.models import DevInfo, Experience, Project, Certificate, Blog
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersInfo
        fields = ['name', 'email', 'message']

class ContactSerializer(serializers.ModelSerializer):
    dev_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = UsersInfo
        fields = ['id', 'name', 'email', 'message', 'dev_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data.pop('dev_id', None)
        return super().create(validated_data)
    
class DevExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = "__all__"

class DevProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"

class DevBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = "__all__"

class DevInfoSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()   # ✅ faqat kerakli til
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
            return obj.full_name_ru
        elif lang == 'en':
            return obj.full_name_en
        return obj.full_name_uz

    @extend_schema_field(OpenApiTypes.STR)
    def get_stack(self, obj):                          # ✅ get_stact → get_stack
        lang = self._get_lang()
        if lang == 'ru':
            return obj.stack_ru
        elif lang == 'en':
            return obj.stack_en
        return obj.stack_uz

    @extend_schema_field(OpenApiTypes.STR)
    def get_about(self, obj):
        return obj.get_about(self._get_lang())