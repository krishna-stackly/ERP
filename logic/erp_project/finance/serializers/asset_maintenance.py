from rest_framework import serializers
from ..models.asset_maintenance import (
    Technician,
    AssetMaintenanceItem,
    AssetMaintenanceAttachment,
    AssetMaintenanceComment,
    AssetMaintenanceHistory,
    AssetMaintenance
)
class TechnicianSerializer(serializers.ModelSerializer):

    class Meta:
        model = Technician
        fields = [
            "id",
            "technician_id",
            "employee_code",
            "full_name",
            "date_of_joining",
            "department",
            "designation",
            "mail_id",
            "contact_number",
            "skill_category",
            "skill_level",
            "shift",
            "work_location",
            "reporting_supervisor",
            "status",
        ]
        read_only_fields = ["id", "technician_id"]

    def validate_contact_number(self, value):
        if not value.lstrip("+").isdigit():
            raise serializers.ValidationError(
                "Contact number must contain digits and may start with '+'."
        )
        if len(value) < 10 or len(value) > 15:
            raise serializers.ValidationError(
                "Contact number must be between 10 and 15 digits."
            )
        return value

    def validate_employee_code(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Employee code cannot be blank."
            )
        return value
    

class AssetMaintenanceItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = AssetMaintenanceItem
        fields = [
            "id",
            "part_code",
            "part_name",
            "uom",
            "quantity",
            "unit_cost",
            "total_cost",
            "Technician",
        ]
        read_only_fields = ["total_cost"]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than zero."
            )
        return value

    def validate_unit_cost(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Unit cost must be greater than zero."
            )
        return value
    



class AssetMaintenanceAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AssetMaintenanceAttachment
        fields = [
            "id",
            "file",
            "uploaded_by",
            "uploaded_at",
            "description",
        ]
        read_only_fields = ["id", "uploaded_by", "uploaded_at"]


class AssetMaintenanceCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AssetMaintenanceComment
        fields = [
            "id",
            "comment",
            "created_by",
            "timestamp",
        ]
        read_only_fields = ["id", "created_by", "timestamp"]


class AssetMaintenanceHistorySerializer(serializers.ModelSerializer):
    action_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AssetMaintenanceHistory
        fields = [
            "id",
            "event_type",
            "action_by",
            "details",
            "timestamp",
        ]
        read_only_fields = ["id", "action_by", "timestamp"]


class AssetMaintenanceSerializer(serializers.ModelSerializer):
    line_items  = AssetMaintenanceItemSerializer(many=True, read_only=True)
    attachments = AssetMaintenanceAttachmentSerializer(many=True, read_only=True)
    comments    = AssetMaintenanceCommentSerializer(many=True, read_only=True)
    history     = AssetMaintenanceHistorySerializer(many=True, read_only=True)
    assigned_technician = TechnicianSerializer(read_only=True)

    class Meta:
        model = AssetMaintenance
        fields = [
            "id",
            "maintenance_id",
            "asset_id",
            "maintenance_type",
            "schedule_frequency",
            "start_date",
            "end_date",
            "last_serviced_date",
            "next_due_date",
            "assigned_technician",
            "status",
            "remarks",
            "line_items",
            "attachments",
            "comments",
            "history",
        ]
        read_only_fields = ["id", "maintenance_id"]


class AssetMaintenanceWriteSerializer(serializers.ModelSerializer):
    line_items = AssetMaintenanceItemSerializer(many=True, required=False)

    class Meta:
        model = AssetMaintenance
        fields = [
            "asset_id",
            "maintenance_type",
            "schedule_frequency",
            "start_date",
            "end_date",
            "last_serviced_date",
            "next_due_date",
            "assigned_technician",
            "status",
            "remarks",
            "line_items",
        ]
        read_only_fields = ["maintenance_id"]

    def validate(self, data):
        start_date = data.get("start_date")
        end_date   = data.get("end_date")
        next_due_date     = data.get("next_due_date")
        last_serviced_date = data.get("last_serviced_date")

        # start_date must be before end_date
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({
                "end_date": "End date must be after start date."
            })

        # last_serviced_date must be before next_due_date
        if last_serviced_date and next_due_date and last_serviced_date > next_due_date:
            raise serializers.ValidationError({
                "next_due_date": "Next due date must be after last serviced date."
            })

        return data

    def create(self, validated_data):
        line_items_data = validated_data.pop("line_items", [])

        maintenance = AssetMaintenance.objects.create(**validated_data)

        for item_data in line_items_data:
            AssetMaintenanceItem.objects.create(
                maintenance=maintenance,
                **item_data
            )

        return maintenance

    def update(self, instance, validated_data):
        line_items_data = validated_data.pop("line_items", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if line_items_data is not None:
            for item_data in line_items_data:
                item_id = item_data.pop("id", None)

                # Delete item
                if item_id and item_data.get("delete", False):
                    AssetMaintenanceItem.objects.filter(
                        id=item_id,
                        maintenance=instance
                    ).delete()
                    continue

                # Update item
                if item_id:
                    item = AssetMaintenanceItem.objects.get(
                        id=item_id,
                        maintenance=instance
                    )
                    serializer = AssetMaintenanceItemSerializer(
                        item,
                        data=item_data,
                        partial=True
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

                # Create new item
                else:
                    AssetMaintenanceItem.objects.create(
                        maintenance=instance,
                        **item_data
                    )

        return instance