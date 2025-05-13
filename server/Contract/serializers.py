from rest_framework import serializers
from .models import Contract
from User.models import User

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class ContractSerializer(serializers.ModelSerializer):
    empleado = EmpleadoSerializer(read_only=True)
    class Meta:
        model = Contract
        fields = '__all__'