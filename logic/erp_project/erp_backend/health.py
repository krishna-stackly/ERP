"""
Health check endpoint for container orchestration (K8s liveness/readiness
probes, Docker Compose healthcheck, load balancer health checks, etc.)

Intentionally lives at the project level, not inside an app, since it's
infrastructure concern rather than business logic — and intentionally has
NO authentication requirement, since the orchestrator calling it has no
user token.
"""
from django.db import connections
from django.db.utils import OperationalError
from django.http import JsonResponse


def healthz(request):
    """
    Returns 200 if the app can serve traffic (DB reachable), 503 otherwise.
    K8s readiness probes should hit this — a Pod that can't reach its DB
    shouldn't receive traffic yet.
    """
    db_ok = True
    db_error = None
    try:
        connections["default"].cursor()
    except OperationalError as e:
        db_ok = False
        db_error = str(e)

    status_code = 200 if db_ok else 503
    payload = {"status": "ok" if db_ok else "unhealthy", "database": db_ok}
    if db_error:
        payload["error"] = db_error

    return JsonResponse(payload, status=status_code)


def livez(request):
    """
    Returns 200 if the process is up at all — no DB check.
    K8s liveness probes should hit this — a slow/unreachable DB shouldn't
    trigger a container *restart* (that wouldn't fix a DB problem and would
    just cause a restart loop); it should only affect readiness (above).
    """
    return JsonResponse({"status": "ok"}, status=200)
