from django.db import models
from django.conf import settings

class DevInfo(models.Model):
    full_name = models.CharField(max_length=255)
    stack = models.CharField(max_length=255)
    experience = models.IntegerField()
    about = models.TextField()
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class Experience(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('both', 'Full-time & Part-time'),
    ]

    title = models.CharField(max_length=255)  # Software Engineer (Full-Stack)
    company = models.CharField(max_length=255, blank=True, null=True)  # optional (agar ko'rsatmoqchi bo'lsangiz)
    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES
    )
    location = models.CharField(max_length=255, blank=True, null=True)  # Tashkent, UZ
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)  # Present bo'lsa null qoldiriladi
    is_current = models.BooleanField(default=False)

    # Extra fields (JSON yoki TextField qilib yozsak ham bo‘ladi)
    achievements = models.TextField(blank=True, null=True)  # Key Achievements
    responsibilities = models.TextField(blank=True, null=True)  # Responsibilities
    teaching_focus = models.TextField(blank=True, null=True)  # Teaching focus (faqat instructorlar uchun)

    # Student demographics
    student_count = models.PositiveIntegerField(blank=True, null=True)
    age_range = models.CharField(max_length=50, blank=True, null=True)  # "15-30 years"

    def __str__(self):
        return f"{self.title} ({self.employment_type})"


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
        ("PosgreSQl", "PosgreSQl"),
        ("MySQL", "MySQL"),
        ("SQLite", "SQLite"),
    ]
    title = models.CharField(max_length=200)  # Proyekt nomi
    description = models.TextField()  # Proyekt haqida qisqacha
    technologies = models.JSONField()
    project_url = models.URLField(blank=True, null=True)  # "View Project" linki
    created_at = models.DateTimeField(auto_now_add=True)  # qachon qo‘shilgan

    def __str__(self):
        return self.title

class Blog(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="blogs"
    )

    title = models.CharField(max_length=255)
    content = models.TextField()

    image = models.ImageField(
        upload_to="blog_images/",
        blank=True,
        null=True
    )

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title