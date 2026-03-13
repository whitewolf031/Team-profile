from django.contrib import admin
from .models import *

admin.site.register(DevInfo)
admin.site.register(Experience)
admin.site.register(Project)

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['title', 'issuer', 'dev', 'issued_date']