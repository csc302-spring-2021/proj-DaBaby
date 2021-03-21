from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import xmltodict

from .models import *
from .serializers import *

# Create your views here.


@api_view(['GET', 'POST'])
def sdcformresponses(request):
    if request.method == "GET":
        lst = SDCFormResponse.objects.all()
        serializer = SDCFormResponseSerializer(lst, many=True)
        return Response(serializer.data)
    else:
        try:
            sdc_form = SDCForm.objects.get(id=request.data["sdcFormID"])
        except SDCForm.DoesNotExist:
            content = {
                'message':
                    'This sdcFormID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        diagnostic_procedure_id = sdc_form.diagnostic_procedure_id

        if diagnostic_procedure_id is None:
            content = {
                'message':
                    'The sdcForm associated with the sdcFormID does not have a '
                    'diagnosticProcedureID. This means that the sdcForm is '
                    'outdated and should not be used for creating an '
                    'sdcFormResponse'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        patient_id = PatientID(ohip=request.data["patientID"])
        try:
            patient_id.clean_fields()
        except ValidationError:
            content = {
                'message': 'The patientID string should have a fixed length of '
                           '10'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        patient_id.save()

        clinician_id = FormFillerID(identifier=request.data["clinicianID"])
        try:
            clinician_id.clean_fields()
        except ValidationError:
            content = {
                'message': 'The clinicianID string should have a fixed length '
                           'of 12'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        clinician_id.save()

        sdc_form_response = SDCFormResponse(
            patient_id=patient_id, clinician_id=clinician_id, sdcform=sdc_form,
            diagnostic_procedure_id=diagnostic_procedure_id)
        sdc_form_response.save()

        sections = sdc_form.sections.all()

        for section in sections:
            questions = section.questions.all()

            for question in questions:
                if question.type == "free-text":
                    answer = FreeTextAnswer(sdcformresponse=sdc_form_response,
                                            sdcquestion=question, answer="")
                elif question.type == "integer":
                    answer = IntegerAnswer(sdcformresponse=sdc_form_response,
                                           sdcquestion=question, answer=None)
                elif question.type == "true-false":
                    answer = TrueFalseAnswer(sdcformresponse=sdc_form_response,
                                             sdcquestion=question, answer=None)
                elif question.type == "single-choice":
                    answer = SingleChoiceAnswer(
                        sdcformresponse=sdc_form_response, sdcquestion=question)
                else:
                    answer = MultipleChoiceAnswer(
                        sdcformresponse=sdc_form_response, sdcquestion=question)
                answer.save()

        serializer = SDCFormResponseSerializer(instance=sdc_form_response)
        json = {
            "message": "Success",
            "responseObject": serializer.data
        }
        return Response(json)


@api_view(['GET', 'PUT', 'DELETE'])
def sdcformresponse(request, response_id):
    pass
