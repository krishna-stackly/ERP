
from rest_framework import serializers
from ..models.financial_reporting import (
    FinancialReport,
    FinancialReportData,
    FinancialLineItem,
    FinancialReportAttachment,
    FinancialReportComment,
    FinancialReportHistory,
)


class FinancialLineItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = FinancialLineItem
        fields = "__all__"
        read_only_fields = ["report"]


class FinancialReportAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialReportAttachment
        fields = "__all__"
        read_only_fields = ["report"]


class FinancialReportCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialReportComment
        fields = "__all__"
        read_only_fields = ["report"]


class FinancialReportHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialReportHistory
        fields = "__all__"
        read_only_fields = ["report"]


class FinancialReportDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialReportData
        fields = "__all__"
        read_only_fields = ["report"]


class FinancialReportSerializer(serializers.ModelSerializer):
    data = FinancialReportDataSerializer()
    line_items = FinancialLineItemSerializer(many=True)

    attachments = FinancialReportAttachmentSerializer(many=True, read_only=True)
    comments = FinancialReportCommentSerializer(many=True, read_only=True)
    history = FinancialReportHistorySerializer(many=True, read_only=True)

    class Meta:
        model = FinancialReport
        fields = "__all__"

    def create(self, validated_data):
        data = validated_data.pop("data")
        line_items = validated_data.pop("line_items")

        report = FinancialReport.objects.create(**validated_data)

        FinancialReportData.objects.create(report=report, **data)

        for item in line_items:
            FinancialLineItem.objects.create(report=report, **item)

        FinancialReportHistory.objects.create(
            report=report,
            action="Created",
            performed_by="System"
        )

        return report

    def update(self, instance, validated_data):
        data = validated_data.pop("data", None)
        line_items = validated_data.pop("line_items", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if data:
            FinancialReportData.objects.update_or_create(report=instance, defaults=data)

        if line_items is not None:
            instance.line_items.all().delete()
            for item in line_items:
                FinancialLineItem.objects.create(report=instance, **item)

        FinancialReportHistory.objects.create(
            report=instance,
            action="Updated",
            performed_by="System"
        )

        return instance        