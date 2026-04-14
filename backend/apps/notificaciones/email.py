from django.core.mail import send_mail
from django.conf import settings

def notificar_cotizacion_email(cotizacion):
    try:
        send_mail(
            subject=f'GyG Puertas - Cotizacion recibida {cotizacion.codigo}',
            message=f'''
Hola {cotizacion.nombre_cliente},

Recibimos tu solicitud de cotizacion correctamente.

Codigo de seguimiento: {cotizacion.codigo}

Detalles de tu solicitud:
- Distrito: {cotizacion.distrito}
- Tipo de uso: {cotizacion.tipo_uso}
- Descripcion: {cotizacion.descripcion}

Nuestro equipo te contactara a la brevedad para coordinar una visita tecnica gratuita.

Para hacer seguimiento de tu solicitud ingresa a nuestra web y usa tu codigo.

Saludos,
GyG Puertas Automaticas
Tel: +51 947 316 864
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[cotizacion.correo],
            fail_silently=True,
        )
        # Notificar tambien al admin
        send_mail(
            subject=f'Nueva cotizacion recibida - {cotizacion.codigo}',
            message=f'''
Nueva solicitud de cotizacion recibida:

Cliente: {cotizacion.nombre_cliente}
Telefono: {cotizacion.telefono}
Correo: {cotizacion.correo}
Distrito: {cotizacion.distrito}
Tipo de uso: {cotizacion.tipo_uso}
Descripcion: {cotizacion.descripcion}
Disponibilidad: {cotizacion.disponibilidad}
Codigo: {cotizacion.codigo}
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Error enviando email cotizacion: {e}")

def notificar_mantenimiento_email(mantenimiento):
    try:
        send_mail(
            subject=f'GyG Puertas - Solicitud de {mantenimiento.tipo} recibida {mantenimiento.codigo}',
            message=f'''
Hola {mantenimiento.nombre_cliente},

Recibimos tu solicitud de {mantenimiento.tipo} correctamente.

Codigo de seguimiento: {mantenimiento.codigo}

Detalles de tu solicitud:
- Tipo: {mantenimiento.tipo}
- Distrito: {mantenimiento.distrito}
- Tipo de puerta: {mantenimiento.tipo_puerta}
- Problema: {mantenimiento.descripcion_problema}

Nuestro tecnico se comunicara contigo para coordinar la visita.

Para hacer seguimiento ingresa a nuestra web y usa tu codigo.

Saludos,
GyG Puertas Automaticas
Tel: +51 947 316 864
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[mantenimiento.correo],
            fail_silently=True,
        )
        # Notificar tambien al admin
        send_mail(
            subject=f'Nueva solicitud de {mantenimiento.tipo} - {mantenimiento.codigo}',
            message=f'''
Nueva solicitud de mantenimiento recibida:

Cliente: {mantenimiento.nombre_cliente}
Telefono: {mantenimiento.telefono}
Correo: {mantenimiento.correo}
Distrito: {mantenimiento.distrito}
Tipo: {mantenimiento.tipo}
Tipo de puerta: {mantenimiento.tipo_puerta}
Problema: {mantenimiento.descripcion_problema}
Disponibilidad: {mantenimiento.disponibilidad}
Codigo: {mantenimiento.codigo}
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Error enviando email mantenimiento: {e}")