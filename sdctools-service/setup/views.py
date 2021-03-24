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

# SDC Form Response Mock Routes
@api_view(['POST'])
def new_sdcform_response(request):
    # Validate body fields
    if ("sdcFormID" not in request.data) or ("patientID" not in request.data) or ("clinicianID" not in request.data):
        return JsonResponse({}, status=400)
    
    f = open(os.path.dirname(os.path.realpath(__file__)) + '/sdcresponse_default.json', 'r')
    data = json.load(f)
    response = { 
        "message": "",
        "responseObject": data
    }

    f.close()
    return JsonResponse(response, status=201)

@api_view(['PUT'])
def update_sdcform_response(request, response_id):
    # Check that the requested resource exists
    if response_id != 2468:
        return JsonResponse({ 'message': 'Response does not exist'}, status=404)
    
    # Perform some validation on the answers
    validation_errors = []
    try: 
        
        answers = request.data["answers"]
        for answer in answers:
            # Mock example, validate that question 37326 has a no empty string answer
            if answer["questionID"] == 37326 and len(answer["answer"]) == 0:
                validation_errors.append({ "questionID": 37326, "message": "Cannot be empty."})
            # Otherwise, the question answer is saved


        response_content = {
            "message": None,
            "responseObject": request.data, # Should return the updated version from db, may not be same as response sent,
            "invalidInputs": validation_errors
        }
        
        return JsonResponse(response_content, status=200)

    except:
        return JsonResponse({ 'message': ''}, status=400)



