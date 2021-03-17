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
def sdcformresponses(request):
    pass


@api_view(['GET', 'PUT', 'DELETE'])
def sdcformresponse(request, response_id):
    pass
