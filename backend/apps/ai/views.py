from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

SYSTEM_PROMPT = """
Eres un asistente virtual de GyG Puertas Automáticas, una empresa peruana especializada en instalación y mantenimiento de puertas automáticas.

INFORMACIÓN DE LA EMPRESA:
- Nombre: GyG Puertas Automáticas
- Fundación: Más de 4 años de experiencia en el mercado peruano
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

GARANTÍA:
- Todas las instalaciones tienen garantía de 12 a 24 meses según el producto
- La garantía cubre defectos de instalación y fallas del motor
- No cubre daños por mal uso o accidentes

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
        historial_gemini = []
        for msg in historial[-10:]:
            rol = 'user' if msg['rol'] == 'user' else 'model'
            historial_gemini.append(
                genai.types.Content(role=rol, parts=[genai.types.Part(text=msg['contenido'])])
            )

        prompt_completo = f"{SYSTEM_PROMPT}\n\nUsuario: {mensaje}"

        respuesta = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=historial_gemini + [genai.types.Content(role='user', parts=[genai.types.Part(text=prompt_completo)])],
        )

        texto = respuesta.text
        return Response({'respuesta': texto})

    except Exception as e:
        import traceback
        traceback.print_exc()
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

        respuesta = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
        )

        texto = respuesta.text.strip()

        if texto == 'ninguno':
            return Response({'productos': []})

        ids = [int(id.strip()) for id in texto.split(',') if id.strip().isdigit()]
        productos_filtrados = Producto.objects.filter(id__in=ids, activo=True)

        from apps.productos.serializers import ProductoListSerializer
        serializer = ProductoListSerializer(productos_filtrados, many=True, context={'request': request})
        return Response({'productos': serializer.data})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)