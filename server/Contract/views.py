from rest_framework import generics
from .models import Contract
from .serializers import ContractSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ContractListCreateView(generics.ListCreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def contracts_list_create(request):
    if request.method == 'GET':
        contracts = Contract.objects.filter(user=request.user)
        serializer = ContractSerializer(contracts, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = ContractSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    return Response({"detail": "contracts_list_create stub"})

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def contract_detail(request, id):
    # GET: retrieve contract by id
    # PUT: update contract fields (title, type, dates, salary)
    # DELETE: mark contract as terminated or delete
    return Response({"detail": "contract_detail stub"})
