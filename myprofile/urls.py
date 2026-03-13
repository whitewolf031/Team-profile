from django.urls import path, include
from .views import UserDevInfoListView, UserDevExperienceListView, UserDevProjectListView, UserDevBlogtListView, DevAdminInfoDetailView, GroupCreateView

urlpatterns = [
    path("dev/info/", UserDevInfoListView.as_view(), name="dev-info"),
    path('dev/info/<int:pk>/', DevAdminInfoDetailView.as_view()),
    path("dev/experience/", UserDevExperienceListView.as_view(), name="dev-experience"),
    path("dev/projects/", UserDevProjectListView.as_view(), name="dev-projects"),
    path("dev/blog/", UserDevBlogtListView.as_view(), name="dev-blog"),
    path('dev/info/',       UserDevInfoListView.as_view(),      name='dev-info-list'),
    path('dev/info/<int:pk>/', DevAdminInfoDetailView.as_view(), name='dev-info-detail'),
]