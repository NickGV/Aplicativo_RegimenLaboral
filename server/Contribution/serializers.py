from rest_framework import serializers
from .models import Contribution
from Contract.serializers import ContractSerializer
from Contract.models import Contract

class ContributionSerializer(serializers.ModelSerializer):
    contrato_detalle = ContractSerializer(source='contrato', read_only=True)
    
    class Meta:
        model = Contribution
        fields = ['id', 'contrato', 'contrato_detalle', 'salario_base', 'eps', 'arl', 'pension', 'cesantias', 'total', 'fecha_calculo']
        read_only_fields = ['id', 'fecha_calculo']
