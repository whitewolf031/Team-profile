# apps/blog_news/telegram.py
import telebot
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_blog_to_telegram(blog) -> bool:
    token      = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
    channel_id = getattr(settings, 'TELEGRAM_CHANNEL_ID', None)
    topic_id   = getattr(settings, 'TELEGRAM_TOPIC_ID', None)

    if not token:
        logger.error("TELEGRAM_BOT_TOKEN topilmadi!")
        return False

    if not channel_id:
        logger.error("TELEGRAM_CHANNEL_ID topilmadi!")
        return False

    try:
        bot = telebot.TeleBot(token)

        title   = blog.get_title('uz')
        content = blog.get_content('uz')

        text = (
            f"<b>📰 {title}</b>\n\n"
            f"{content[:800]}{'...' if len(content) > 800 else ''}\n\n"
        )

        # SITE_URL bo'lsa havola qo'shamiz
        site_url = getattr(settings, 'SITE_URL', None)
        if site_url:
            text += f"🔗 <a href='{site_url}/blog/{blog.pk}/'>To'liq o'qish</a>"

        kwargs = {
            "parse_mode": "HTML",
            "disable_web_page_preview": False,
        }

        if topic_id:
            kwargs["message_thread_id"] = int(topic_id)

        # Rasm bilan yuborish
        if blog.image:
            try:
                with open(blog.image.path, 'rb') as photo:
                    bot.send_photo(channel_id, photo, caption=text, **kwargs)
                logger.info(f"Rasm bilan yuborildi: pk={blog.pk}")
                return True
            except Exception as e:
                logger.warning(f"Rasm yuborishda xato, matn bilan urinilmoqda: {e}")

        # Video bilan yuborish
        elif blog.video:
            try:
                with open(blog.video.path, 'rb') as video:
                    bot.send_video(channel_id, video, caption=text, **kwargs)
                logger.info(f"Video bilan yuborildi: pk={blog.pk}")
                return True
            except Exception as e:
                logger.warning(f"Video yuborishda xato, matn bilan urinilmoqda: {e}")

        # Faqat matn
        bot.send_message(channel_id, text, **kwargs)
        logger.info(f"Matn bilan yuborildi: pk={blog.pk}")
        return True

    except Exception as e:
        logger.error(f"Telegram yuborishda xato: {e}")
        return False