# Generated by Django 5.2 on 2025-05-08 13:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0003_remove_user_nombre_completo'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='rol',
            field=models.CharField(choices=[('empleado', 'Empleado'), ('empleador', 'Empleador'), ('admin', 'Admin')], default='empleado', max_length=10),
        ),
    ]
