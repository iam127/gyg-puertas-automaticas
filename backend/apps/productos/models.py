from django.db import models

class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'


class Producto(models.Model):
    USO_CHOICES = [
        ('residencial', 'Residencial'),
        ('comercial', 'Comercial'),
        ('industrial', 'Industrial'),
    ]

    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.SET_NULL, null=True, related_name='productos')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    especificaciones = models.TextField(blank=True)
    uso = models.CharField(max_length=20, choices=USO_CHOICES)
    material = models.CharField(max_length=100, blank=True)
    activo = models.BooleanField(default=True)
    destacado = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'


class ImagenProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='productos/')
    principal = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Imagen de {self.producto.nombre}'

    class Meta:
        verbose_name = 'Imagen'
        verbose_name_plural = 'Imagenes'