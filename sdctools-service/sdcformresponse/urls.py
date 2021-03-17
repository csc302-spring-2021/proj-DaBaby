from django.urls import path
from . import views

urlpatterns = [
    path("", views.sdcformresponses, name="api-sdcformresponses"),
    path("<int:response_id>/", views.sdcformresponse, name="api-sdcformresponse")
]
