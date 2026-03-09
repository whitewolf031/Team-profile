from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from myprofile.models import UsersInfo
from myprofile.serializers import ContactSerializer
from admin_control.models import (DevInfo, Experience, Project, Blog)
from admin_control.serializers import (DevInfoSerializer, DevExperienceSerializer, DevProjectSerializer, DevBlogSerializer)
from drf_spectacular.utils import extend_schema
from config.settings import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
import telebot


def send_telegram_message(text: str, parse_mode: str = "HTML") -> bool:
    """
    Telegramga xabar yuboradi.
    Muvaffaqiyatli bo'lsa → True, aks holda → False
    """
    if not TELEGRAM_BOT_TOKEN:
        print("XATO: TELEGRAM_BOT_TOKEN topilmadi! .env faylni tekshiring.")
        return False

    if not TELEGRAM_CHAT_ID:
        print("XATO: TELEGRAM_CHAT_ID topilmadi!")
        return False

    try:
        bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN)
        bot.send_message(TELEGRAM_CHAT_ID, text, parse_mode="HTML", disable_web_page_preview=True)
        return True
    except Exception as e:
        print(f"Telegram xabarni yuborishda xato: {e}")
        return False


@extend_schema(tags=['User'])
class ContactCreateView(generics.CreateAPIView):
    queryset = UsersInfo.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        instance = serializer.save()

        # Xabar matnini tayyorlash
        data = instance.created_at
        date_str = data.strftime("%Y-%m-%d")
        time_str = data.strftime("%H:%M:%S")

        message = (
            f"<b>New contact message</b>\n"
            f"<b>Sana:</b> ({date_str} {time_str})\n\n"
            f"<b>Name:</b> {instance.name}\n"
            f"<b>Email:</b> {instance.email}\n"
            f"<b>Message:</b> {instance.message}"
        )

        # Telegramga yuborish (lekin bu jarayonni bloklamaslik uchun faqat log qilamiz)
        success = send_telegram_message(message)

        # Agar xohlasangiz bu yerda qo'shimcha logika yozishingiz mumkin
        if not success:
            # Masalan: logger.error(...) yoki boshqa xabar yuborish
            pass

    def create(self, request, *args, **kwargs):
        """
        Contact yaratilgandan keyin muvaffaqiyatli javob qaytarish
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"detail": "Message received and forwarded successfully"},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
@extend_schema(tags=['Dev Info'])
class UserDevInfoListView(generics.ListAPIView):
    queryset = DevInfo.objects.all()
    serializer_class = DevInfoSerializer
    permission_classes = [AllowAny]

@extend_schema(tags=['Dev Experienct'])
class UserDevExperienceListView(generics.ListAPIView):
    queryset = Experience.objects.all()
    serializer_class = DevExperienceSerializer
    permission_classes = [AllowAny]

@extend_schema(tags=['Dev Project'])
class UserDevProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = DevProjectSerializer
    permission_classes = [AllowAny]

@extend_schema(tags=['Dev blog'])
class UserDevBlogtListView(generics.ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = DevBlogSerializer
    permission_classes = [AllowAny]