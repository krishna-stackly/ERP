# syntax=docker/dockerfile:1

# Stage 1: Build the App
# node:20, not 18 — react-router@7.x requires Node >=20 (confirmed via
# EBADENGINE warning from your own package.json's dependency tree, not
# a guess). Building on 18 "mostly worked" via warning-only tolerance,
# but isn't something to rely on long-term.
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

# npm ci (not npm install): installs EXACTLY what's in package-lock.json,
# fails loudly if package.json/package-lock.json are out of sync, and is
# faster in CI/Docker since it skips dependency resolution. npm install is
# for interactive local dev where you WANT it to update the lockfile;
# inside a reproducible build, that's the wrong behavior.
# BuildKit cache mount: npm's download cache persists across builds without
# being baked into any image layer — speeds up repeated local builds.
RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY . .

# Vite/Rollup's bundling+minify step can exceed Node's default heap on
# memory-constrained build hosts (e.g. small EC2 instances). Raise it
# explicitly rather than relying on Node's auto-detected default.
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Template gets envsubst'd into conf.d/default.conf at container startup
# (this is built into the nginx:alpine image's docker-entrypoint.sh)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Defaults for local `docker run` convenience — override these at deploy
# time. docker-compose: set via environment: in the service definition.
# Kubernetes: set via env: in the container spec (or a ConfigMap).
# NOTE: matches the "backend-qa" service name used in docker-compose.yml —
# keep this in sync if the backend service is ever renamed.
ENV BACKEND_HOST=backend-qa
ENV BACKEND_PORT=8000

COPY --from=build /app/dist /usr/share/nginx/html

# Basic container-level healthcheck: is Nginx actually serving the SPA's
# index page? (Doesn't check the backend proxy — Compose/K8s healthchecks
# for that live on the backend service itself.)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
