from rest_framework import serializers
from .models import Contribution

class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contribution
        fields = ['id', 'contrato', 'eps', 'arl', 'pension', 'cesantias', 'total', 'fecha_calculo']
        read_only_fields = ['id', 'fecha_calculo']
