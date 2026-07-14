from django.db import models
import uuid

class Mantenimiento(models.Model):
    TIPO_CHOICES = [
        ('preventivo', 'Mantenimiento Preventivo'),
        ('correctivo', 'Mantenimiento Correctivo'),
        ('garantia', 'Garantia'),
    ]

    ESTADO_CHOICES = [
        ('recibido', 'Recibido'),
        ('en_revision', 'En Revision'),
        ('diagnostico_remoto', 'Diagnostico Remoto'),
        ('visita_agendada', 'Visita Agendada'),
        ('en_proceso', 'En Proceso'),
        ('esperando_repuestos', 'Esperando Repuestos'),
        ('resuelto', 'Resuelto'),
        ('cancelado', 'Cancelado'),
    ]

    codigo = models.CharField(max_length=20, unique=True, editable=False)
    nombre_cliente = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField()
    direccion = models.TextField()
    distrito = models.CharField(max_length=100)
    tipo_puerta = models.CharField(max_length=100)
    fecha_instalacion_aprox = models.DateField(null=True, blank=True)
    descripcion_problema = models.TextField()
    disponibilidad = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    estado = models.CharField(max_length=30, choices=ESTADO_CHOICES, default='recibido')
    garantia_vigente = models.BooleanField(default=False)
    token_unico = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    fecha_proximo_mantenimiento = models.DateField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.codigo:
            ultimo = Mantenimiento.objects.count() + 1
            self.codigo = f'MANT-{2026}-{str(ultimo).zfill(4)}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.codigo} - {self.nombre_cliente}'

    class Meta:
        verbose_name = 'Mantenimiento'
        verbose_name_plural = 'Mantenimientos'
        ordering = ['-creado_en']


class ImagenMantenimiento(models.Model):
    mantenimiento = models.ForeignKey(Mantenimiento, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='mantenimientos/')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Imagen de {self.mantenimiento.codigo}'


class VisitaMantenimiento(models.Model):
    foto_mantenimiento = models.ImageField(upload_to='fotos_mantenimiento/', null=True, blank=True)
    ESTADO_CHOICES = [
        ('programada', 'Programada'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
        ('reprogramada', 'Reprogramada'),
    ]

    mantenimiento = models.ForeignKey(Mantenimiento, on_delete=models.CASCADE, related_name='visitas')
    tecnico = models.ForeignKey('tecnicos.Tecnico', on_delete=models.SET_NULL, null=True, related_name='visitas_mantenimiento')
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='programada')
    diagnostico = models.TextField(blank=True)
    trabajos_realizados = models.TextField(blank=True)
    repuestos_utilizados = models.TextField(blank=True)
    costo_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Visita de {self.mantenimiento.codigo}'

    class Meta:
        verbose_name = 'Visita de Mantenimiento'
        verbose_name_plural = 'Visitas de Mantenimiento'


class ImagenVisitaMantenimiento(models.Model):
    visita = models.ForeignKey(VisitaMantenimiento, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='visitas_mantenimiento/')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Imagen de visita {self.visita.id}'


class Testimonio(models.Model):
    mantenimiento = models.ForeignKey(Mantenimiento, on_delete=models.SET_NULL, null=True, blank=True, related_name='testimonios')
    nombre_cliente = models.CharField(max_length=200)
    calificacion = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comentario = models.TextField()
    aprobado = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Testimonio de {self.nombre_cliente}'

    class Meta:
        verbose_name = 'Testimonio'
        verbose_name_plural = 'Testimonios'
        ordering = ['-creado_en']