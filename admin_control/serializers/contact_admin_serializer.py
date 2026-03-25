from rest_framework import serializers
from myprofile.models import UsersInfo

class UserInfoAdminControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersInfo
        fields = "__all__"