from django.db import models
from django.contrib.auth.models import User

class Tecnico(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tecnico')
    telefono = models.CharField(max_length=20)
    activo = models.BooleanField(default=True)
    codigo_invitacion = models.CharField(max_length=20, unique=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.usuario.get_full_name()}'

    class Meta:
        verbose_name = 'Tecnico'
        verbose_name_plural = 'Tecnicos'