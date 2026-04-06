from django.apps import AppConfig

class BlogNewsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blog_news'

    def ready(self):
        import blog_news.signals