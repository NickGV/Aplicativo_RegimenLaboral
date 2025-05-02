from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    nombre_completo = models.CharField(max_length=255)
    numero_telefono = models.CharField(max_length=20)


    def __str__(self):
        return self.nombre_completo 