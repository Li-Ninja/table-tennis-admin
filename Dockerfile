FROM node:20.10.0-slim as builder
FROM nginx
WORKDIR /app
# also can use .dockerignore filter didn't use files
COPY dist/spa .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
