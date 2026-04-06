from django.db import models
from django.conf import settings


class Blog(models.Model):

    class NewsCategory(models.TextChoices):
        WORLD         = 'world-news',         'World News'
        IT            = 'it-news',            'IT News'
        CYBERSECURITY = 'cybersecurity-news', 'Cybersecurity News'

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="blogs"
    )

    # Title — 3 tilda
    title_uz = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255, blank=True, null=True)
    title_en = models.CharField(max_length=255, blank=True, null=True)

    # Content — 3 tilda
    content_uz = models.TextField()
    content_ru = models.TextField(blank=True, null=True)
    content_en = models.TextField(blank=True, null=True)

    news_type = models.CharField(
        max_length=20,
        choices=NewsCategory.choices,
        default=NewsCategory.WORLD,
    )

    image              = models.ImageField(upload_to="blog_images/", blank=True, null=True)
    video              = models.FileField(upload_to="blog_videos/", blank=True, null=True)  # ← qo'shildi
    is_published       = models.BooleanField(default=False)
    send_to_telegram   = models.BooleanField(default=False)   # ← frontend dan keladi
    telegram_sent      = models.BooleanField(default=False)   # ← yuborilganini track qilish
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = "Blog"
        verbose_name_plural = "Bloglar"
        ordering            = ["-created_at"]

    def __str__(self):
        return self.title_uz

    def get_title(self, lang='uz'):
        if lang == 'ru':
            return self.title_ru or self.title_uz
        elif lang == 'en':
            return self.title_en or self.title_uz
        return self.title_uz

    def get_content(self, lang='uz'):
        if lang == 'ru':
            return self.content_ru or self.content_uz
        elif lang == 'en':
            return self.content_en or self.content_uz
        return self.content_uz