from django.contrib import admin
from .models import Blog, FAQ, Galeria, Testimonio

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'publicado', 'creado_en']
    list_filter = ['publicado']
    list_editable = ['publicado']

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['pregunta', 'orden', 'activo']
    list_editable = ['orden', 'activo']

@admin.register(Galeria)
class GaleriaAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'tipo_puerta', 'activo', 'creado_en']
    list_editable = ['activo']

@admin.register(Testimonio)
class TestimonioAdmin(admin.ModelAdmin):
    list_display = ['nombre_cliente', 'calificacion', 'aprobado', 'creado_en']
    list_editable = ['aprobado']