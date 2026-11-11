from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Cotizacion, VisitaTecnica, CotizacionFormal, MensajeContacto
from .serializers import CotizacionSerializer, CotizacionListSerializer, VisitaTecnicaSerializer, CotizacionFormalSerializer, MensajeContactoSerializer
from . import services


class CotizacionViewSet(viewsets.ModelViewSet):
    queryset = Cotizacion.objects.all()
    serializer_class = CotizacionSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'seguimiento']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'list':
            return CotizacionListSerializer
        return CotizacionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cotizacion = services.crear_cotizacion(serializer.validated_data)
        return Response(CotizacionSerializer(cotizacion).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def seguimiento(self, request):
        codigo = request.query_params.get('codigo', None)
        token = request.query_params.get('token', None)
        if codigo:
            try:
                cotizacion = Cotizacion.objects.get(codigo=codigo)
                return Response(CotizacionSerializer(cotizacion).data)
            except Cotizacion.DoesNotExist:
                return Response({'error': 'Cotizacion no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        if token:
            try:
                cotizacion = Cotizacion.objects.get(token_unico=token)
                return Response(CotizacionSerializer(cotizacion).data)
            except Cotizacion.DoesNotExist:
                return Response({'error': 'Cotizacion no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Ingrese un codigo o token'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def responder(self, request, pk=None):
        cotizacion = self.get_object()
        services.responder_cotizacion(
            cotizacion,
            request.data.get('respuesta'),
            request.data.get('motivo', '')
        )
        return Response({'mensaje': 'Respuesta registrada correctamente'})

    @action(detail=True, methods=['post'])
    def proponer_fecha(self, request, pk=None):
        cotizacion = self.get_object()
        if cotizacion.estado != 'aceptado':
            return Response({'error': 'Solo se puede proponer fecha cuando la cotización está aceptada'}, status=status.HTTP_400_BAD_REQUEST)
        fecha = request.data.get('fecha')
        hora = request.data.get('hora')
        if not fecha or not hora:
            return Response({'error': 'Fecha y hora son requeridas'}, status=status.HTTP_400_BAD_REQUEST)
        services.proponer_fecha_cotizacion(cotizacion, fecha, hora)
        return Response({'mensaje': 'Fecha propuesta registrada correctamente'})

    @action(detail=True, methods=['post'])
    def asignar_tecnico(self, request, pk=None):
        cotizacion = self.get_object()
        tecnico_id = request.data.get('tecnico_id')
        fecha = request.data.get('fecha')
        hora = request.data.get('hora')
        if not all([tecnico_id, fecha, hora]):
            return Response({'error': 'tecnico_id, fecha y hora son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from apps.tecnicos.models import Tecnico
            tecnico = Tecnico.objects.get(id=tecnico_id)
            visita = services.asignar_tecnico_cotizacion(cotizacion, tecnico, fecha, hora)
            return Response(VisitaTecnicaSerializer(visita).data, status=status.HTTP_200_OK)
        except Tecnico.DoesNotExist:
            return Response({'error': 'Técnico no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], authentication_classes=[JWTAuthentication], permission_classes=[IsAuthenticated])
    def mis_cotizaciones(self, request):
        try:
            from apps.tecnicos.models import Tecnico
            tecnico = Tecnico.objects.get(usuario=request.user)
            visitas = tecnico.visitas_cotizacion.select_related('cotizacion').all()
            cotizacion_ids = visitas.values_list('cotizacion_id', flat=True).distinct()
            cotizaciones = Cotizacion.objects.filter(id__in=cotizacion_ids)
            return Response(CotizacionSerializer(cotizaciones, many=True).data)
        except Tecnico.DoesNotExist:
            return Response({'error': 'Técnico no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VisitaTecnicaViewSet(viewsets.ModelViewSet):
    queryset = VisitaTecnica.objects.all()
    serializer_class = VisitaTecnicaSerializer
    permission_classes = [IsAuthenticated]


class CotizacionFormalViewSet(viewsets.ModelViewSet):
    queryset = CotizacionFormal.objects.all()
    serializer_class = CotizacionFormalSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if 'pdf_cotizacion' in request.FILES:
            cotizacion_formal = self.get_object()
            services.enviar_cotizacion_formal(cotizacion_formal)
        return response


class MensajeContactoViewSet(viewsets.ModelViewSet):
    queryset = MensajeContacto.objects.all()
    serializer_class = MensajeContactoSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        mensaje = MensajeContacto.objects.get(id=response.data['id'])
        services.enviar_notificacion_contacto(mensaje)
        return response