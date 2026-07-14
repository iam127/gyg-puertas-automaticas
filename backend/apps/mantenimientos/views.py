from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Mantenimiento, VisitaMantenimiento
from .serializers import MantenimientoSerializer, MantenimientoListSerializer, VisitaMantenimientoSerializer

class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return MantenimientoListSerializer
        return MantenimientoSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        try:
            from apps.notificaciones.whatsapp import notificar_nuevo_mantenimiento
            from apps.notificaciones.email import notificar_mantenimiento_email
            mantenimiento = Mantenimiento.objects.get(id=response.data['id'])
            notificar_nuevo_mantenimiento(mantenimiento)
            notificar_mantenimiento_email(mantenimiento)
        except Exception as e:
            import traceback
            print(f"Error enviando notificacion: {e}")
            traceback.print_exc()
        return response

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

    @action(detail=False, methods=['get'], authentication_classes=[JWTAuthentication], permission_classes=[IsAuthenticated])
    def mis_mantenimientos(self, request):
        try:
            from apps.tecnicos.models import Tecnico
            tecnico = Tecnico.objects.get(usuario=request.user)
            visitas = tecnico.visitas_mantenimiento.select_related('mantenimiento').all()
            mantenimiento_ids = visitas.values_list('mantenimiento_id', flat=True).distinct()
            mantenimientos = Mantenimiento.objects.filter(id__in=mantenimiento_ids)
            serializer = MantenimientoSerializer(mantenimientos, many=True)
            return Response(serializer.data)
        except Tecnico.DoesNotExist:
            return Response({'error': 'Técnico no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def asignar_tecnico(self, request, pk=None):
        mantenimiento = self.get_object()
        tecnico_id = request.data.get('tecnico_id')
        fecha = request.data.get('fecha')
        hora = request.data.get('hora')

        if not all([tecnico_id, fecha, hora]):
            return Response({'error': 'tecnico_id, fecha y hora son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from apps.tecnicos.models import Tecnico
            tecnico = Tecnico.objects.get(id=tecnico_id)

            visita_existente = VisitaMantenimiento.objects.filter(mantenimiento=mantenimiento).first()
            if visita_existente:
                visita_existente.tecnico = tecnico
                visita_existente.fecha = fecha
                visita_existente.hora = hora
                visita_existente.save()
                visita = visita_existente
            else:
                visita = VisitaMantenimiento.objects.create(
                    mantenimiento=mantenimiento,
                    tecnico=tecnico,
                    fecha=fecha,
                    hora=hora,
                )

            mantenimiento.estado = 'visita_agendada'
            mantenimiento.save()
            serializer = VisitaMantenimientoSerializer(visita)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Tecnico.DoesNotExist:
            return Response({'error': 'Técnico no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VisitaMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = VisitaMantenimiento.objects.all()
    serializer_class = VisitaMantenimientoSerializer
    permission_classes = [AllowAny]