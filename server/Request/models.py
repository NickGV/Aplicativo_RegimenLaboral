from django.db import models
from User.models import User  # Ajusta si tu modelo de usuario tiene otro nombre
from django.conf import settings

class Solicitud(models.Model):
    TIPO_CHOICES = [
    ('Actualización de información personal', 'Actualización de información personal'),
    ('Agregar información', 'Agregar información'),
    ]
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    descripcion = models.TextField()
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='solicitudes'
    )
    fecha_creacion = models.DateField(auto_now_add=True)
    def __str__(self):
        return f"{self.tipo} - {self.usuario.username}"