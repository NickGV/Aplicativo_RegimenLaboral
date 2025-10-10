from django.db import models
from User.models import User  # Ajusta si tu modelo de usuario tiene otro nombre

class Solicitud(models.Model):
    TIPO_CHOICES = [
    ('Actualización de información personal', 'Actualización de información personal'),
    ('Agregar información', 'Agregar información'),
    ]
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    descripcion = models.TextField()
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} - {self.usuario.username}"