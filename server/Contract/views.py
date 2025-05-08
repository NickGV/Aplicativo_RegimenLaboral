from rest_framework import generics
from .models import Contract
from .serializers import ContractSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from datetime import date

from .models import Contract
from .serializers import ContractSerializer

class ContractListCreateView(generics.ListCreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_contracts(request):
    contracts = Contract.objects.filter(user=request.user)
    serializer = ContractSerializer(contracts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_contract(request):
    # Create a new contract for the current user
    serializer = ContractSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({"error": "Datos inválidos", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def retrieve_contract(request, id):
    contract = get_object_or_404(Contract, id=id, user=request.user)
    serializer = ContractSerializer(contract)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_contract(request, id):
    contract = get_object_or_404(Contract, id=id, user=request.user)
    serializer = ContractSerializer(contract, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response({"error": "Datos inválidos", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def terminate_contract(request, id):
    contract = get_object_or_404(Contract, id=id, user=request.user)
    contract.terminated = True
    contract.termination_date = request.data.get('termination_date', date.today())
    contract.save()
    return Response({"detalle": "Contrato marcado como terminado."}, status=status.HTTP_200_OK)

