from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer




@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
        }, status=201)
        
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    print(email, password)
    user = authenticate(request, username=email, password=password)
    if not user:
         raise AuthenticationFailed("Invalid credentials.")
    
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
    })

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
