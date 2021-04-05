from django.core.exceptions import ObjectDoesNotExist, ValidationError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from dateutil import parser

from .serializers import *


@api_view(['GET', 'POST'])
def sdcformresponses(request):
    if request.method == "GET":
        ohip = request.GET.get("patientID", "")
        code = request.GET.get("diagnosticProcedureID", "")
        start_time = request.GET.get("starttime", "")
        end_time = request.GET.get("endtime", "")
        metadata = request.GET.get("metadata", "")
        lst = SDCFormResponse.objects.all()

        if ohip != "":
            try:
                patient_id = PatientID.objects.get(ohip=ohip)
                lst = lst.filter(patient_id=patient_id)
            except PatientID.DoesNotExist:
                lst = SDCFormResponse.objects.none()

        if code != "":
            try:
                diagnostic_procedure_id = DiagnosticProcedureID.objects.get(
                    code=code)
                lst = lst.filter(diagnostic_procedure_id=diagnostic_procedure_id)
            except DiagnosticProcedureID.DoesNotExist:
                lst = SDCFormResponse.objects.none()

        if start_time != "":
            start_timestamp = parser.parse(start_time)
            lst = lst.filter(timestamp__gte=start_timestamp)

        if end_time != "":
            end_timestamp = parser.parse(end_time)
            lst = lst.filter(timestamp__lte=end_timestamp)

        serializer = SDCFormResponseSerializer(lst, many=True)
        d = serializer.data

        if metadata == "true":
            for sdc_form_response in d:
                del sdc_form_response["answers"]

        json = {
            "message": "Success",
            "sdcFormResponses": d
        }
        return Response(json)
    else:
        models_to_save = []

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
        models_to_save.append(patient_id)

        clinician_id = FormFillerID(identifier=request.data["clinicianID"])
        try:
            clinician_id.clean_fields()
        except ValidationError:
            content = {
                'message': 'The clinicianID string should have a fixed length '
                           'of 12'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        models_to_save.append(clinician_id)

        sdc_form_response = SDCFormResponse(
            patient_id=patient_id, clinician_id=clinician_id, sdcform=sdc_form,
            diagnostic_procedure_id=diagnostic_procedure_id)
        models_to_save.append(sdc_form_response)

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
                models_to_save.append(answer)

        for model_ in models_to_save:
            model_.save()

        serializer = SDCFormResponseSerializer(instance=sdc_form_response)
        json = {
            "message": "Success",
            "responseObject": serializer.data
        }
        return Response(json, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def sdcformresponse(request, response_id):
    if request.method == "GET":
        try:
            sdc_form_response = SDCFormResponse.objects.get(id=response_id)
        except SDCFormResponse.DoesNotExist:
            content = {
                'message':
                    'This SDCFormResponseID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        serializer = SDCFormResponseSerializer(instance=sdc_form_response)
        json = {
            "message": "Success",
            "responseObject": serializer.data
        }
        return Response(json)
    elif request.method == "PUT":
        models_to_save = []

        try:
            sdc_form_response = SDCFormResponse.objects.get(id=response_id)
        except SDCFormResponse.DoesNotExist:
            content = {
                'message':
                    'This SDCFormResponseID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        if sdc_form_response.sdcform.diagnostic_procedure_id is None:
            content = {
                'message':
                    'The sdcForm associated with the sdcFormID in this response'
                    ' does not have a diagnosticProcedureID. This means that '
                    'the sdcForm is outdated and so this response is not '
                    'editable'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        sdc_form_response.save(update_fields=["timestamp"])
        client_answers = request.data["answers"]
        invalid_inputs = []

        for client_answer in client_answers:
            question_id = client_answer["questionID"]
            question = SDCQuestion.objects.get(id=question_id)
            question_type = question.type

            if question_type == "free-text":
                answer = FreeTextAnswer.objects.get(
                    sdcformresponse=sdc_form_response, sdcquestion=question)
                answer.answer = client_answer["answer"]

                try:
                    answer.full_clean()
                    models_to_save.append(answer)
                except ValidationError:
                    invalid_input = InvalidInput(
                        sdcquestion=question, message="Not a valid text answer")
                    invalid_inputs.append(invalid_input)
            elif question_type == "integer":
                answer = IntegerAnswer.objects.get(
                    sdcformresponse=sdc_form_response, sdcquestion=question)
                answer.answer = client_answer["answer"]

                try:
                    answer.full_clean()
                    models_to_save.append(answer)
                except ValidationError:
                    invalid_input = InvalidInput(
                        sdcquestion=question, message="Not a valid integer "
                                                      "answer")
                    invalid_inputs.append(invalid_input)
            elif question_type == "true-false":
                answer = TrueFalseAnswer.objects.get(
                    sdcformresponse=sdc_form_response, sdcquestion=question)
                answer.answer = client_answer["answer"]

                try:
                    answer.full_clean()
                    models_to_save.append(answer)
                except ValidationError:
                    invalid_input = InvalidInput(
                        sdcquestion=question, message="Not a valid true-false"
                                                      "answer")
                    invalid_inputs.append(invalid_input)
            elif question_type == "single-choice":
                answer = SingleChoiceAnswer.objects.get(
                    sdcformresponse=sdc_form_response, sdcquestion=question)

                try:
                    answer.singlechoice.delete()
                except ObjectDoesNotExist:
                    pass

                choice_answer = client_answer["answer"]
                if choice_answer is not None:
                    single_choice = SingleChoice(
                        answer=answer, selection=choice_answer["selection"])

                    if "addition" in choice_answer:
                        single_choice.addition = choice_answer["addition"]

                    try:
                        # should implement full_clean to check selection and
                        # addition fields are good, depending on
                        # optionalFieldInputType of the choice object
                        single_choice.full_clean()
                        models_to_save.append(single_choice)
                    except ValidationError:
                        invalid_input = InvalidInput(
                            sdcquestion=question,
                            message="Not a valid single-choice answer")
                        invalid_inputs.append(invalid_input)
            else:
                answer = MultipleChoiceAnswer.objects.get(
                    sdcformresponse=sdc_form_response, sdcquestion=question)
                answer.multiple_choices.all().delete()
                choice_answers = client_answer["answer"]

                for choice_answer in choice_answers:
                    multiple_choice = MultipleChoice(
                            answer=answer, selection=choice_answer["selection"])

                    if "addition" in choice_answer:
                        multiple_choice.addition = choice_answer["addition"]

                    try:
                        multiple_choice.full_clean()
                        models_to_save.append(multiple_choice)
                    except ValidationError:
                        invalid_input = InvalidInput(
                            sdcquestion=question,
                            message="Not a valid multiple-choice answer")
                        invalid_inputs.append(invalid_input)
                        break

        response_serializer = SDCFormResponseSerializer(
            instance=sdc_form_response)
        invalid_inputs_serializer = InvalidInputSerializer(invalid_inputs,
                                                           many=True)

        for model_ in models_to_save:
            model_.save()

        json = {
            "message": "Success",
            "responseObject": response_serializer.data,
            "invalidInputs": invalid_inputs_serializer.data
        }
        return Response(json)
    else:
        try:
            sdc_form_response = SDCFormResponse.objects.get(id=response_id)
        except SDCFormResponse.DoesNotExist:
            content = {
                'message':
                    'This SDCFormResponseID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        sdc_form_response.delete()
        return Response({"message": "Success"})
