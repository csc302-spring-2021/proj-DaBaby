from rest_framework import serializers
from .models import *


class ChoiceSerializer(serializers.ModelSerializer):
    optionalFieldInputType = serializers.CharField(
        source="input_type", read_only=True)

    class Meta:
        model = Choice
        fields = ["id", "text", "optionalFieldInputType"]


class SDCQuestionSerializer(serializers.ModelSerializer):
    questionText = serializers.CharField(
        source="text", read_only=True)
    controllerID = serializers.IntegerField(
        source="controller.id", read_only=True, allow_null=True)
    controllerAnswerEnabler = serializers.CharField(
        source="controller_answer_enabler", read_only=True)
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = SDCQuestion
        fields = ["id", "type", "questionText", "controllerID",
                  "controllerAnswerEnabler", "choices"]

    def to_representation(self, obj):
        r = super().to_representation(obj)

        if getattr(obj, "type") not in {"single-choice", "multiple-choice"}:
            r.pop("choices")

        return r


class SectionSerializer(serializers.ModelSerializer):
    questions = SDCQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ["id", "name", "questions"]


class SDCFormSerializer(serializers.ModelSerializer):
    diagnosticProcedureID = serializers.CharField(
        source="diagnostic_procedure_id.code", read_only=True, allow_null=True)
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = SDCForm
        fields = ["id", "name", "timestamp", "diagnosticProcedureID", "sections"]
