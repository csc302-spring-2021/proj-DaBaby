from django.db import models

# Create your models here.


class DiagnosticProcedureID(models.Model):
    code = models.CharField(max_length=100, primary_key=True)


class SDCForm(models.Model):
    name = models.CharField(max_length=100)
    diagnostic_procedure_id = models.OneToOneField(DiagnosticProcedureID,
                                                   on_delete=models.CASCADE,
                                                   blank=True, null=True)
    timestamp = models.DateTimeField(blank=True, auto_now=True)


class Section(models.Model):
    name = models.CharField(max_length=100)
    sdcform = models.ForeignKey(SDCForm, related_name="sections",
                                on_delete=models.CASCADE)


class SDCQuestion(models.Model):
    type = models.CharField(max_length=15)
    text = models.TextField()
    controller = models.ForeignKey('self', on_delete=models.CASCADE,
                                   default=None, blank=True, null=True)
    controller_answer_enabler = models.TextField(default=None, blank=True,
                                                 null=True)
    section = models.ForeignKey(Section, related_name="questions",
                                on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        types = {"single-choice", "multiple-choice", "free-text", "integer",
                 "true-false"}
        if self.type in types:
            super().save(*args, **kwargs)
        else:
            raise ValueError('The type field can only be one of the following '
                             'strings: ' + f'{", ".join(types)}')


class Choice(models.Model):
    text = models.TextField()
    input_type = models.CharField(max_length=3, default=None, blank=True,
                                  null=True)
    sdcquestion = models.ForeignKey(SDCQuestion, related_name="choices",
                                    on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        input_types = {"int", "str"}
        if self.input_type in input_types or self.input_type is None:
            super().save(*args, **kwargs)
        else:
            raise ValueError('The input_type field can only be one of the '
                             'following strings: int, str')

    class Meta:
        unique_together = (('text', 'sdcquestion'),)
