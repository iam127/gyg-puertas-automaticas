from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings

def notificar_cotizacion_email(cotizacion):
    try:
        subject = f'GyG Puertas - Cotizacion recibida {cotizacion.codigo}'
        text_content = f'Hola {cotizacion.nombre_cliente}, recibimos tu cotizacion {cotizacion.codigo}'

        html_content = f'''
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
    .header {{ background-color: #111827; padding: 30px; text-align: center; }}
    .header h1 {{ color: #facc15; margin: 0; font-size: 24px; }}
    .header p {{ color: #9ca3af; margin: 5px 0 0; font-size: 14px; }}
    .body {{ padding: 30px; }}
    .greeting {{ font-size: 18px; color: #111827; font-weight: bold; margin-bottom: 10px; }}
    .message {{ color: #6b7280; font-size: 14px; margin-bottom: 25px; }}
    .codigo-box {{ background-color: #fefce8; border: 2px solid #facc15; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 25px; }}
    .codigo-box p {{ margin: 0 0 5px; color: #6b7280; font-size: 13px; }}
    .codigo-box h2 {{ margin: 0; color: #111827; font-size: 28px; letter-spacing: 4px; font-weight: bold; }}
    .details {{ background-color: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 25px; }}
    .details h3 {{ margin: 0 0 15px; color: #111827; font-size: 15px; }}
    .detail-row {{ margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }}
    .detail-row:last-child {{ border-bottom: none; margin-bottom: 0; padding-bottom: 0; }}
    .cta {{ text-align: center; margin-bottom: 25px; }}
    .cta a {{ background-color: #facc15; color: #111827; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; }}
    .footer {{ background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }}
    .footer p {{ margin: 3px 0; color: #9ca3af; font-size: 12px; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GyG Puertas Automaticas</h1>
      <p>Especialistas en puertas automaticas en Lima</p>
    </div>
    <div class="body">
      <p class="greeting">Hola, {cotizacion.nombre_cliente}</p>
      <p class="message">Recibimos tu solicitud de cotizacion correctamente. Nuestro equipo te contactara a la brevedad para coordinar una visita tecnica gratuita.</p>

      <div class="codigo-box">
        <p>Tu codigo de seguimiento es:</p>
        <h2>{cotizacion.codigo}</h2>
      </div>

      <div class="details">
        <h3>Detalles de tu solicitud</h3>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Distrito</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{cotizacion.distrito}</p>
        </div>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Tipo de uso</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{cotizacion.tipo_uso}</p>
        </div>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Disponibilidad</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{cotizacion.disponibilidad}</p>
        </div>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Descripcion</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{cotizacion.descripcion}</p>
        </div>
      </div>

      <div class="cta">
        <a href="http://localhost:5173/seguimiento">Hacer seguimiento</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>GyG Puertas Automaticas</strong></p>
      <p>Manuel Odria 161, Ate, Lima, Peru</p>
      <p>Tel: +51 947 316 864 | WhatsApp: +51 947 316 874</p>
      <p>gygpuertasautomaticas@gmail.com</p>
    </div>
  </div>
</body>
</html>
'''

        msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [cotizacion.correo])
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        send_mail(
            subject=f'Nueva cotizacion recibida - {cotizacion.codigo}',
            message=f'Cliente: {cotizacion.nombre_cliente}\nTelefono: {cotizacion.telefono}\nCorreo: {cotizacion.correo}\nDistrito: {cotizacion.distrito}\nTipo de uso: {cotizacion.tipo_uso}\nDescripcion: {cotizacion.descripcion}\nDisponibilidad: {cotizacion.disponibilidad}\nCodigo: {cotizacion.codigo}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Error enviando email cotizacion: {e}")


def notificar_mantenimiento_email(mantenimiento):
    try:
        subject = f'GyG Puertas - Solicitud de {mantenimiento.tipo} recibida {mantenimiento.codigo}'
        text_content = f'Hola {mantenimiento.nombre_cliente}, recibimos tu solicitud {mantenimiento.codigo}'

        html_content = f'''
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
    .header {{ background-color: #111827; padding: 30px; text-align: center; }}
    .header h1 {{ color: #facc15; margin: 0; font-size: 24px; }}
    .header p {{ color: #9ca3af; margin: 5px 0 0; font-size: 14px; }}
    .body {{ padding: 30px; }}
    .greeting {{ font-size: 18px; color: #111827; font-weight: bold; margin-bottom: 10px; }}
    .message {{ color: #6b7280; font-size: 14px; margin-bottom: 25px; }}
    .codigo-box {{ background-color: #fefce8; border: 2px solid #facc15; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 25px; }}
    .codigo-box p {{ margin: 0 0 5px; color: #6b7280; font-size: 13px; }}
    .codigo-box h2 {{ margin: 0; color: #111827; font-size: 28px; letter-spacing: 4px; font-weight: bold; }}
    .details {{ background-color: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 25px; }}
    .details h3 {{ margin: 0 0 15px; color: #111827; font-size: 15px; }}
    .detail-row {{ margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }}
    .detail-row:last-child {{ border-bottom: none; margin-bottom: 0; padding-bottom: 0; }}
    .cta {{ text-align: center; margin-bottom: 25px; }}
    .cta a {{ background-color: #facc15; color: #111827; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; }}
    .footer {{ background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }}
    .footer p {{ margin: 3px 0; color: #9ca3af; font-size: 12px; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GyG Puertas Automaticas</h1>
      <p>Especialistas en puertas automaticas en Lima</p>
    </div>
    <div class="body">
      <p class="greeting">Hola, {mantenimiento.nombre_cliente}</p>
      <p class="message">Recibimos tu solicitud de {mantenimiento.tipo} correctamente. Nuestro tecnico se comunicara contigo para coordinar la visita.</p>

      <div class="codigo-box">
        <p>Tu codigo de seguimiento es:</p>
        <h2>{mantenimiento.codigo}</h2>
      </div>

      <div class="details">
        <h3>Detalles de tu solicitud</h3>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Tipo</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{mantenimiento.tipo}</p>
        </div>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Distrito</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{mantenimiento.distrito}</p>
        </div>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Tipo de puerta</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{mantenimiento.tipo_puerta}</p>
        </div>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Disponibilidad</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{mantenimiento.disponibilidad}</p>
        </div>
        <div class="detail-row">
          <p style="margin:0 0 3px;color:#6b7280;font-size:12px;">Problema</p>
          <p style="margin:0;color:#111827;font-weight:bold;font-size:14px;">{mantenimiento.descripcion_problema}</p>
        </div>
      </div>

      <div class="cta">
        <a href="http://localhost:5173/seguimiento">Hacer seguimiento</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>GyG Puertas Automaticas</strong></p>
      <p>Manuel Odria 161, Ate, Lima, Peru</p>
      <p>Tel: +51 947 316 864 | WhatsApp: +51 947 316 874</p>
      <p>gygpuertasautomaticas@gmail.com</p>
    </div>
  </div>
</body>
</html>
'''

        msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [mantenimiento.correo])
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        send_mail(
            subject=f'Nueva solicitud de {mantenimiento.tipo} - {mantenimiento.codigo}',
            message=f'Cliente: {mantenimiento.nombre_cliente}\nTelefono: {mantenimiento.telefono}\nCorreo: {mantenimiento.correo}\nDistrito: {mantenimiento.distrito}\nTipo: {mantenimiento.tipo}\nTipo de puerta: {mantenimiento.tipo_puerta}\nProblema: {mantenimiento.descripcion_problema}\nDisponibilidad: {mantenimiento.disponibilidad}\nCodigo: {mantenimiento.codigo}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Error enviando email mantenimiento: {e}")