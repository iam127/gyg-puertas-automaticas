from rest_framework import serializers
from .models import Mantenimiento, ImagenMantenimiento, VisitaMantenimiento, ImagenVisitaMantenimiento, Testimonio

class ImagenMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenMantenimiento
        fields = '__all__'

class VisitaMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitaMantenimiento
        fields = '__all__'

class MantenimientoSerializer(serializers.ModelSerializer):
    imagenes = ImagenMantenimientoSerializer(many=True, read_only=True)
    visitas = VisitaMantenimientoSerializer(many=True, read_only=True)

    class Meta:
        model = Mantenimiento
        fields = '__all__'
        read_only_fields = ['codigo', 'token_unico', 'garantia_vigente']

class MantenimientoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mantenimiento
        fields = ['id', 'codigo', 'nombre_cliente', 'telefono', 'distrito', 'tipo', 'estado', 'garantia_vigente', 'creado_en']

class TestimonioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonio
        fields = '__all__'