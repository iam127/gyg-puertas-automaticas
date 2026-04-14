import requests
import os
from dotenv import load_dotenv

load_dotenv()

WHATSAPP_TOKEN = os.getenv('WHATSAPP_TOKEN')
PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_NUMBER_ID')

def enviar_whatsapp(telefono, mensaje):
    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": telefono,
        "type": "text",
        "text": {"body": mensaje}
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        return response.json()
    except Exception as e:
        print(f"Error enviando WhatsApp: {e}")
        return None

def notificar_nueva_cotizacion(cotizacion):
    telefono = f"51{cotizacion.telefono.replace('+51', '').replace(' ', '')}"
    mensaje = f"""*GyG Puertas Automaticas*

Hola {cotizacion.nombre_cliente}, recibimos tu solicitud de cotizacion.

*Codigo de seguimiento:* {cotizacion.codigo}

Nuestro equipo te contactara a la brevedad para coordinar una visita tecnica.

Para hacer seguimiento de tu solicitud visita nuestra web e ingresa tu codigo.

Gracias por contactarnos!"""
    return enviar_whatsapp(telefono, mensaje)

def notificar_nuevo_mantenimiento(mantenimiento):
    telefono = f"51{mantenimiento.telefono.replace('+51', '').replace(' ', '')}"
    mensaje = f"""*GyG Puertas Automaticas*

Hola {mantenimiento.nombre_cliente}, recibimos tu solicitud de {mantenimiento.tipo}.

*Codigo de seguimiento:* {mantenimiento.codigo}

Nuestro tecnico se comunicara contigo para coordinar la visita.

Para hacer seguimiento visita nuestra web e ingresa tu codigo.

Gracias por contactarnos!"""
    return enviar_whatsapp(telefono, mensaje)