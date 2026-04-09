from rest_framework import serializers
from .models import Producto, CategoriaProducto, ImagenProducto

class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = '__all__'

class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    categoria = CategoriaProductoSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaProducto.objects.all(),
        source='categoria',
        write_only=True
    )

    class Meta:
        model = Producto
        fields = '__all__'

class ProductoListSerializer(serializers.ModelSerializer):
    imagen_principal = serializers.SerializerMethodField()
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'uso', 'material', 'destacado', 'imagen_principal', 'categoria_nombre']

    def get_imagen_principal(self, obj):
        imagen = obj.imagenes.filter(principal=True).first()
        if imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(imagen.imagen.url)
        return None