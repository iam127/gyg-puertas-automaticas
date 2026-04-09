from django.contrib import admin
from .models import Tecnico, CodigoInvitacion

@admin.register(Tecnico)
class TecnicoAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'telefono', 'activo', 'creado_en']
    list_filter = ['activo']
    list_editable = ['activo']

@admin.register(CodigoInvitacion)
class CodigoInvitacionAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'usado', 'creado_en']
    list_filter = ['usado']