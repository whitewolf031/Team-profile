from rest_framework import serializers
from .models import Blog, DevInfo, Experience, Project

class DevBlogSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(
        source="author.username",
        read_only=True
    )

    class Meta:
        model = Blog
        fields = [
            "id",
            "author",
            "author_name",
            "title",
            "content",
            "image",
            "is_published",
            "created_at"
        ]

        read_only_fields = ["id", "created_at"]

class DevInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevInfo
        fields = "__all__"


class DevExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = "__all__"


class DevProjectSerializer(serializers.ModelSerializer):
    technologies = serializers.ListField(
        child=serializers.ChoiceField(choices=Project.TECHNOLOGY_CHOICES)
    )

    class Meta:
        model = Project
        fields = "__all__"