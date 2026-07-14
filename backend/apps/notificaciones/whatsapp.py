import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = os.getenv('TWILIO_WHATSAPP_NUMBER')

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def enviar_whatsapp(telefono, mensaje):
    try:
        numero_destino = f'whatsapp:+51{telefono}'
        print(f"=== TWILIO DEBUG ===")
        print(f"Desde: {TWILIO_WHATSAPP_NUMBER}")
        print(f"Hacia: {numero_destino}")
        print(f"===================")
        message = client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            to=numero_destino,
            body=mensaje
        )
        print(f"WhatsApp enviado correctamente: {message.sid}")
        return message.sid
    except Exception as e:
        print(f"Error enviando WhatsApp: {e}")
        return None

def notificar_nueva_cotizacion(cotizacion):
    telefono = cotizacion.telefono.replace('+51', '').replace(' ', '')
    mensaje = f"""GyG Puertas Automaticas

Hola {cotizacion.nombre_cliente}, recibimos tu solicitud de cotizacion.

Codigo de seguimiento: {cotizacion.codigo}

Nuestro equipo te contactara a la brevedad para coordinar una visita tecnica.

Para hacer seguimiento visita nuestra web e ingresa tu codigo.

Gracias por contactarnos!"""
    return enviar_whatsapp(telefono, mensaje)

def notificar_nuevo_mantenimiento(mantenimiento):
    telefono = mantenimiento.telefono.replace('+51', '').replace(' ', '')
    mensaje = f"""GyG Puertas Automaticas

Hola {mantenimiento.nombre_cliente}, recibimos tu solicitud de {mantenimiento.tipo}.

Codigo de seguimiento: {mantenimiento.codigo}

Nuestro tecnico se comunicara contigo para coordinar la visita.

Para hacer seguimiento visita nuestra web e ingresa tu codigo.

Gracias por contactarnos!"""
    return enviar_whatsapp(telefono, mensaje)

def notificar_cotizacion_enviada_whatsapp(cotizacion):
    telefono = cotizacion.telefono.replace('+51', '').replace(' ', '')
    mensaje = f"""GyG Puertas Automaticas

Hola {cotizacion.nombre_cliente}, tu cotizacion esta lista!

Codigo: {cotizacion.codigo}

Te enviamos el detalle completo al correo {cotizacion.correo}.

Si estas de acuerdo con la cotizacion, respondenos para coordinar la instalacion.

Gracias por confiar en nosotros!"""
    return enviar_whatsapp(telefono, mensaje)