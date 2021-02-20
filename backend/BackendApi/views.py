from django.shortcuts import render

# Create your views here.


def home(request):
    return render(request, "BackendApi/home.html")


def open_api(request):
    return render(request, "BackendApi/open-api.html")
