# syntax=docker/dockerfile:1.7

###############################
# Builder Stage
###############################
FROM python:3.10-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        pkg-config \
        default-libmysqlclient-dev \
        libssl-dev \
        libffi-dev && \
    rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

COPY erp_project/require.txt .

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r require.txt

###############################
# Runtime Stage
###############################
FROM python:3.10-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Asia/Kolkata \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        default-mysql-client \
        libmariadb3 \
        wkhtmltopdf \
        fontconfig \
        xfonts-75dpi \
        xfonts-base \
        libcairo2 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libgdk-pixbuf-2.0-0 \
        libxrender1 \
        libxext6 \
        shared-mime-info \
        curl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv

COPY . .

RUN python -c "import MySQLdb; print('mysqlclient OK')"

ENV SECRET_KEY=dummy \
    DEBUG=False \
    DB_ENGINE=django.db.backends.mysql \
    DB_HOST=dummy \
    DB_PORT=3306 \
    DB_NAME=dummy \
    DB_USER=dummy \
    DB_PASSWORD=dummy \
    ALLOWED_HOSTS=* \
    CORS_ALLOWED_ORIGINS=http://localhost \
    FRONTEND_URL=http://localhost \
    EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend \
    EMAIL_PORT=587 \
    EMAIL_USE_TLS=True \
    EMAIL_HOST=localhost \
    EMAIL_HOST_USER=dummy \
    EMAIL_HOST_PASSWORD=dummy \
    MEDIA_URL=/media/

RUN python erp_project/manage.py collectstatic --noinput

RUN addgroup --system app && \
    adduser --system --ingroup app app

RUN chown -R app:app /app

USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
CMD curl -f http://127.0.0.1:8000/ || exit 1

CMD ["gunicorn", \
     "--chdir", "erp_project", \
     "erp_backend.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "60"]