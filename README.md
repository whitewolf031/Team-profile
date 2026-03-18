npm run dev -- --port 8080

# 1. Hamma narsani build qilish
docker-compose build

# 2. Ishga tushirish
docker-compose up -d

# 3. Loglarni kuzatish
docker-compose logs -f

# 4. Faqat web logini ko'rish
docker-compose logs -f web
```

**Ketma-ketlik qanday bo'ladi:**
```
1. db container ishga tushadi
2. PostgreSQL tayyor bo'lguncha healthcheck kutadi (5s × 5)
3. web container ishga tushadi
4. entrypoint.sh → migrate → superuser → gunicorn
5. frontend container ishga tushadi → nginx


docker-compose down
docker-compose up -d --build