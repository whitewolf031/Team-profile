from django.urls import path
from .views import UserNewsList, UserNewsDetail

urlpatterns = [
    path('news/',       UserNewsList.as_view(),   name='user-news-list'),
    path('news/<int:pk>/', UserNewsDetail.as_view(), name='user-news-detail'),
]