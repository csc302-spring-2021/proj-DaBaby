from rest_framework import serializers
from .models import *


class ChoiceSerializer(serializers.ModelSerializer):
    optionalFieldInputType = serializers.CharField(
        source="input_type", read_only=True)

    class Meta:
        model = Choice
        fields = ["id", "text", "optionalFieldInputType"]


class SDCQuestionSerializer(serializers.ModelSerializer):
    questionText = serializers.IntegerField(
        source="text", read_only=True)
    controllerID = serializers.IntegerField(
        source="controller.id", read_only=True)
    controllerAnswerEnabler = serializers.Field(
        source="controller_answer_enabler")
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = SDCQuestion
        fields = ["id", "type", "questionText", "controllerID",
                  "controllerAnswerEnabler", "choices"]

    def __init__(self, *args, **kwargs):
        if len(self.fields["choices"].get_initial()) == 0:
            del self.fields["choices"]

        super().__init__(*args, **kwargs)


class SectionSerializer(serializers.ModelSerializer):
    questions = SDCQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ["id", "name", "questions"]


class SDCFormSerializer(serializers.ModelSerializer):
    diagnosticProcedureID = serializers.CharField(
        source="diagnostic_procedure_id.code", read_only=True)
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = SDCForm
        fields = ["id", "name", "diagnosticProcedureID", "sections"]
