from api.spectacular.urls import urlpatterns as doc_urls
from admin_control.urls import urlpatterns as admin_urls
from myprofile.urls import urlpatterns as profile_urls
from blog_news.urls import urlpatterns as news

app_name = 'api'

urlpatterns = []

urlpatterns += doc_urls
urlpatterns += admin_urls
urlpatterns += profile_urls
urlpatterns += news