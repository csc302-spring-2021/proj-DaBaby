from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import *
from .serializers import *

# Create your views here.


# === FORM MANAGER ROUTES ===

@api_view(['GET', 'POST'])
def sdcforms(request):
    pass


@api_view(['GET', 'PUT', 'DELETE'])
def sdcform(request, sdc_id):
    pass


# === FORM FILLER ROUTES ===

@api_view(['GET'])
def sdcform_by_proc_id(request, procedure_id):
    pass
