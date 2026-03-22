from django.db import models
from django.conf import settings

class DevInfo(models.Model):
    full_name_uz = models.CharField(max_length=255)
    full_name_ru = models.CharField(max_length=255)
    full_name_en = models.CharField(max_length=255)

    stack_uz = models.CharField(max_length=255)
    stack_ru = models.CharField(max_length=255)
    stack_en = models.CharField(max_length=255)

    experience = models.IntegerField()

    # About — 3 tilda
    about_uz = models.TextField(blank=True, null=True)
    about_ru = models.TextField(blank=True, null=True)
    about_en = models.TextField(blank=True, null=True)

    email = models.EmailField(max_length=255)

    phone = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    telegram_chat_id = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_about(self, lang='uz'):
        if lang == 'ru':
            return self.about_ru or self.about_uz
        elif lang == 'en':
            return self.about_en or self.about_uz
        return self.about_uz
    
    def get_full_name(self, lang='uz'):
        if lang == 'ru':
            return self.full_name_ru or self.full_name_uz
        elif lang == 'en':
            return self.full_name_en or self.full_name_uz
        return self.full_name_uz
    
    def get_stack(self, lang='uz'):
        if lang == 'ru':
            return self.stack_ru or self.stack_uz
        elif lang == 'en':
            return self.stack_en or self.stack_uz
        return self.stack_uz

    def __str__(self):
        return self.full_name

class UsersInfo(models.Model):
    dev = models.ForeignKey(
        'DevInfo',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="contacts"
    )
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} → {self.dev}"


class Experience(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('both', 'Full-time & Part-time'),
    ]

    dev = models.ForeignKey(
        DevInfo,
        on_delete=models.CASCADE,
        related_name="experiences",
        null=True, blank=True
    )

    # Title — 3 tilda
    title_uz = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255, blank=True, null=True)
    title_en = models.CharField(max_length=255, blank=True, null=True)

    company = models.CharField(max_length=255, blank=True, null=True)

    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES
    )
    location = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)

    # Achievements — 3 tilda
    achievements_uz = models.TextField(blank=True, null=True)
    achievements_ru = models.TextField(blank=True, null=True)
    achievements_en = models.TextField(blank=True, null=True)

    # Responsibilities — 3 tilda
    responsibilities_uz = models.TextField(blank=True, null=True)
    responsibilities_ru = models.TextField(blank=True, null=True)
    responsibilities_en = models.TextField(blank=True, null=True)

    # Teaching focus — 3 tilda
    teaching_focus_uz = models.TextField(blank=True, null=True)
    teaching_focus_ru = models.TextField(blank=True, null=True)
    teaching_focus_en = models.TextField(blank=True, null=True)

    student_count = models.PositiveIntegerField(blank=True, null=True)
    age_range = models.CharField(max_length=50, blank=True, null=True)

    def get_title(self, lang='uz'):
        if lang == 'ru':
            return self.title_ru or self.title_uz
        elif lang == 'en':
            return self.title_en or self.title_uz
        return self.title_uz

    def get_achievements(self, lang='uz'):
        if lang == 'ru':
            return self.achievements_ru or self.achievements_uz
        elif lang == 'en':
            return self.achievements_en or self.achievements_uz
        return self.achievements_uz

    def get_responsibilities(self, lang='uz'):
        if lang == 'ru':
            return self.responsibilities_ru or self.responsibilities_uz
        elif lang == 'en':
            return self.responsibilities_en or self.responsibilities_uz
        return self.responsibilities_uz
    
    def get_teaching_focus(self, lang='uz'):  # ← shu yo'q edi
        if lang == 'ru':
            return self.teaching_focus_ru or self.teaching_focus_uz
        elif lang == 'en':
            return self.teaching_focus_en or self.teaching_focus_uz
        return self.teaching_focus_uz
    
    def __str__(self):
        return f"{self.title_uz} ({self.employment_type})"


class Project(models.Model):
    TECHNOLOGY_CHOICES = [
        ("python", "Python"),
        ("php", "PHP"),
        ("javaScript", "JavaScript"),
        ("pyTelegramBotApi", "pyTelegramBotApi"),
        ("laravel", "Laravel"),
        ("django", "Django"),
        ("react", "React"),
        ("docker", "Docker"),
        ("postgresql", "PostgreSQL"),
        ("mysql", "MySQL"),
        ("sqlite", "SQLite"),
    ]

    dev = models.ForeignKey(
        DevInfo,
        on_delete=models.CASCADE,
        related_name="projects",
        null=True, blank=True
    )

    # Title — 3 tilda
    title_uz = models.CharField(max_length=200)
    title_ru = models.CharField(max_length=200, blank=True, null=True)
    title_en = models.CharField(max_length=200, blank=True, null=True)

    # Description — 3 tilda
    description_uz = models.TextField()
    description_ru = models.TextField(blank=True, null=True)
    description_en = models.TextField(blank=True, null=True)

    technologies = models.JSONField()
    project_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_title(self, lang='uz'):
        if lang == 'ru':
            return self.title_ru or self.title_uz
        elif lang == 'en':
            return self.title_en or self.title_uz
        return self.title_uz

    def get_description(self, lang='uz'):
        if lang == 'ru':
            return self.description_ru or self.description_uz
        elif lang == 'en':
            return self.description_en or self.description_uz
        return self.description_uz

    def __str__(self):
        return self.title_uz


class Blog(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
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

    image = models.ImageField(upload_to="blog_images/", blank=True, null=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

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

    def __str__(self):
        return self.title_uz


class Certificate(models.Model):
    dev = models.ForeignKey(
        DevInfo,
        on_delete=models.CASCADE,
        related_name="certificates"
    )

    # Title — 3 tilda
    title_uz = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255, blank=True, null=True)
    title_en = models.CharField(max_length=255, blank=True, null=True)

    # Issuer — 3 tilda
    issuer_uz = models.CharField(max_length=255, blank=True, null=True)
    issuer_ru = models.CharField(max_length=255, blank=True, null=True)
    issuer_en = models.CharField(max_length=255, blank=True, null=True)

    issued_date = models.DateField(blank=True, null=True)
    image = models.ImageField(upload_to="certificates/")

    def get_title(self, lang='uz'):
        if lang == 'ru':
            return self.title_ru or self.title_uz
        elif lang == 'en':
            return self.title_en or self.title_uz
        return self.title_uz

    def get_issuer(self, lang='uz'):
        if lang == 'ru':
            return self.issuer_ru or self.issuer_uz
        elif lang == 'en':
            return self.issuer_en or self.issuer_uz
        return self.issuer_uz

    def __str__(self):
        return f"{self.title_uz} — {self.dev.full_name}"