from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import xmltodict

from .models import *
from .serializers import *

# Create your views here.


@api_view(['GET', 'POST'])
def sdcforms(request):
    if request.method == "GET":
        metadata = request.GET.get("metadata", "")
        history_id = request.GET.get("historyID", "")

        if history_id != "":
            try:
                history_id = int(history_id)
            except ValueError:
                return Response({"message": "Not a valid sdcform id, needs to be an integer"},
                                status=status.HTTP_404_NOT_FOUND)

            try:
                sdc_form = SDCForm.objects.get(id=history_id)
            except SDCForm.DoesNotExist:
                return Response({"message": "This sdcformID does not exist."},
                                status=status.HTTP_404_NOT_FOUND)

            serializer = SDCFormSerializer(instance=sdc_form)
            d = [serializer.data]
        else:
            lst = SDCForm.objects.all()
            serializer = SDCFormSerializer(lst, many=True)
            d = serializer.data

        if metadata == "true":
            for sdc_form in d:
                del sdc_form["sections"]

        return Response({"message": "Success", "sdcFormObjects": d})
    else:  # FORM MANAGER
        diagnostic_procedure_id = DiagnosticProcedureID(
            code=request.data["diagnosticProcedureID"])
        # will save without error always b/c only one model field, i.e., the PK:
        diagnostic_procedure_id.save()

        try:
            diagnostic_procedure_id.sdcform
            content = {
                'message':
                    'DiagnosticProcedureID already used.'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            pass

        sdc_form = SDCForm(name=request.data["name"],
                           diagnostic_procedure_id=diagnostic_procedure_id)
        sdc_form.save()

        xml_dict = xmltodict.parse(request.data["xmlString"][3:])

        section_dicts = xml_dict["FormDesign"]["Body"]["ChildItems"]["Section"]
        if not isinstance(section_dicts, list):
            section_dicts = [section_dicts]
        for section_dict in section_dicts:
            if "@title" in section_dict:
                name = section_dict["@title"]
            else:
                name = ""

            section = Section(name=name, sdcform=sdc_form)
            section.save()

            question_dicts = section_dict["ChildItems"]["Question"]
            if not isinstance(question_dicts, list):
                question_dicts = [question_dicts]
            for question_dict in question_dicts:
                if "ResponseField" in question_dict:
                    assert "Response" in question_dict["ResponseField"]
                    type_key_lst = \
                        question_dict["ResponseField"]["Response"].keys()
                    type_key_lst = list(type_key_lst)
                    while type_key_lst[0][0] == "@":
                        del type_key_lst[0]
                    assert len(type_key_lst) == 1
                    if ["string"] == type_key_lst:
                        q_type = "free-text"
                    elif ["decimal"] == type_key_lst:
                        # might change this later
                        q_type = "integer"
                    else:
                        assert ["integer"] == type_key_lst
                        # need a way to store max and min inclusive
                        q_type = "integer"
                else:
                    assert "ListField" in question_dict
                    q_type = "single-choice"
                    # to-do for "multiple-choice"

                if "@title" in question_dict:
                    text = question_dict["@title"]
                else:
                    text = ""
                controller = None
                controller_answer_enabler = None
                sdc_question = SDCQuestion(type=q_type, text=text,
                                           controller=controller,
                                           controller_answer_enabler=
                                           controller_answer_enabler,
                                           section=section)
                sdc_question.save()

                if q_type in {"single-choice", "multiple-choice"}:
                    choice_dicts = \
                        question_dict["ListField"]["List"]["ListItem"]
                    if not isinstance(choice_dicts, list):
                        choice_dicts = [choice_dicts]
                    for choice_dict in choice_dicts:
                        if "ListItemResponseField" in choice_dict:
                            assert "Response" in \
                                   choice_dict["ListItemResponseField"]
                            type_key_lst = choice_dict[
                                "ListItemResponseField"]["Response"].keys()
                            type_key_lst = list(type_key_lst)
                            while type_key_lst[0][0] == "@":
                                del type_key_lst[0]
                            assert len(type_key_lst) == 1
                            if ["string"] == type_key_lst:
                                input_type = "str"
                            elif ["decimal"] == type_key_lst:
                                # might change this later
                                input_type = "int"
                            else:
                                assert ["integer"] == type_key_lst
                                # need a way to store max and min inclusive
                                input_type = "int"
                        else:
                            input_type = None

                        if "@title" in choice_dict:
                            text = choice_dict["@title"]
                        else:
                            text = ""
                        choice = Choice(text=text, input_type=input_type,
                                        sdcquestion=sdc_question)
                        choice.save()
        serializer = SDCFormSerializer(instance=sdc_form)
        json = {
            "message": "Success",
            "sdcFormObject": serializer.data
        }
        return Response(json)


@api_view(['GET', 'PUT', 'DELETE'])
def sdcform(request, procedure_id):
    if request.method == "GET":  # FORM FILLER
        try:
            diagnostic_procedure_id = DiagnosticProcedureID.objects.get(
                code=procedure_id)
        except DiagnosticProcedureID.DoesNotExist:
            content = {
                'message':
                    'This procedureID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        try:
            sdc_form = diagnostic_procedure_id.sdcform
            serializer = SDCFormSerializer(instance=sdc_form)
            json = {
                "message": "Success",
                "sdcFormObject": serializer.data
            }
            return Response(json)
        except ObjectDoesNotExist:
            content = {
                'message':
                    'There is no SDCForm associated with the provided procedureID.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
    elif request.method == "PUT":  # FORM MANAGER
        try:
            diagnostic_procedure_id = DiagnosticProcedureID.objects.get(
                code=procedure_id)
        except DiagnosticProcedureID.DoesNotExist:
            content = {
                'message':
                    'This procedureID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        try:
            old_sdc_form = diagnostic_procedure_id.sdcform
        except ObjectDoesNotExist:
            content = {
                'message':
                    'There is no SDCForm associated with the provided procedureID.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        old_sdc_form.diagnostic_procedure_id = None
        old_sdc_form.save()

        new_sdc_form = SDCForm(name=request.data["name"],
                               diagnostic_procedure_id=diagnostic_procedure_id)
        new_sdc_form.save()

        xml_dict = xmltodict.parse(request.data["xmlString"][3:])

        section_dicts = xml_dict["FormDesign"]["Body"]["ChildItems"]["Section"]
        if not isinstance(section_dicts, list):
            section_dicts = [section_dicts]
        for section_dict in section_dicts:
            if "@title" in section_dict:
                name = section_dict["@title"]
            else:
                name = ""

            section = Section(name=name, sdcform=new_sdc_form)
            section.save()

            question_dicts = section_dict["ChildItems"]["Question"]
            if not isinstance(question_dicts, list):
                question_dicts = [question_dicts]
            for question_dict in question_dicts:
                if "ResponseField" in question_dict:
                    assert "Response" in question_dict["ResponseField"]
                    type_key_lst = \
                        question_dict["ResponseField"]["Response"].keys()
                    type_key_lst = list(type_key_lst)
                    while type_key_lst[0][0] == "@":
                        del type_key_lst[0]
                    assert len(type_key_lst) == 1
                    if ["string"] == type_key_lst:
                        q_type = "free-text"
                    elif ["decimal"] == type_key_lst:
                        # might change this later
                        q_type = "integer"
                    else:
                        assert ["integer"] == type_key_lst
                        # need a way to store max and min inclusive
                        q_type = "integer"
                else:
                    assert "ListField" in question_dict
                    q_type = "single-choice"
                    # to-do for "multiple-choice"

                if "@title" in question_dict:
                    text = question_dict["@title"]
                else:
                    text = ""
                controller = None
                controller_answer_enabler = None
                sdc_question = SDCQuestion(type=q_type, text=text,
                                           controller=controller,
                                           controller_answer_enabler=
                                           controller_answer_enabler,
                                           section=section)
                sdc_question.save()

                if q_type in {"single-choice", "multiple-choice"}:
                    choice_dicts = \
                        question_dict["ListField"]["List"]["ListItem"]
                    if not isinstance(choice_dicts, list):
                        choice_dicts = [choice_dicts]
                    for choice_dict in choice_dicts:
                        if "ListItemResponseField" in choice_dict:
                            assert "Response" in \
                                   choice_dict["ListItemResponseField"]
                            type_key_lst = choice_dict[
                                "ListItemResponseField"]["Response"].keys()
                            type_key_lst = list(type_key_lst)
                            while type_key_lst[0][0] == "@":
                                del type_key_lst[0]
                            assert len(type_key_lst) == 1
                            if ["string"] == type_key_lst:
                                input_type = "str"
                            elif ["decimal"] == type_key_lst:
                                # might change this later
                                input_type = "int"
                            else:
                                assert ["integer"] == type_key_lst
                                # need a way to store max and min inclusive
                                input_type = "int"
                        else:
                            input_type = None

                        if "@title" in choice_dict:
                            text = choice_dict["@title"]
                        else:
                            text = ""
                        choice = Choice(text=text, input_type=input_type,
                                        sdcquestion=sdc_question)
                        choice.save()
        serializer = SDCFormSerializer(instance=new_sdc_form)
        json = {
            "message": "Success",
            "sdcFormObject": serializer.data
        }
        return Response(json)
    else:  # FORM MANAGER
        try:
            diagnostic_procedure_id = DiagnosticProcedureID.objects.get(
                code=procedure_id)
        except DiagnosticProcedureID.DoesNotExist:
            content = {
                'message':
                    'This procedureID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        try:
            sdc_form = diagnostic_procedure_id.sdcform
        except ObjectDoesNotExist:
            content = {
                'message':
                    'There is no SDCForm associated with the provided procedureID.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        sdc_form.diagnostic_procedure_id = None
        sdc_form.save()
        return Response({"message": "Success"})
