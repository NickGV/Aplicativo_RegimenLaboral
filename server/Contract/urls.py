from django.urls import path
from .views import (
    list_contracts,
    create_contract,
    retrieve_contract,
    update_contract,
    terminate_contract,
)

urlpatterns = [
    path('', list_contracts,),
    path('create/', create_contract,),
    path('<int:id>/', retrieve_contract, ),
    path('<int:id>/update/', update_contract,),
    path('<int:id>/terminate/', terminate_contract,),
]
