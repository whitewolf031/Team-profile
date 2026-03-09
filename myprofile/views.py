from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from myprofile.models import UsersInfo
from myprofile.serializers import ContactSerializer
from admin_control.models import (DevInfo, Experience, Project, Blog)
from admin_control.serializers import (DevInfoSerializer, DevExperienceSerializer, DevProjectSerializer, DevBlogSerializer, DevInfoDetailSerializer)
from drf_spectacular.utils import extend_schema
from config.settings import TELEGRAM_BOT_TOKEN, TELEGRAM_TOPIC_ID, TELEGRAM_GROUP_ID
import telebot

def send_telegram_message(text: str, parse_mode: str = "HTML") -> bool:
    if not TELEGRAM_BOT_TOKEN:
        print("XATO: TELEGRAM_BOT_TOKEN topilmadi!")
        return False

    if not TELEGRAM_GROUP_ID:
        print("XATO: TELEGRAM_CHAT_ID topilmadi!")
        return False

    try:
        bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN)
        
        kwargs = {
            "parse_mode": "HTML",
            "disable_web_page_preview": True
        }
        
        # Topic ID mavjud bo'lsa qo'shadi
        if TELEGRAM_TOPIC_ID:
            kwargs["message_thread_id"] = int(TELEGRAM_TOPIC_ID)

        bot.send_message(TELEGRAM_GROUP_ID, text, **kwargs)
        return True
    except Exception as e:
        print(f"Telegram xabarni yuborishda xato: {e}")
        return False
    
@extend_schema(tags=['Group message'])
class GroupCreateView(generics.CreateAPIView):
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

def send_telegram_to_chat(chat_id: str, text: str) -> bool:
    if not TELEGRAM_BOT_TOKEN:
        print("XATO: TELEGRAM_BOT_TOKEN topilmadi!")
        return False
    if not chat_id:
        print("XATO: chat_id topilmadi!")
        return False
    try:
        bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN)
        bot.send_message(chat_id, text, parse_mode="HTML", disable_web_page_preview=True)
        return True
    except Exception as e:
        print(f"Telegram xato: {type(e).__name__}: {e}")
        return False


@extend_schema(tags=['Users message'])
class ContactCreateView(generics.CreateAPIView):
    queryset = UsersInfo.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        instance = serializer.save()

        date_str = instance.created_at.strftime("%Y-%m-%d")
        time_str = instance.created_at.strftime("%H:%M:%S")

        message = (
            f"📩 <b>Sizga yangi xabar!</b>\n"
            f"🕐 <b>Sana:</b> {date_str} {time_str}\n\n"
            f"👤 <b>Name:</b> {instance.name}\n"
            f"📧 <b>Email:</b> {instance.email}\n"
            f"💬 <b>Message:</b>\n{instance.message}"
        )

        # dev_id orqali DevInfo dan telegram_chat_id ni olamiz
        dev_id = self.request.data.get("dev_id")

        if dev_id:
            try:
                dev = DevInfo.objects.get(id=dev_id)
                if dev.telegram_chat_id:
                    send_telegram_to_chat(dev.telegram_chat_id, message)
                else:
                    print(f"Dev #{dev_id} ning telegram_chat_id si yo'q")
            except DevInfo.DoesNotExist:
                print(f"DevInfo #{dev_id} topilmadi")
        else:
            print("dev_id request da yo'q")

    def create(self, request, *args, **kwargs):
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

@extend_schema(tags=['Dev Info'])
class DevAdminInfoDetailView(generics.RetrieveAPIView):
    queryset = DevInfo.objects.all()
    serializer_class = DevInfoDetailSerializer
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