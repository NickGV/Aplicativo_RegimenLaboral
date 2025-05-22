from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import date

from .models import Contract
from .serializers import ContractSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_contracts(request):
    # Check user role
    if request.user.rol == 'empleado':
        # Employees see only their own contracts
        contracts = Contract.objects.filter(empleado=request.user)
    elif request.user.rol == 'empleador':
        # Employers see contracts where they are the employer
        contracts = Contract.objects.filter(empleador=request.user)
    elif request.user.rol in ['contador', 'asesor_legal', 'entidad_gubernamental']:
        # These roles need different access patterns
        if request.user.rol == 'contador':
            # Accountants see all contracts to calculate contributions
            contracts = Contract.objects.all()
        elif request.user.rol == 'asesor_legal':
            # Legal advisors see all contracts for legal compliance
            contracts = Contract.objects.all()
        elif request.user.rol == 'entidad_gubernamental':
            # Government entities see all contracts for oversight
            contracts = Contract.objects.all()
    else:
        # Default case (shouldn't happen with your role system)
        contracts = Contract.objects.none()
        
    serializer = ContractSerializer(contracts, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_contract(request):
    serializer = ContractSerializer(data=request.data)
    if serializer.is_valid():
        empleado_id = request.data['empleado']
        serializer.save(empleado_id=empleado_id, empleador=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({"error": "Datos inválidos", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def retrieve_contract(request, id):
    contract = get_object_or_404(Contract, id=id, empleador=request.user)
    serializer = ContractSerializer(contract)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_contract(request, id):
    contract = get_object_or_404(Contract, id=id, empleador=request.user)
    data = request.data.copy()
    if 'empleado' in data:
        data['empleado'] = data['empleado'] if isinstance(data['empleado'], int) else int(data['empleado'])
    serializer = ContractSerializer(contract, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response({"error": "Datos inválidos", "detalles": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def terminate_contract(request, id):
    contract = get_object_or_404(Contract, id=id, empleador=request.user)
    contract.delete()
    return Response({"detalle": "Contrato eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)
