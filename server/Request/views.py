from rest_framework import viewsets
from .models import Solicitud
from .serializers import SolicitudSerializer

class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)