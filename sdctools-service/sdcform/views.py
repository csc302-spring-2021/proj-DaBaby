from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import xmltodict

from . import tools
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
                return Response({
                    "message": "Not a valid sdcform id, "
                               "needs to be an integer"},
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
            tools.parse_section(section_dict, sdc_form)

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
                    'There is no SDCForm associated with the provided '
                    'procedureID.'
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
                    'There is no SDCForm associated with the provided '
                    'procedureID.'
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
            tools.parse_section(section_dict, new_sdc_form)
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
                    'There is no SDCForm associated with the provided '
                    'procedureID.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        sdc_form.diagnostic_procedure_id = None
        sdc_form.save()
        return Response({"message": "Success"})
