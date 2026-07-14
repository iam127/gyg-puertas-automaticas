from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def notificar_cotizacion_email(cotizacion):
    try:
        subject = f'GyG Puertas - Cotizacion recibida {cotizacion.codigo}'
        text_content = f'Hola {cotizacion.nombre_cliente}, recibimos tu cotizacion {cotizacion.codigo}'

        html_cliente = f'''
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
        msg.attach_alternative(html_cliente, "text/html")
        msg.send()

        html_empresa = f'''
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    <div style="background:#111827;padding:25px;text-align:center;">
      <h2 style="color:#facc15;margin:0;font-size:20px;">Nueva Cotizacion Recibida</h2>
      <p style="color:#9ca3af;margin:6px 0 0;font-size:13px;">Codigo: {cotizacion.codigo}</p>
    </div>
    <div style="padding:25px;">
      <div style="background:#fefce8;border:2px solid #facc15;border-radius:10px;padding:15px;text-align:center;margin-bottom:20px;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:12px;">Codigo de seguimiento</p>
        <h2 style="margin:0;color:#111827;font-size:26px;letter-spacing:4px;font-weight:bold;">{cotizacion.codigo}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;width:40%;">Cliente</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{cotizacion.nombre_cliente}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;">
          <td style="padding:10px 8px;color:#6b7280;">Telefono</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{cotizacion.telefono}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;">Correo</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{cotizacion.correo}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;">
          <td style="padding:10px 8px;color:#6b7280;">Distrito</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{cotizacion.distrito}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;">Tipo de uso</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{cotizacion.tipo_uso}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;">
          <td style="padding:10px 8px;color:#6b7280;">Disponibilidad</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{cotizacion.disponibilidad}</td>
        </tr>
        <tr>
          <td style="padding:10px 8px;color:#6b7280;">Descripcion</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{cotizacion.descripcion}</td>
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
        msg_empresa = EmailMultiAlternatives(
            subject=f'Nueva cotizacion recibida - {cotizacion.codigo}',
            body=f'Nueva cotizacion de {cotizacion.nombre_cliente} - {cotizacion.telefono}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.EMAIL_HOST_USER]
        )
        msg_empresa.attach_alternative(html_empresa, "text/html")
        msg_empresa.send(fail_silently=True)

    except Exception as e:
        print(f"Error enviando email cotizacion: {e}")


def notificar_mantenimiento_email(mantenimiento):
    try:
        subject = f'GyG Puertas - Solicitud de {mantenimiento.tipo} recibida {mantenimiento.codigo}'
        text_content = f'Hola {mantenimiento.nombre_cliente}, recibimos tu solicitud {mantenimiento.codigo}'

        html_cliente = f'''
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
        msg.attach_alternative(html_cliente, "text/html")
        msg.send()

        html_empresa = f'''
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    <div style="background:#111827;padding:25px;text-align:center;">
      <h2 style="color:#facc15;margin:0;font-size:20px;">Nueva Solicitud de {mantenimiento.tipo.capitalize()}</h2>
      <p style="color:#9ca3af;margin:6px 0 0;font-size:13px;">Codigo: {mantenimiento.codigo}</p>
    </div>
    <div style="padding:25px;">
      <div style="background:#fefce8;border:2px solid #facc15;border-radius:10px;padding:15px;text-align:center;margin-bottom:20px;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:12px;">Codigo de seguimiento</p>
        <h2 style="margin:0;color:#111827;font-size:26px;letter-spacing:4px;font-weight:bold;">{mantenimiento.codigo}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;width:40%;">Cliente</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mantenimiento.nombre_cliente}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;">
          <td style="padding:10px 8px;color:#6b7280;">Telefono</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mantenimiento.telefono}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;">Correo</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mantenimiento.correo}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;">
          <td style="padding:10px 8px;color:#6b7280;">Distrito</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mantenimiento.distrito}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;">Tipo</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mantenimiento.tipo}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;">
          <td style="padding:10px 8px;color:#6b7280;">Tipo de puerta</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mantenimiento.tipo_puerta}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 8px;color:#6b7280;">Disponibilidad</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mantenimiento.disponibilidad}</td>
        </tr>
        <tr>
          <td style="padding:10px 8px;color:#6b7280;">Problema</td>
          <td style="padding:10px 8px;font-weight:bold;color:#111827;">{mantenimiento.descripcion_problema}</td>
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
        msg_empresa = EmailMultiAlternatives(
            subject=f'Nueva solicitud de {mantenimiento.tipo} - {mantenimiento.codigo}',
            body=f'Nueva solicitud de {mantenimiento.nombre_cliente} - {mantenimiento.telefono}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.EMAIL_HOST_USER]
        )
        msg_empresa.attach_alternative(html_empresa, "text/html")
        msg_empresa.send(fail_silently=True)

    except Exception as e:
        print(f"Error enviando email mantenimiento: {e}")


def notificar_cotizacion_enviada_email(cotizacion, pdf_path=None):
    try:
        subject = f'GyG Puertas - Tu cotizacion {cotizacion.codigo} esta lista'
        text_content = f'Hola {cotizacion.nombre_cliente}, tu cotizacion {cotizacion.codigo} esta lista.'

        html_cliente = f'''
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
    .message {{ color: #6b7280; font-size: 14px; margin-bottom: 25px; line-height: 1.6; }}
    .codigo-box {{ background-color: #fefce8; border: 2px solid #facc15; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 25px; }}
    .codigo-box p {{ margin: 0 0 5px; color: #6b7280; font-size: 13px; }}
    .codigo-box h2 {{ margin: 0; color: #111827; font-size: 28px; letter-spacing: 4px; font-weight: bold; }}
    .alert-box {{ background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 10px; padding: 16px; margin-bottom: 25px; text-align: center; }}
    .alert-box p {{ margin: 0; color: #16a34a; font-weight: bold; font-size: 14px; }}
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
      <p class="message">
        Hemos preparado tu cotizacion personalizada. Puedes revisar el detalle completo en el PDF adjunto a este correo.
        Si estas de acuerdo, respondenos por WhatsApp o correo para coordinar la instalacion.
      </p>
      <div class="alert-box">
        <p>Tu cotizacion esta adjunta en este correo como PDF</p>
      </div>
      <div class="codigo-box">
        <p>Tu codigo de seguimiento:</p>
        <h2>{cotizacion.codigo}</h2>
      </div>
      <div class="cta">
        <a href="http://localhost:5173/seguimiento">Ver estado de mi solicitud</a>
      </div>
      <p style="color:#6b7280;font-size:13px;text-align:center;">
        Si tienes alguna pregunta, contactanos por WhatsApp al <strong>+51 947 316 864</strong>
      </p>
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
        msg.attach_alternative(html_cliente, "text/html")

        if pdf_path:
            import os
            if os.path.exists(pdf_path):
                with open(pdf_path, 'rb') as f:
                    msg.attach(f'Cotizacion_{cotizacion.codigo}.pdf', f.read(), 'application/pdf')

        msg.send()
        print(f"Email cotizacion enviada a {cotizacion.correo}")
    except Exception as e:
        print(f"Error enviando email cotizacion enviada: {e}")