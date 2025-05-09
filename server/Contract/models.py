from django.db import models
from User.models import User

class Contract(models.Model):
    TIPO_CHOICES = [
        ('fijo', 'Fijo'),
        ('indefinido', 'Indefinido'),
        ('obra', 'Por Obra o Labor'),
    ]

    empleado = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(blank=True, null=True)
    salario = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    Estado= models.CharField(max_length=20)
    def __str__(self):
        return f'{self.titulo} – {self.empleado.username}'
