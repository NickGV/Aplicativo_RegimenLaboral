# usuarios/models.py
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    numero_telefono = models.CharField(max_length=20, blank=True)

    ROLE_CHOICES = (
        ('empleado', 'Empleado'),
        ('empleador', 'Empleador'),
        ('contador', 'Contador'),
        ('asesor_legal', 'Asesor Legal'),
        ('entidad_gubernamental', 'Entidad Gubernamental'),
    )
    rol = models.CharField(max_length=30, choices=ROLE_CHOICES, default='empleado')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.email} - {self.rol}"
