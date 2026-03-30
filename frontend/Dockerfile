# ── 1-bosqich: Build ──
FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ── 2-bosqich: Nginx ──
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf