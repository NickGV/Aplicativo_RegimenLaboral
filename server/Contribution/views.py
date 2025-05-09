from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Contract, Contribution
from .serializers import ContributionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ContributionListCreateView(generics.ListCreateAPIView):
    queryset = Contribution.objects.all()
    serializer_class = ContributionSerializer




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contributions_list(request):
    contributions = Contribution.objects.filter(user=request.user)
    serializer = ContributionSerializer(contributions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calculate_eps(request, contract_id):
    """
    GET /contributions/eps/contract/<contract_id>/
    Calcula únicamente el aporte de EPS (4% del salario).
    """
    contract = get_object_or_404(Contract, id=contract_id, user=request.user)
    eps = contract.salary * 0.04
    return Response({'contract': contract.id, 'eps': eps})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calculate_arl(request, contract_id):
    """
    GET /contributions/arl/contract/<contract_id>/
    Calcula únicamente el aporte de ARL (ejemplo 0.522% del salario).
    """
    contract = get_object_or_404(Contract, id=contract_id, user=request.user)
    arl = contract.salary * 0.00522
    return Response({'contract': contract.id, 'arl': arl})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calculate_pension(request, contract_id):
    """
    GET /contributions/pension/contract/<contract_id>/
    Calcula únicamente el aporte de pensión (4% del salario).
    """
    contract = get_object_or_404(Contract, id=contract_id, user=request.user)
    pension = contract.salary * 0.04
    return Response({'contract': contract.id, 'pension': pension})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calculate_cesantias(request, contract_id):
    """
    GET /contributions/cesantias/contract/<contract_id>/
    Calcula únicamente las cesantías (8.33% del salario).
    """
    contract = get_object_or_404(Contract, id=contract_id, user=request.user)
    cesantias = contract.salary * 0.0833
    return Response({'contract': contract.id, 'cesantias': cesantias})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contribution_detail(request, id):
    # retrieve contribution record by id
    return Response({"detail": "contribution_detail stub"})
