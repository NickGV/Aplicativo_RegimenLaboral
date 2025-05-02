from django.db import models
from Contract.models import Contract

class Contribution(models.Model):
    contrato = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='Contributions'
    )
    eps = models.DecimalField(max_digits=10, decimal_places=2)
    arl = models.DecimalField(max_digits=10, decimal_places=2)
    pension = models.DecimalField(max_digits=10, decimal_places=2)
    cesantias = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    fecha_calculo = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f'Aportes de {self.contrato.empleado.username} '
            f'– EPS: {self.eps}, Pension: {self.pension}'
        )
