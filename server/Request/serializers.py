from rest_framework import serializers
from .models import Solicitud

class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = ['id', 'usuario', 'tipo', 'descripcion', 'fecha_creacion']
        read_only_fields = ['usuario']  # ✅ Hacer usuario de solo lectura