from django.contrib import admin
from .models import Cotizacion, ImagenCotizacion, VisitaTecnica, ImagenVisita, CotizacionFormal

@admin.register(Cotizacion)
class CotizacionAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nombre_cliente', 'telefono', 'distrito', 'tipo_uso', 'estado', 'creado_en']
    list_filter = ['estado', 'tipo_uso', 'distrito']
    search_fields = ['codigo', 'nombre_cliente', 'telefono', 'correo']
    readonly_fields = ['codigo', 'token_unico']

@admin.register(VisitaTecnica)
class VisitaTecnicaAdmin(admin.ModelAdmin):
    list_display = ['cotizacion', 'tecnico', 'fecha', 'hora', 'estado']
    list_filter = ['estado']

@admin.register(CotizacionFormal)
class CotizacionFormalAdmin(admin.ModelAdmin):
    list_display = ['cotizacion', 'costo_total', 'meses_garantia', 'creado_en']