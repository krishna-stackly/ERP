# syntax=docker/dockerfile:1
#
# Multi-stage build on python:3.10-slim (Debian-based, NOT Alpine).
# Alpine was deliberately avoided: wkhtmltopdf and weasyprint's Cairo/Pango
# bindings are known to be unreliable under Alpine's musl libc — this is a
# real, commonly-hit compatibility wall for PDF-rendering tools specifically,
# not just caution for its own sake. python:slim (Debian/glibc) avoids that
# risk while still being meaningfully smaller than the full ubuntu:22.04 base.

# ============================================================
# STAGE 1: builder — compiles the Python virtualenv
# ============================================================
FROM python:3.10-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# BuildKit cache mounts: apt/pip downloads are cached ACROSS builds, not
# baked into any image layer. Doesn't shrink the final image, but makes
# repeated local builds (e.g. while debugging) much faster — the previous
# Dockerfile re-downloaded everything from scratch every single build.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    libssl-dev \
    libffi-dev

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY erp_project/require.txt erp_project/require.txt
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip setuptools wheel && \
    pip install -r erp_project/require.txt

# ============================================================
# STAGE 2: runtime — what actually ships
# ============================================================
FROM python:3.10-slim AS runtime

ENV TZ=Asia/Kolkata \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    DEBIAN_FRONTEND=noninteractive

# Runtime-only packages — no gcc, no -dev headers, no build toolchain.
#   libmariadb3         shared lib mysqlclient's compiled extension links against
#   wkhtmltopdf + libs  required at RUNTIME by pdfkit (external binary, not just install-time)
#   libcairo2/pango/etc required at RUNTIME by weasyprint (dynamically linked)
#   tzdata, curl        timezone data + container healthchecks
#
# default-mysql-client is OPTIONAL — only useful for manually debugging
# via `docker exec` (mysql/mysqladmin CLI). Not required for the app to
# function; drop it if you want a slightly leaner image.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev \
    default-mysql-client \
    wkhtmltopdf \
    xfonts-75dpi \
    xfonts-base \
    fontconfig \
    libxrender1 \
    libxext6 \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    shared-mime-info \
    tzdata \
    curl \
    && wkhtmltopdf --version

COPY --from=builder /opt/venv /opt/venv

WORKDIR /app
COPY . .

EXPOSE 8000

# Build-time-only placeholders so collectstatic can import settings.py
# without needing real secrets baked into the image.
ENV SECRET_KEY=build-time-placeholder-not-used-at-runtime \
    DEBUG=False \
    DB_ENGINE=django.db.backends.mysql \
    DB_HOST=placeholder \
    DB_PORT=3306 \
    DB_NAME=placeholder \
    DB_USER=placeholder \
    DB_PASSWORD=placeholder \
    ALLOWED_HOSTS=localhost \
    CORS_ALLOWED_ORIGINS=http://localhost \
    FRONTEND_URL=http://localhost \
    EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend \
    EMAIL_PORT=587 \
    EMAIL_USE_TLS=True \
    EMAIL_HOST=localhost \
    EMAIL_HOST_USER=placeholder \
    EMAIL_HOST_PASSWORD=placeholder \
    MEDIA_URL=/media/

RUN python3 erp_project/manage.py collectstatic --noinput

# Migrations intentionally NOT run here — run as a separate one-off step
# (K8s Job, or `docker compose run backend-qa python3 erp_project/manage.py
# migrate`) BEFORE scaling up replicas of this image.
CMD ["gunicorn", "--chdir", "erp_project", "erp_backend.wsgi:application", \
     "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "60", \
     "--graceful-timeout", "30", "--max-requests", "1000", "--max-requests-jitter", "50"]
