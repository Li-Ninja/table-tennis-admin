FROM node:16.10.0-slim as builder
FROM nginx
WORKDIR /app
# also can use .dockerignore filter didn't use files
COPY dist/spa .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]
