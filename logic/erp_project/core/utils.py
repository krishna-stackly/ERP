# core/utils.py  (or wherever makes sense in your project)

from rest_framework import status
from rest_framework.response import Response


def validation_error_response(serializer) -> Response:
    """
    Returns first validation error message in format {"error": "Message here"}
    Safe even if errors is empty or weirdly structured.
    """
    if serializer.errors:
        # Get first field's first message
        first_errors = next(iter(serializer.errors.values()), None)
        
        if isinstance(first_errors, list) and first_errors:
            return Response(
                {"error": first_errors[0]},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if isinstance(first_errors, str):
            return Response(
                {"error": first_errors},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Rare nested case
        if isinstance(first_errors, dict) and first_errors:
            nested = next(iter(first_errors.values()), "Validation error")
            return Response(
                {"error": str(nested)},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Fallback
    return Response(
        {"error": "Invalid data provided"},
        status=status.HTTP_400_BAD_REQUEST
    )