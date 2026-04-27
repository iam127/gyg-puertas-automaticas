import requests
import os
from dotenv import load_dotenv

load_dotenv()

token = os.getenv('WHATSAPP_TOKEN')
phone_id = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
numero = '51949510535'

print(f'Token (primeros 20): {token[:20] if token else "NO TOKEN"}')
print(f'Phone ID: {phone_id}')
print(f'Enviando a: {numero}')

url = f'https://graph.facebook.com/v18.0/{phone_id}/messages'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}
data = {
    'messaging_product': 'whatsapp',
    'to': numero,
    'type': 'text',
    'text': {'body': 'Prueba desde GyG Puertas Automaticas'}
}

r = requests.post(url, headers=headers, json=data)
print(f'Status: {r.status_code}')
print(f'Respuesta: {r.json()}')