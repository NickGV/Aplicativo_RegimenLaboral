from django.urls import path
from .views import ContractListCreateView
from .views import contracts_list_create

urlpatterns = [
    path('', ContractListCreateView.as_view(), name='contract-list-create'),
    path('contracts/<int:id>/', contracts_list_create, name='contract-detail' ), 
]
