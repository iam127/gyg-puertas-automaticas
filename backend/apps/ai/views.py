from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

SYSTEM_PROMPT = """
Eres un asistente virtual de GyG Puertas Automáticas, una empresa peruana especializada en instalación y mantenimiento de puertas automáticas.

Información de la empresa:
- Vendemos puertas levadizas, corredizas, batientes, seccionales, industriales y barreras automáticas
- Ofrecemos instalación, mantenimiento preventivo, correctivo y servicio de garantía
- Atendemos en todos los distritos de Lima Metropolitana
- Horario: Lunes a Sábado de 8am a 6pm
- Contacto: +51 999 999 999 / contacto@gygpuertas.com

Instrucciones:
- Responde siempre en español
- Sé amable, profesional y conciso
- Si el cliente quiere cotizar, indícale que puede hacerlo en la sección Cotizar de la web
- Si el cliente tiene un problema con su puerta, indícale que puede solicitar mantenimiento en la sección Mantenimiento
- Si el cliente quiere hacer seguimiento, indícale que vaya a la sección Seguimiento e ingrese su código
- No inventes precios, siempre indica que los precios se dan después de una visita técnica
- Si no sabes algo, indica que puede contactarnos directamente
"""

@api_view(['POST'])
def chatbot(request):
    mensaje = request.data.get('mensaje', '')
    historial = request.data.get('historial', [])

    if not mensaje:
        return Response({'error': 'Mensaje requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        mensajes = [{'role': 'system', 'content': SYSTEM_PROMPT}]
        for msg in historial[-10:]:
            mensajes.append({'role': msg['rol'], 'content': msg['contenido']})
        mensajes.append({'role': 'user', 'content': mensaje})

        respuesta = openai.chat.completions.create(
            model='gpt-4o-mini',
            messages=mensajes,
            max_tokens=500,
            temperature=0.7,
        )

        texto = respuesta.choices[0].message.content
        return Response({'respuesta': texto})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def buscar_inteligente(request):
    query = request.query_params.get('q', '')
    if not query:
        return Response({'error': 'Query requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        from apps.productos.models import Producto
        productos = Producto.objects.filter(activo=True)
        lista_productos = '\n'.join([
            f"- ID:{p.id} | {p.nombre} | Uso: {p.uso} | Material: {p.material} | Descripción: {p.descripcion[:100]}"
            for p in productos
        ])

        prompt = f"""
Dado el siguiente catálogo de puertas automáticas:
{lista_productos}

El cliente busca: "{query}"

Responde SOLO con una lista de IDs de productos relevantes separados por comas. 
Ejemplo: 1,3,5
Si ninguno es relevante responde: ninguno
"""

        respuesta = openai.chat.completions.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': prompt}],
            max_tokens=100,
            temperature=0,
        )

        texto = respuesta.choices[0].message.content.strip()

        if texto == 'ninguno':
            return Response({'productos': []})

        ids = [int(id.strip()) for id in texto.split(',') if id.strip().isdigit()]
        productos_filtrados = Producto.objects.filter(id__in=ids, activo=True)

        from apps.productos.serializers import ProductoListSerializer
        serializer = ProductoListSerializer(productos_filtrados, many=True, context={'request': request})
        return Response({'productos': serializer.data})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)