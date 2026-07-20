# syntax=docker/dockerfile:1
#
# Multi-stage build: `builder` compiles Python packages that need a C
# toolchain (mysqlclient, weasyprint's cffi bindings, etc.); `runtime` is
# the actual shipped image and never sees gcc, build-essential, or any
# -dev header package.

# ============================================================
# STAGE 1: builder — compiles the Python virtualenv
# ============================================================
FROM ubuntu:22.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    python3-dev \
    pkg-config \
    gcc \
    build-essential \
    default-libmysqlclient-dev \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY erp_project/require.txt erp_project/require.txt
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r erp_project/require.txt

# ============================================================
# STAGE 2: runtime — what actually ships
# ============================================================
FROM ubuntu:22.04 AS runtime

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Asia/Kolkata \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    libmariadb3 \
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
    && wkhtmltopdf --version \
    && rm -rf /var/lib/apt/lists/*

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
# (K8s Job, or `docker compose run backend python3 erp_project/manage.py
# migrate`) BEFORE scaling up replicas of this image.
CMD ["gunicorn", "--chdir", "erp_project", "erp_backend.wsgi:application", \
     "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "60", \
     "--graceful-timeout", "30", "--max-requests", "1000", "--max-requests-jitter", "50"]
