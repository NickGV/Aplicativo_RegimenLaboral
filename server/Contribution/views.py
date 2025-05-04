from rest_framework import generics
from .models import Contribution
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def contributions_create(request):
    # calculate EPS, ARL, pension, cesantias for a given contract
    # save and return the new record
    return Response({"detail": "contributions_create stub"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contribution_detail(request, id):
    # retrieve contribution record by id
    return Response({"detail": "contribution_detail stub"})
