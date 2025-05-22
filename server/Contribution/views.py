from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import Contribution
from Contract.models import Contract
from .serializers import ContributionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class ContributionListCreateView(generics.ListCreateAPIView):
    queryset = Contribution.objects.all()
    serializer_class = ContributionSerializer
    permission_classes = [IsAuthenticated]

def get_contribution(pk):
    try:
        return Contribution.objects.get(pk=pk)
    except Contribution.DoesNotExist:
        return None

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def contribution_list(request):
    """
    List all contributions or create a new one.
    """
    if request.method == 'GET':
       
        if request.user.rol == 'empleador':
            contributions = Contribution.objects.filter(contrato__empleador=request.user)
        else:
            contributions = Contribution.objects.all()
            
        serializer = ContributionSerializer(contributions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ContributionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contribution_get(request, pk):
    """
    Retrieve a contribution by id.
    """
    contribution = get_contribution(pk)
    if not contribution:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ContributionSerializer(contribution)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def contribution_update(request, pk):
    """
    Update a contribution by id.
    """
    contribution = get_contribution(pk)
    if not contribution:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    partial = (request.method == 'PATCH')
    serializer = ContributionSerializer(contribution, data=request.data, partial=partial)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def contribution_delete(request, pk):
    """
    Delete a contribution by id.
    """
    contribution = get_contribution(pk)
    if not contribution:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    contribution.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contribution_detail(request, id):
    contribution = get_object_or_404(Contribution, id=id)
    serializer = ContributionSerializer(contribution)
    return Response(serializer.data)
