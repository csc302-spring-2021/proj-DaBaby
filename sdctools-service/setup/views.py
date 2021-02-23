from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import os

# Create your views here.

# Initial test route
def index(*args, **kwargs):
    return HttpResponse("Hello World")

# SDCForm mock routes
@api_view(['POST'])
def upload_sdcform(request):
    if "diagnosticProcedureID" not in request.data: 
        return JsonResponse({"message": "Error: no procedure ID specified"}, status=400)

    diagnostic_procedure_id = request.data["diagnosticProcedureID"]
    
    f = open(os.path.dirname(os.path.realpath(__file__)) + '/sdcform.json', 'r')
    data = json.load(f)
    response = { 
        "message": "Received",
        "procedureEntered": diagnostic_procedure_id,
        "sdcFormObject": data
    }

    f.close()
    return JsonResponse(response, status=201)


@api_view(['GET'])
def sdcform_mock(request):
    f = open(os.path.dirname(os.path.realpath(__file__)) + '/sdcform.json', 'r')
    data = json.load(f)
    response = { 
        "message": "",
        "sdcFormObject": data
    }

    f.close()
    return JsonResponse(response, status=200)

