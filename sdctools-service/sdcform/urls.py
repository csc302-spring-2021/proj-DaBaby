from django.urls import path
from . import views

urlpatterns = [
    path("", views.sdcforms, name="api-sdcforms"),
    path("<str:procedure_id>/", views.sdcform, name="api-sdcform")
]
