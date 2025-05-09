from django.urls import path
from .views import ContributionListCreateView
from .views import (
    calculate_eps,
    calculate_arl,
    calculate_pension,
    calculate_cesantias,
)

urlpatterns = [
    path('', ContributionListCreateView.as_view(), name='contribution-list-create'),
    path(
        'eps/contract/<int:contract_id>/',
        calculate_eps,
        name='contributions-calc-eps'
    ),
    path(
        'arl/contract/<int:contract_id>/',
        calculate_arl,
        name='contributions-calc-arl'
    ),
    path(
        'pension/contract/<int:contract_id>/',
        calculate_pension,
        name='contributions-calc-pension'
    ),
    path(
        'cesantias/contract/<int:contract_id>/',
        calculate_cesantias,
        name='contributions-calc-cesantias'
    ),
]