from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

User = get_user_model()

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer




@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # this should create a new User with validated data
    # return 201 with user info or 400 on validation error
    return Response({"detail": "register stub"})

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    # this should authenticate credentials and return JWT access & refresh tokens
    # return 200 with tokens or 401 on failure
    return Response({"detail": "login stub"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    # this should return a list of all users
    return Response({"detail": "list_users stub"})

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, id):
    # GET: retrieve user by id
    # PUT: update user fields
    # DELETE: delete user account
    return Response({"detail": "user_detail stub"})
