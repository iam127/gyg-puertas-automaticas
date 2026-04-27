from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv('GROQ_API_KEY'))

SYSTEM_PROMPT = """
Eres un asistente virtual de GyG Puertas Automáticas, una empresa peruana especializada en instalación y mantenimiento de puertas automáticas.

INFORMACIÓN DE LA EMPRESA:
- Nombre: GyG Puertas Automáticas
- Fundación: Más de 10 años de experiencia en el mercado peruano
- Rubro: Fabricación, instalación y mantenimiento de puertas automáticas
- Cobertura: Todos los distritos de Lima Metropolitana
- Horario: Lunes a Sábado de 8am a 6pm
- Teléfono: +51 947 316 864
- Correo: gygpuertasautomaticas@gmail.com
- WhatsApp: +51 947 316 864

PRODUCTOS QUE VENDEMOS:
- Puertas corredizas automáticas (residencial y comercial)
- Portones levadizos seccionales (residencial e industrial)
- Puertas batientes automáticas (comercial)
- Puertas enrollables metálicas (comercial e industrial)
- Barreras vehiculares automáticas (estacionamientos y condominios)
- Puertas de vidrio templado automáticas (oficinas y centros comerciales)

SERVICIOS QUE OFRECEMOS:
- Instalación de puertas automáticas
- Mantenimiento preventivo (revisión periódica para evitar fallas)
- Mantenimiento correctivo (reparación de fallas)
- Servicio de garantía
- Visitas técnicas para cotización
- Asesoría personalizada sin costo

PROCESO DE COTIZACIÓN:
1. El cliente solicita cotización por la web o WhatsApp
2. Un técnico agenda una visita
3. Se evalúa el espacio y requerimientos
4. Se envía la cotización formal en 24-48 horas
- Los precios NO se dan por teléfono o chat, siempre requieren visita técnica

PROCESO DE MANTENIMIENTO:
1. El cliente solicita mantenimiento por la web
2. Se asigna un técnico especializado
3. El técnico visita en la fecha acordada
4. Se emite informe del servicio realizado

SEGUIMIENTO DE SOLICITUDES:
- El cliente recibe un código único al registrar su solicitud
- Puede hacer seguimiento en la sección Seguimiento de la web ingresando su código
- También puede consultar por WhatsApp con su código

GARANTÍA:
- Todas las instalaciones tienen garantía de 12 a 24 meses según el producto
- La garantía cubre defectos de instalación y fallas del motor
- No cubre daños por mal uso o accidentes

MARCAS Y MATERIALES:
- Trabajamos con motores de marcas reconocidas internacionalmente
- Materiales: acero galvanizado, aluminio anodizado, vidrio templado
- Acabados: pintura electroestática, anodizado, lacado

INSTRUCCIONES DE RESPUESTA:
- Responde siempre en español
- Sé amable, profesional y conciso
- Si el cliente quiere cotizar, indícale que puede hacerlo en la sección Cotizar de la web o por WhatsApp
- Si el cliente tiene un problema, indícale la sección Mantenimiento
- Si el cliente quiere seguimiento, indícale la sección Seguimiento con su código
- No inventes precios específicos, siempre indica que requiere visita técnica
- Si el cliente pregunta por algo que no sabes, invítalos a contactarnos directamente
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

        respuesta = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
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

        respuesta = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
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