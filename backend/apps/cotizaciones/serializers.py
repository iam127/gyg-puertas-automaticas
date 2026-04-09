from rest_framework import serializers
from .models import Cotizacion, ImagenCotizacion, VisitaTecnica, ImagenVisita, CotizacionFormal

class ImagenCotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenCotizacion
        fields = '__all__'

class CotizacionFormalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CotizacionFormal
        fields = '__all__'

class VisitaTecnicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitaTecnica
        fields = '__all__'

class CotizacionSerializer(serializers.ModelSerializer):
    imagenes = ImagenCotizacionSerializer(many=True, read_only=True)
    visitas = VisitaTecnicaSerializer(many=True, read_only=True)
    cotizacion_formal = CotizacionFormalSerializer(read_only=True)

    class Meta:
        model = Cotizacion
        fields = '__all__'
        read_only_fields = ['codigo', 'token_unico']

class CotizacionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cotizacion
        fields = ['id', 'codigo', 'nombre_cliente', 'telefono', 'correo', 'distrito', 'tipo_uso', 'estado', 'creado_en']