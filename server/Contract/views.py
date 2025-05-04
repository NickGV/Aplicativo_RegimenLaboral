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
    # GET: list all contracts for the authenticated user
    # POST: create a new contract linked to request.user
    return Response({"detail": "contracts_list_create stub"})

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def contract_detail(request, id):
    # GET: retrieve contract by id
    # PUT: update contract fields (title, type, dates, salary)
    # DELETE: mark contract as terminated or delete
    return Response({"detail": "contract_detail stub"})
