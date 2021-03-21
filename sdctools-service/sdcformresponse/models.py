from django.db import models
from django.core.validators import MinLengthValidator
from sdcform.models import SDCForm, DiagnosticProcedureID, SDCQuestion

# Create your models here.


class PatientID(models.Model):
    ohip = models.CharField(max_length=10, validators=[MinLengthValidator(10)],
                            primary_key=True)


class FormFillerID(models.Model):
    identifier = models.CharField(max_length=12,
                                  validators=[MinLengthValidator(12)],
                                  primary_key=True)


class SDCFormResponse(models.Model):
    patient_id = models.ForeignKey(PatientID, on_delete=models.CASCADE)
    clinician_id = models.ForeignKey(FormFillerID, on_delete=models.CASCADE)
    sdcform = models.ForeignKey(SDCForm, on_delete=models.CASCADE)
    diagnostic_procedure_id = models.ForeignKey(DiagnosticProcedureID,
                                                on_delete=models.CASCADE)
    timestamp = models.DateTimeField(blank=True, auto_now=True)


class Answer(models.Model):
    sdcformresponse = models.ForeignKey(SDCFormResponse,
                                        on_delete=models.CASCADE)
    sdcquestion = models.ForeignKey(SDCQuestion, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class FreeTextAnswer(Answer):
    answer = models.TextField()


class IntegerAnswer(Answer):
    answer = models.IntegerField(blank=True, null=True)


class TrueFalseAnswer(Answer):
    answer = models.BooleanField(blank=True, null=True)


class SingleChoiceAnswer(Answer):
    pass


class MultipleChoiceAnswer(Answer):
    pass


class ChoiceAnswer(models.Model):
    selection = models.TextField()
    addition = models.TextField(default=None, blank=True, null=True)


class SingleChoice(ChoiceAnswer):
    answer = models.OneToOneField(SingleChoiceAnswer, on_delete=models.CASCADE)


class MultipleChoice(ChoiceAnswer):
    answer = models.ForeignKey(MultipleChoiceAnswer, on_delete=models.CASCADE,
                               related_name="multiple_choices")
