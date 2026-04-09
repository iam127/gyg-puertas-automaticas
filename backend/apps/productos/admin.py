from django.contrib import admin
from .models import Producto, CategoriaProducto, ImagenProducto

@admin.register(CategoriaProducto)
class CategoriaProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'creado_en']
    search_fields = ['nombre']

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'uso', 'material', 'activo', 'destacado', 'creado_en']
    list_filter = ['uso', 'activo', 'destacado', 'categoria']
    search_fields = ['nombre', 'descripcion']
    list_editable = ['activo', 'destacado']

@admin.register(ImagenProducto)
class ImagenProductoAdmin(admin.ModelAdmin):
    list_display = ['producto', 'principal', 'creado_en']