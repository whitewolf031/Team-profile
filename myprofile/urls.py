from django.urls import path
from .views import (
    UserDevInfoListView,
    UserDevInfoDetailView,
    UserDevExperienceListView,
    UserDevProjectListView,
    GroupCreateView,
    ContactCreateView,
)

urlpatterns = [
    path("dev/info/",              UserDevInfoListView.as_view(),   name="dev-info"),
    path("dev/info/<int:pk>/",     UserDevInfoDetailView.as_view(), name="dev-info-detail"),
    path("dev/experience/",        UserDevExperienceListView.as_view(), name="dev-experience"),
    path("dev/projects/",          UserDevProjectListView.as_view(), name="dev-projects"),
    path("group/create/",          GroupCreateView.as_view(),       name="group-create"),
    path("contact/create/",        ContactCreateView.as_view(),     name="contact-create"),
]