from django.core.exceptions import ObjectDoesNotExist

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import *

from .tools import ParseError, parse_xml


@api_view(['GET', 'POST'])
def sdcforms(request):
    if request.method == "GET":
        metadata = request.GET.get("metadata", "")
        history_id = request.GET.get("historyID", "")
        sdc_forms = SDCForm.objects.all()

        if history_id != "":
            try:
                history_id = int(history_id)
            except ValueError:
                return Response({
                    "message": "Not a valid sdcform id, needs to be an integer"},
                    status=status.HTTP_404_NOT_FOUND)

            try:
                sdc_form = SDCForm.objects.get(id=history_id)
                sdc_forms = sdc_forms.filter(id=sdc_form.id)
            except SDCForm.DoesNotExist:
                return Response({"message": "This sdcformID does not exist."},
                                status=status.HTTP_404_NOT_FOUND)

        if metadata == "true":
            serializer = SDCFormMetadataSerializer(sdc_forms, many=True)
        else:
            serializer = SDCFormSerializer(sdc_forms, many=True)

        data = serializer.data

        return Response({"message": "Success", "sdcFormObjects": data})
    else:  # FORM MANAGER
        s = {"diagnosticProcedureID", "name", "xmlString"}
        if not s.issubset(request.data):
            return Response({"message": str(s) + " must be in the request body"}
                            , status=status.HTTP_400_BAD_REQUEST)

        models_to_save = []

        diagnostic_procedure_id = DiagnosticProcedureID(
            code=request.data["diagnosticProcedureID"])
        # will save without error always b/c only one model field, i.e., the PK:
        models_to_save.append(diagnostic_procedure_id)

        try:
            _ = diagnostic_procedure_id.sdcform
            content = {
                'message': 'DiagnosticProcedureID already used.'
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            pass

        sdc_form = SDCForm(name=request.data["name"],
                           diagnostic_procedure_id=diagnostic_procedure_id)
        models_to_save.append(sdc_form)

        try:
            models_to_save.extend(parse_xml(request.data["xmlString"], sdc_form))
        except ParseError as parse_error:
            content = {
                'message': str(parse_error)
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        for model_ in models_to_save:
            model_.save()

        serializer = SDCFormSerializer(instance=sdc_form)
        json = {
            "message": "Success",
            "sdcFormObject": serializer.data
        }
        return Response(json, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def sdcform(request, procedure_id):
    if request.method == "GET":  # FORM FILLER
        try:
            diagnostic_procedure_id = DiagnosticProcedureID.objects.get(
                code=procedure_id)
        except DiagnosticProcedureID.DoesNotExist:
            content = {
                'message': 'This procedureID does not exist.'
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
                'message': 'There is no SDCForm associated with the provided procedureID.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
    elif request.method == "PUT":  # FORM MANAGER
        s = {"name", "xmlString"}
        if not s.issubset(request.data):
            return Response({"message": str(s) + " must be in the request body"}
                            , status=status.HTTP_400_BAD_REQUEST)

        models_to_save = []
        try:
            diagnostic_procedure_id = DiagnosticProcedureID.objects.get(
                code=procedure_id)
        except DiagnosticProcedureID.DoesNotExist:
            content = {
                'message': 'This procedureID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        try:
            old_sdc_form = diagnostic_procedure_id.sdcform
        except ObjectDoesNotExist:
            content = {
                'message': 'There is no SDCForm associated with the provided procedureID.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        old_sdc_form.diagnostic_procedure_id = None
        models_to_save.append(old_sdc_form)

        new_sdc_form = SDCForm(name=request.data["name"],
                               diagnostic_procedure_id=diagnostic_procedure_id)
        models_to_save.append(new_sdc_form)

        try:
            models_to_save.extend(parse_xml(request.data["xmlString"], new_sdc_form))
        except ParseError as parse_error:
            content = {
                'message': str(parse_error)
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        for model_ in models_to_save:
            model_.save()

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
                'message': 'This procedureID does not exist.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        try:
            sdc_form = diagnostic_procedure_id.sdcform
        except ObjectDoesNotExist:
            content = {
                'message': 'There is no SDCForm associated with the provided procedureID.'
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        sdc_form.diagnostic_procedure_id = None
        sdc_form.save()
        return Response({"message": "Success"})
