from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import date

from .models import Contract
from .serializers import ContractSerializer

# GET /api/contracts/ => Todos los contratos del usuario
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_contracts(request):
    contracts = Contract.objects.filter(empleador=request.user)
    serializer = ContractSerializer(contracts, many=True)
    return Response(serializer.data)

# POST /api/contracts/createContract/ => Crear contrato
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_contract(request):
    serializer = ContractSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(empleado_id=request.data['empleado'], empleador=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({"error": "Datos inválidos", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# GET /api/contracts/<id>/ => Obtener detalle
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def retrieve_contract(request, id):
    contract = get_object_or_404(Contract, id=id, empleador=request.user)
    serializer = ContractSerializer(contract)
    return Response(serializer.data)

# PUT /api/contracts/<id>/ => Actualizar contrato
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_contract(request, id):
    contract = get_object_or_404(Contract, id=id, empleador=request.user)
    serializer = ContractSerializer(contract, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response({"error": "Datos inválidos", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# DELETE /api/contracts/<id>/ => Marcar como terminado
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def terminate_contract(request, id):
    contract = get_object_or_404(Contract, id=id, empleador=request.user)
    contract.delete()
    return Response({"detalle": "Contrato eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)
