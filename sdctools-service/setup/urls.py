from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("sdcform/", views.upload_sdcform, name="api-test-sdcforms"),
    path("sdcform/covid19/", views.sdcform_mock, name="api-test-sdcform-mock")
]
