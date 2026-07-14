from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from google import genai
import os
from dotenv import load_dotenv
from datetime import datetime
import pytz

load_dotenv()

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

def get_context_from_db():
    """Obtiene toda la información relevante de la base de datos en tiempo real."""
    from apps.productos.models import Producto, CategoriaProducto

    # Fecha y hora peruana
    zona_peru = pytz.timezone('America/Lima')
    ahora = datetime.now(zona_peru)
    fecha_hora = ahora.strftime('%A %d de %B de %Y, %H:%M horas (hora de Lima, Perú)')

    # Productos activos
    productos = Producto.objects.filter(activo=True)
    lista_productos = '\n'.join([
        f"- {p.nombre} | Uso: {p.get_uso_display()} | Material: {p.material or 'N/A'} | Descripción: {p.descripcion[:200]}"
        for p in productos
    ]) if productos.exists() else "No hay productos registrados actualmente."

    # Categorías
    categorias = CategoriaProducto.objects.all()
    lista_categorias = ', '.join([c.nombre for c in categorias]) if categorias.exists() else "Sin categorías registradas."

    # Estadísticas básicas
    from apps.cotizaciones.models import Cotizacion
    from apps.mantenimientos.models import Mantenimiento
    total_cotizaciones = Cotizacion.objects.count()
    total_mantenimientos = Mantenimiento.objects.count()

    context = f"""
FECHA Y HORA ACTUAL EN LIMA, PERÚ: {fecha_hora}

INFORMACIÓN DE LA EMPRESA:
- Nombre: GyG Puertas Automáticas
- Fundación: Más de 4 años de experiencia en el mercado peruano
- Rubro: Fabricación, instalación y mantenimiento de puertas automáticas
- Cobertura: Todos los distritos de Lima Metropolitana
- Horario de atención: Lunes a Sábado de 8am a 6pm
- Teléfono: +51 947 316 864
- Correo: gygpuertasautomaticas@gmail.com
- WhatsApp: +51 947 316 864
- Dirección: Manuel Odria 161, Ate, Lima, Perú

CATEGORÍAS DE PRODUCTOS:
{lista_categorias}

PRODUCTOS DISPONIBLES ACTUALMENTE EN EL CATÁLOGO:
{lista_productos}

SERVICIOS QUE OFRECEMOS:
- Instalación de puertas automáticas (residencial, comercial e industrial)
- Mantenimiento preventivo (revisión periódica para evitar fallas)
- Mantenimiento correctivo (reparación de fallas)
- Servicio de garantía
- Visitas técnicas para cotización (sin costo)
- Asesoría personalizada

PROCESO DE COTIZACIÓN:
1. El cliente solicita cotización por la web o WhatsApp
2. Un técnico agenda una visita al domicilio sin costo
3. Se evalúa el espacio y requerimientos
4. Se envía la cotización formal en PDF en 24-48 horas
- Los precios NO se dan por teléfono o chat, siempre requieren visita técnica previa

PROCESO DE MANTENIMIENTO:
1. El cliente solicita mantenimiento por la web (preventivo, correctivo o garantía)
2. Un técnico es asignado y visita el domicilio
3. El técnico realiza el diagnóstico y el trabajo
4. Se emite un reporte del servicio realizado

SEGUIMIENTO DE SOLICITUDES:
- El cliente recibe un código único al registrar su solicitud
- Puede consultar el estado en tiempo real en la sección Seguimiento de la web
- También recibe notificaciones automáticas por WhatsApp y correo electrónico

GARANTÍA:
- Todas las instalaciones tienen garantía de 12 a 24 meses según el producto
- La garantía cubre defectos de instalación y fallas del motor
- No cubre daños por mal uso o accidentes

ESTADÍSTICAS DE LA EMPRESA:
- Cotizaciones atendidas: {total_cotizaciones}
- Mantenimientos atendidos: {total_mantenimientos}
"""
    return context


INSTRUCCIONES = """
INSTRUCCIONES DE COMPORTAMIENTO:
- Eres el asistente virtual de GyG Puertas Automáticas
- Responde siempre en español, de manera amable, profesional y concisa
- Usa la información de la base de datos proporcionada para responder con precisión
- Si el cliente quiere cotizar, indícale que puede hacerlo en la sección "Cotizar" de la web o por WhatsApp
- Si el cliente tiene un problema con su puerta, indícale la sección "Mantenimiento"
- Si el cliente quiere seguimiento, indícale la sección "Seguimiento" con su código único
- No inventes precios específicos, siempre indica que requiere visita técnica gratuita
- Si el cliente pregunta por algo que no sabes, invítalos a contactarnos directamente
- Responde de forma natural y conversacional, no como un robot
- Cuando te pregunten la fecha u hora, usa la información proporcionada
"""


@api_view(['POST'])
def chatbot(request):
    mensaje = request.data.get('mensaje', '')
    historial = request.data.get('historial', [])

    if not mensaje:
        return Response({'error': 'Mensaje requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obtener contexto actualizado de la BD
        contexto = get_context_from_db()

        # Construir historial para Gemini
        historial_gemini = []
        for msg in historial[-10:]:
            rol = 'user' if msg['rol'] == 'user' else 'model'
            historial_gemini.append(
                genai.types.Content(role=rol, parts=[genai.types.Part(text=msg['contenido'])])
            )

        # Prompt completo con contexto de BD
        prompt_completo = f"{contexto}\n\n{INSTRUCCIONES}\n\nUsuario: {mensaje}"

        respuesta = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=historial_gemini + [
                genai.types.Content(role='user', parts=[genai.types.Part(text=prompt_completo)])
            ],
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
            f"- ID:{p.id} | {p.nombre} | Uso: {p.get_uso_display()} | Material: {p.material or 'N/A'} | Descripción: {p.descripcion[:100]}"
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
            model='gemini-2.5-flash',
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