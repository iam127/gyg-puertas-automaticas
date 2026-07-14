from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Cotizacion, VisitaTecnica, CotizacionFormal, MensajeContacto
from .serializers import CotizacionSerializer, CotizacionListSerializer, VisitaTecnicaSerializer, CotizacionFormalSerializer, MensajeContactoSerializer

class CotizacionViewSet(viewsets.ModelViewSet):
    queryset = Cotizacion.objects.all()
    serializer_class = CotizacionSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return CotizacionListSerializer
        return CotizacionSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        try:
            from apps.notificaciones.whatsapp import notificar_nueva_cotizacion
            from apps.notificaciones.email import notificar_cotizacion_email
            cotizacion = Cotizacion.objects.get(id=response.data['id'])
            notificar_nueva_cotizacion(cotizacion)
            notificar_cotizacion_email(cotizacion)
        except Exception as e:
            print(f"Error enviando notificacion: {e}")
        return response

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

            visita_existente = VisitaTecnica.objects.filter(cotizacion=cotizacion).first()
            if visita_existente:
                visita_existente.tecnico = tecnico
                visita_existente.fecha = fecha
                visita_existente.hora = hora
                visita_existente.save()
                visita = visita_existente
            else:
                visita = VisitaTecnica.objects.create(
                    cotizacion=cotizacion,
                    tecnico=tecnico,
                    fecha=fecha,
                    hora=hora,
                )

            cotizacion.estado = 'visita_agendada'
            cotizacion.save()
            serializer = VisitaTecnicaSerializer(visita)
            return Response(serializer.data, status=status.HTTP_200_OK)
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
            serializer = CotizacionSerializer(cotizaciones, many=True)
            return Response(serializer.data)
        except Tecnico.DoesNotExist:
            return Response({'error': 'Técnico no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VisitaTecnicaViewSet(viewsets.ModelViewSet):
    queryset = VisitaTecnica.objects.all()
    serializer_class = VisitaTecnicaSerializer
    permission_classes = [AllowAny]


class CotizacionFormalViewSet(viewsets.ModelViewSet):
    queryset = CotizacionFormal.objects.all()
    serializer_class = CotizacionFormalSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        try:
            if 'pdf_cotizacion' in request.FILES:
                cotizacion_formal = self.get_object()
                from apps.notificaciones.email import notificar_cotizacion_enviada_email
                from apps.notificaciones.whatsapp import notificar_cotizacion_enviada_whatsapp
                import os
                pdf_path = os.path.join('media', str(cotizacion_formal.pdf_cotizacion))
                notificar_cotizacion_enviada_email(cotizacion_formal.cotizacion, pdf_path)
                notificar_cotizacion_enviada_whatsapp(cotizacion_formal.cotizacion)
        except Exception as e:
            print(f"Error enviando notificaciones cotizacion enviada: {e}")
        return response


class MensajeContactoViewSet(viewsets.ModelViewSet):
    queryset = MensajeContacto.objects.all()
    serializer_class = MensajeContactoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        try:
            from django.core.mail import EmailMultiAlternatives
            from django.conf import settings
            mensaje = MensajeContacto.objects.get(id=response.data['id'])
            html = f'''
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    <div style="background:#111827;padding:25px;text-align:center;">
      <h2 style="color:#facc15;margin:0;font-size:20px;">Nuevo Mensaje de Contacto</h2>
      <p style="color:#9ca3af;margin:6px 0 0;font-size:13px;">Recibido desde el formulario web</p>
    </div>
    <div style="padding:25px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;width:40%;">Nombre</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mensaje.nombre}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;">
          <td style="padding:10px 8px;color:#6b7280;">Telefono</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mensaje.telefono}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;">Correo</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mensaje.correo}</td>
        </tr>
        <tr>
          <td style="padding:10px 8px;color:#6b7280;vertical-align:top;">Mensaje</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mensaje.mensaje}</td>
        </tr>
      </table>
      <div style="margin-top:20px;text-align:center;">
        <a href="http://localhost:5173/admin-panel" style="background:#facc15;color:#111827;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:14px;">Ver en el panel admin</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:15px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">GyG Puertas Automaticas — Panel Administrativo</p>
    </div>
  </div>
</body>
</html>
'''
            msg = EmailMultiAlternatives(
                subject=f'Nuevo mensaje de contacto - {mensaje.nombre}',
                body=f'Mensaje de {mensaje.nombre} - {mensaje.telefono}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.EMAIL_HOST_USER]
            )
            msg.attach_alternative(html, "text/html")
            msg.send(fail_silently=True)
        except Exception as e:
            print(f"Error enviando email contacto: {e}")
        return response