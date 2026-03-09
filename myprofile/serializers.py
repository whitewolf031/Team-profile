from rest_framework import serializers
from myprofile.models import UsersInfo

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