from django.contrib import admin
from .models import Mantenimiento, ImagenMantenimiento, VisitaMantenimiento, Testimonio

@admin.register(Mantenimiento)
class MantenimientoAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nombre_cliente', 'telefono', 'tipo', 'estado', 'garantia_vigente', 'creado_en']
    list_filter = ['tipo', 'estado', 'garantia_vigente']
    search_fields = ['codigo', 'nombre_cliente', 'telefono', 'correo']
    readonly_fields = ['codigo', 'token_unico']

@admin.register(VisitaMantenimiento)
class VisitaMantenimientoAdmin(admin.ModelAdmin):
    list_display = ['mantenimiento', 'tecnico', 'fecha', 'hora', 'estado']
    list_filter = ['estado']

@admin.register(Testimonio)
class TestimonioAdmin(admin.ModelAdmin):
    list_display = ['nombre_cliente', 'calificacion', 'aprobado', 'creado_en']
    list_filter = ['aprobado', 'calificacion']
    list_editable = ['aprobado']