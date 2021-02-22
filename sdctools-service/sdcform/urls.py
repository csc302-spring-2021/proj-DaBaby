from django.urls import path
from . import views

urlpatterns = [
    path("", views.sdcforms, name="api-sdcforms"),
    path("<int:sdc_id>/", views.sdcform, name="api-sdcform"),
    path("<int:procedure_id>/", views.sdcform_by_proc_id, name="api-sdcform-by-proc-id")
]
