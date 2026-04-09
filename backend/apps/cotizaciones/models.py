from django.db import models
import uuid

class Cotizacion(models.Model):
    ESTADO_CHOICES = [
        ('recibido', 'Recibido'),
        ('en_revision', 'En Revision'),
        ('visita_agendada', 'Visita Agendada'),
        ('cotizado', 'Cotizado'),
        ('aceptado', 'Aceptado'),
        ('rechazado', 'Rechazado'),
        ('instalacion_agendada', 'Instalacion Agendada'),
        ('en_instalacion', 'En Instalacion'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]

    USO_CHOICES = [
        ('residencial', 'Residencial'),
        ('comercial', 'Comercial'),
        ('industrial', 'Industrial'),
    ]

    codigo = models.CharField(max_length=20, unique=True, editable=False)
    nombre_cliente = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField()
    direccion = models.TextField()
    distrito = models.CharField(max_length=100)
    referencias = models.TextField(blank=True)
    tipo_uso = models.CharField(max_length=20, choices=USO_CHOICES)
    descripcion = models.TextField()
    disponibilidad = models.CharField(max_length=200)
    estado = models.CharField(max_length=30, choices=ESTADO_CHOICES, default='recibido')
    motivo_rechazo = models.TextField(blank=True)
    token_unico = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.codigo:
            ultimo = Cotizacion.objects.count() + 1
            self.codigo = f'GYG-{2026}-{str(ultimo).zfill(4)}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.codigo} - {self.nombre_cliente}'

    class Meta:
        verbose_name = 'Cotizacion'
        verbose_name_plural = 'Cotizaciones'
        ordering = ['-creado_en']


class ImagenCotizacion(models.Model):
    cotizacion = models.ForeignKey(Cotizacion, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='cotizaciones/')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Imagen de {self.cotizacion.codigo}'


class VisitaTecnica(models.Model):
    ESTADO_CHOICES = [
        ('programada', 'Programada'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
        ('reprogramada', 'Reprogramada'),
    ]

    cotizacion = models.ForeignKey(Cotizacion, on_delete=models.CASCADE, related_name='visitas')
    tecnico = models.ForeignKey('tecnicos.Tecnico', on_delete=models.SET_NULL, null=True, related_name='visitas_cotizacion')
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='programada')
    medidas = models.TextField(blank=True)
    observaciones = models.TextField(blank=True)
    dificultad = models.CharField(max_length=20, blank=True)
    tiempo_estimado = models.CharField(max_length=100, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Visita de {self.cotizacion.codigo}'

    class Meta:
        verbose_name = 'Visita Tecnica'
        verbose_name_plural = 'Visitas Tecnicas'


class ImagenVisita(models.Model):
    visita = models.ForeignKey(VisitaTecnica, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='visitas/')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Imagen de visita {self.visita.id}'


class CotizacionFormal(models.Model):
    cotizacion = models.OneToOneField(Cotizacion, on_delete=models.CASCADE, related_name='cotizacion_formal')
    descripcion_producto = models.TextField()
    lista_materiales = models.TextField()
    costo_materiales = models.DecimalField(max_digits=10, decimal_places=2)
    costo_mano_obra = models.DecimalField(max_digits=10, decimal_places=2)
    costo_instalacion = models.DecimalField(max_digits=10, decimal_places=2)
    costo_total = models.DecimalField(max_digits=10, decimal_places=2)
    tiempo_instalacion = models.CharField(max_length=100)
    condiciones_pago = models.TextField()
    meses_garantia = models.IntegerField(default=12)
    validez_dias = models.IntegerField(default=15)
    terminos = models.TextField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Cotizacion formal de {self.cotizacion.codigo}'

    class Meta:
        verbose_name = 'Cotizacion Formal'
        verbose_name_plural = 'Cotizaciones Formales'