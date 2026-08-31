import re
from rest_framework import serializers


def validate_letters_space(value, field_name="Field"):
    if not re.match(r'^[A-Za-z ]+$', value):
        raise serializers.ValidationError(
            f"{field_name} can contain only letters and spaces."
        )
    return value


def validate_alphanumeric(value, field_name="Field"):
    if not re.match(r'^[A-Za-z0-9]+$', value):
        raise serializers.ValidationError(
            f"{field_name} can contain only letters and numbers."
        )
    return value


def validate_alphanumeric_space(value, field_name="Field"):
    if not re.match(r'^[A-Za-z0-9 ]+$', value):
        raise serializers.ValidationError(
            f"{field_name} can contain only letters, numbers and spaces."
        )
    return value


def validate_description(value):
    if value and len(value) > 500:
        raise serializers.ValidationError(
            "Description cannot exceed 500 characters."
        )
    return value


def validate_permissions(value):
    if value is None:
        return {}

    if not isinstance(value, dict):
        raise serializers.ValidationError(
            "Permissions must be a valid JSON object."
        )

    return value


def validate_name(value, field_name="Field"):
    if not re.match(r'^[A-Za-z\s]+$', value.strip()):
        raise serializers.ValidationError(
            f"{field_name} can contain only letters and spaces."
        )
    return value.strip()
