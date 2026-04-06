# apps/blog_news/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Blog
from .telegram import send_blog_to_telegram
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Blog)
def blog_post_save(sender, instance, created, **kwargs):
    logger.info(
        f"Signal: pk={instance.pk}, is_published={instance.is_published}, "
        f"send_to_telegram={instance.send_to_telegram}, telegram_sent={instance.telegram_sent}"
    )

    # Faqat shart bajarilganda yuborish
    if (
        instance.is_published
        and instance.send_to_telegram
        and not instance.telegram_sent
    ):
        logger.info(f"Telegram ga yuborilmoqda: pk={instance.pk}")
        success = send_blog_to_telegram(instance)

        if success:
            # update() — signalni qayta ishga tushirmaydi (infinite loop yo'q)
            Blog.objects.filter(pk=instance.pk).update(telegram_sent=True)
            logger.info(f"✅ Telegram ga yuborildi: pk={instance.pk}")
        else:
            logger.error(f"❌ Telegram ga yuborishda xato: pk={instance.pk}")