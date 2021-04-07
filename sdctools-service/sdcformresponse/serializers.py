from rest_framework import serializers
from .models import *
from sdcform.models import Choice


class ChoiceAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChoiceAnswer
        fields = ["selection", "addition"]

    def to_representation(self, obj):
        representation = super().to_representation(obj)

        if getattr(obj, "addition") is None:
            representation.pop("addition")
        else:
            answer = getattr(obj, "answer")
            sdcquestion = answer.sdcquestion
            choice = Choice.objects.get(text=getattr(obj, "selection"),
                                        sdcquestion=sdcquestion)

            if choice.input_type == "int":
                representation["addition"] = int(representation["addition"])

        return representation


class AnswerSerializer(serializers.ModelSerializer):
    questionID = serializers.IntegerField(
        source="sdcquestion.id", read_only=True)

    class Meta:
        abstract = True
        fields = ["questionID"]


class FreeTextAnswerSerializer(AnswerSerializer):
    class Meta:
        model = FreeTextAnswer
        fields = AnswerSerializer.Meta.fields + ["answer"]


class IntegerAnswerSerializer(AnswerSerializer):
    class Meta:
        model = IntegerAnswer
        fields = AnswerSerializer.Meta.fields + ["answer"]


class TrueFalseAnswerSerializer(AnswerSerializer):
    class Meta:
        model = TrueFalseAnswer
        fields = AnswerSerializer.Meta.fields + ["answer"]


class SingleChoiceAnswerSerializer(AnswerSerializer):
    answer = ChoiceAnswerSerializer(source="singlechoice", read_only=True)

    class Meta:
        model = SingleChoiceAnswer
        fields = AnswerSerializer.Meta.fields + ["answer"]


class MultipleChoiceAnswerSerializer(AnswerSerializer):
    answer = ChoiceAnswerSerializer(source="multiple_choices", many=True,
                                    read_only=True)

    class Meta:
        model = MultipleChoiceAnswer
        fields = AnswerSerializer.Meta.fields + ["answer"]


class SDCFormResponseSerializer(serializers.ModelSerializer):
    patientID = serializers.CharField(source="patient_id.ohip",
                                      read_only=True)
    clinicianID = serializers.CharField(source="clinician_id.identifier",
                                        read_only=True)
    sdcFormID = serializers.IntegerField(source="sdcform.id", read_only=True)
    diagnosticProcedureID = serializers.CharField(
        source="diagnostic_procedure_id.code", read_only=True)

    class Meta:
        model = SDCFormResponse
        fields = ["id", "patientID", "clinicianID", "sdcFormID",
                  "diagnosticProcedureID", "timestamp"]

    def to_representation(self, obj):
        representation = super().to_representation(obj)
        sdcformresponse = SDCFormResponse.objects.get(id=getattr(obj, "id"))

        if sdcformresponse.sdcform.diagnostic_procedure_id is None:
            representation["outdated"] = True
        else:
            representation["outdated"] = False

        answers = list(sdcformresponse.freetextanswer_set.all()) + \
            list(sdcformresponse.integeranswer_set.all()) + \
            list(sdcformresponse.truefalseanswer_set.all()) + \
            list(sdcformresponse.singlechoiceanswer_set.all()) + \
            list(sdcformresponse.multiplechoiceanswer_set.all())
        answers.sort(key=lambda x: x.sdcquestion.id)
        representation["answers"] = []

        for answer in answers:
            if answer.sdcquestion.type == "free-text":
                answer_serializer = FreeTextAnswerSerializer(instance=answer,
                                                             read_only=True)
            elif answer.sdcquestion.type == "integer":
                answer_serializer = IntegerAnswerSerializer(instance=answer,
                                                            read_only=True)
            elif answer.sdcquestion.type == "true-false":
                answer_serializer = TrueFalseAnswerSerializer(instance=answer,
                                                              read_only=True)
            elif answer.sdcquestion.type == "single-choice":
                answer_serializer = SingleChoiceAnswerSerializer(
                    instance=answer, read_only=True)
            else:
                answer_serializer = MultipleChoiceAnswerSerializer(
                    instance=answer, read_only=True)
            representation["answers"].append(answer_serializer.to_representation(answer))

        return representation


class SDCFormResponseMetadataSerializer(serializers.ModelSerializer):
    patientID = serializers.CharField(source="patient_id.ohip",read_only=True)
    clinicianID = serializers.CharField(source="clinician_id.identifier",read_only=True)
    sdcFormID = serializers.IntegerField(source="sdcform.id", read_only=True)
    diagnosticProcedureID = serializers.CharField(source="diagnostic_procedure_id.code", read_only=True)

    class Meta:
        model = SDCFormResponse
        fields = ["id", "patientID", "clinicianID", "sdcFormID",
                  "diagnosticProcedureID", "timestamp"]

    def to_representation(self, obj):
        representation = super().to_representation(obj)
        sdcformresponse = SDCFormResponse.objects.get(id=getattr(obj, "id"))

        if sdcformresponse.sdcform.diagnostic_procedure_id is None:
            representation["outdated"] = True
        else:
            representation["outdated"] = False

        return representation


class InvalidInputSerializer(serializers.ModelSerializer):
    questionID = serializers.IntegerField(source="sdcquestion.id", read_only=True)

    class Meta:
        model = InvalidInput
        fields = ["questionID", "message"]
