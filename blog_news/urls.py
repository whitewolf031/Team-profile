from django.urls import path
from .views import UserNewsList

urlpatterns = [
    path('news/list/', UserNewsList.as_view(), name="user-news")
]