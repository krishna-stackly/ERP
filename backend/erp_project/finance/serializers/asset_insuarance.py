from rest_framework import serializers

from ..models.asset_insuarance import (
    Asset,
    asset_InsuranceCompany,
    asset_ResponsibleEntity,
    AssetInsurancePolicy,
    asset_PremiumPayment,
    asset_PolicyLineItem,
    asset_PolicyAttachment,
    asset_PolicyComment,
    asset_PolicyHistory,
)


class AssetSerializer(serializers.ModelSerializer):
    asset_id = serializers.CharField(read_only=True)

    class Meta:
        model = Asset
        fields = "__all__"


class InsuranceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = asset_InsuranceCompany
        fields = "__all__"


class ResponsibleEntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = asset_ResponsibleEntity
        fields = "__all__"


class PolicyLineItemSerializer(serializers.ModelSerializer):
    asset = AssetSerializer(read_only=True)

    asset_id = serializers.PrimaryKeyRelatedField(
        queryset=Asset.objects.all(),
        source="asset",
        write_only=True
    )

    class Meta:
        model = asset_PolicyLineItem
        fields = ["id", "asset", "asset_id"]

class PremiumPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = asset_PremiumPayment
        fields = "__all__"


class PolicyAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = asset_PolicyAttachment
        fields = ["id", "file", "uploaded_at"]


class PolicyCommentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = asset_PolicyComment
        fields = ["id", "comment", "created_by", "created_at"]


class PolicyHistorySerializer(serializers.ModelSerializer):
    performed_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = asset_PolicyHistory
        fields = ["id", "action", "performed_by", "performed_at"]


 

class AssetInsurancePolicySerializer(serializers.ModelSerializer):
    asset = AssetSerializer(read_only=True)
    insurance_company = InsuranceCompanySerializer(read_only=True)
    insured_by = ResponsibleEntitySerializer(read_only=True)

    line_items = serializers.SerializerMethodField()
    premium_payments = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    class Meta:
        model = AssetInsurancePolicy
        fields = [
            "id",
            "asset",
            "insurance_company",
            "policy_number",
            "policy_type",
            "coverage_amount",
            "policy_start_date",
            "policy_end_date",
            "renewal_reminder_days",
            "insured_by",
            "line_items",
            "premium_payments",
            "attachments",
            "comments",
            "history",
        ]

    def get_line_items(self, obj):
        return PolicyLineItemSerializer(
            obj.line_items.all(),
            many=True
        ).data

    def get_premium_payments(self, obj):
        return PremiumPaymentSerializer(
            obj.premium_payments.all(),
            many=True
        ).data

    def get_attachments(self, obj):
        return PolicyAttachmentSerializer(
            obj.attachments.all(),
            many=True
        ).data

    def get_comments(self, obj):
        return PolicyCommentSerializer(
            obj.comments.all(),
            many=True
        ).data

    def get_history(self, obj):
        return PolicyHistorySerializer(
            obj.history.all(),
            many=True
        ).data




class AssetInsurancePolicyWriteSerializer(serializers.ModelSerializer):

    line_items = PolicyLineItemSerializer(many=True, required=False)
    premium_payments = PremiumPaymentSerializer(many=True, required=False)

    attachments = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )

    comments = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )

    class Meta:
        model = AssetInsurancePolicy
        fields = [
            "asset",
            "insurance_company",
            "policy_number",
            "policy_type",
            "coverage_amount",
            "policy_start_date",
            "policy_end_date",
            "renewal_reminder_days",
            "insured_by",
            "line_items",
            "premium_payments",
            "attachments",
            "comments",
        ]

    def create(self, validated_data):
        line_items_data = validated_data.pop("line_items", [])
        premium_payments_data = validated_data.pop("premium_payments", [])
        attachments_data = validated_data.pop("attachments", [])
        comments_data = validated_data.pop("comments", [])
 
        print("LINE ITEMS DATA =", line_items_data)

        policy = AssetInsurancePolicy.objects.create(**validated_data)

        for item in line_items_data:
         print("ITEM =", item)

        asset_PolicyLineItem.objects.create(
            policy=policy,
            asset=item["asset"]
        )

        for payment in premium_payments_data:
         asset_PremiumPayment.objects.create(
            policy=policy,
            **payment
        )

        for attachment in attachments_data:
         asset_PolicyAttachment.objects.create(
            policy=policy,
            **attachment
        )

        for comment in comments_data:
         asset_PolicyComment.objects.create(
            policy=policy,
            **comment
        )

        return policy

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance