from django.urls import path, include
from .views import UserDevInfoListView, UserDevExperienceListView, UserDevProjectListView, UserDevBlogtListView

urlpatterns = [
    path("dev/info/", UserDevInfoListView.as_view(), name="dev-info"),
    path("dev/experience/", UserDevExperienceListView.as_view(), name="dev-experience"),
    path("dev/projects/", UserDevProjectListView.as_view(), name="dev-projects"),
    path("dev/blog/", UserDevBlogtListView.as_view(), name="dev-blog")
]