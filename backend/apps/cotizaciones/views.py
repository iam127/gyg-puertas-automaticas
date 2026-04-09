from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cotizacion, VisitaTecnica, CotizacionFormal
from .serializers import CotizacionSerializer, CotizacionListSerializer, VisitaTecnicaSerializer, CotizacionFormalSerializer

class CotizacionViewSet(viewsets.ModelViewSet):
    queryset = Cotizacion.objects.all()
    serializer_class = CotizacionSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return CotizacionListSerializer
        return CotizacionSerializer

    @action(detail=False, methods=['get'])
    def seguimiento(self, request):
        codigo = request.query_params.get('codigo', None)
        token = request.query_params.get('token', None)
        if codigo:
            try:
                cotizacion = Cotizacion.objects.get(codigo=codigo)
                serializer = CotizacionSerializer(cotizacion)
                return Response(serializer.data)
            except Cotizacion.DoesNotExist:
                return Response({'error': 'Cotizacion no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        if token:
            try:
                cotizacion = Cotizacion.objects.get(token_unico=token)
                serializer = CotizacionSerializer(cotizacion)
                return Response(serializer.data)
            except Cotizacion.DoesNotExist:
                return Response({'error': 'Cotizacion no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Ingrese un codigo o token'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def responder(self, request, pk=None):
        cotizacion = self.get_object()
        respuesta = request.data.get('respuesta')
        motivo = request.data.get('motivo', '')
        if respuesta == 'aceptado':
            cotizacion.estado = 'aceptado'
        elif respuesta == 'rechazado':
            cotizacion.estado = 'rechazado'
            cotizacion.motivo_rechazo = motivo
        elif respuesta == 'modificacion':
            cotizacion.estado = 'en_revision'
            cotizacion.motivo_rechazo = motivo
        cotizacion.save()
        return Response({'mensaje': 'Respuesta registrada correctamente'})

class VisitaTecnicaViewSet(viewsets.ModelViewSet):
    queryset = VisitaTecnica.objects.all()
    serializer_class = VisitaTecnicaSerializer

class CotizacionFormalViewSet(viewsets.ModelViewSet):
    queryset = CotizacionFormal.objects.all()
    serializer_class = CotizacionFormalSerializer