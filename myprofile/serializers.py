from rest_framework import serializers
from myprofile.models import UsersInfo

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersInfo
        fields = ['name', 'email', 'message']