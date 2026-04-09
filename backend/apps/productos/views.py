from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Producto, CategoriaProducto, ImagenProducto
from .serializers import ProductoSerializer, ProductoListSerializer, CategoriaProductoSerializer, ImagenProductoSerializer

class CategoriaProductoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'descripcion', 'uso', 'material']
    ordering_fields = ['nombre', 'creado_en']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductoListSerializer
        return ProductoSerializer

    @action(detail=False, methods=['get'])
    def destacados(self, request):
        productos = Producto.objects.filter(activo=True, destacado=True)
        serializer = ProductoListSerializer(productos, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def por_uso(self, request):
        uso = request.query_params.get('uso', None)
        if uso:
            productos = Producto.objects.filter(activo=True, uso=uso)
        else:
            productos = Producto.objects.filter(activo=True)
        serializer = ProductoListSerializer(productos, many=True, context={'request': request})
        return Response(serializer.data)

class ImagenProductoViewSet(viewsets.ModelViewSet):
    queryset = ImagenProducto.objects.all()
    serializer_class = ImagenProductoSerializer