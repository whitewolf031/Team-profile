from django.db import models
    
class UsersInfo(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    telegram_username = models.CharField(max_length=50)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} subject {self.message}"