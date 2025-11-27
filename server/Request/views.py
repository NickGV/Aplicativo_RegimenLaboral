from rest_framework import viewsets
from .models import Solicitud
from .serializers import SolicitudSerializer
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

class SolicitudViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    
    def perform_create(self, serializer):
        User = settings.AUTH_USER_MODEL
        from django.contrib.auth import get_user_model
        User = get_user_model()
        serializer.save(usuario=self.request.user)