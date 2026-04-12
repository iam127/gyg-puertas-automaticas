from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Mantenimiento, VisitaMantenimiento
from .serializers import MantenimientoSerializer, MantenimientoListSerializer, VisitaMantenimientoSerializer

class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return MantenimientoListSerializer
        return MantenimientoSerializer

    @action(detail=False, methods=['get'])
    def seguimiento(self, request):
        codigo = request.query_params.get('codigo', None)
        token = request.query_params.get('token', None)
        if codigo:
            try:
                mantenimiento = Mantenimiento.objects.get(codigo=codigo)
                serializer = MantenimientoSerializer(mantenimiento)
                return Response(serializer.data)
            except Mantenimiento.DoesNotExist:
                return Response({'error': 'Mantenimiento no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        if token:
            try:
                mantenimiento = Mantenimiento.objects.get(token_unico=token)
                serializer = MantenimientoSerializer(mantenimiento)
                return Response(serializer.data)
            except Mantenimiento.DoesNotExist:
                return Response({'error': 'Mantenimiento no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Ingrese un codigo o token'}, status=status.HTTP_400_BAD_REQUEST)

class VisitaMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = VisitaMantenimiento.objects.all()
    serializer_class = VisitaMantenimientoSerializer