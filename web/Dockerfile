# Stage 1: Build the App
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Template gets envsubst'd into conf.d/default.conf at container startup
# (this is built into the nginx:alpine image's docker-entrypoint.sh)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Defaults for local `docker run` convenience — override these at deploy time.
# docker-compose: set via environment: in the service definition.
# Kubernetes: set via env: in the container spec (or a ConfigMap).
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=8000

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
