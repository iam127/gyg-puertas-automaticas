from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CotizacionViewSet, VisitaTecnicaViewSet, CotizacionFormalViewSet, MensajeContactoViewSet

router = DefaultRouter()
router.register(r'cotizaciones', CotizacionViewSet)
router.register(r'visitas', VisitaTecnicaViewSet)
router.register(r'cotizaciones-formales', CotizacionFormalViewSet)
router.register(r'contacto', MensajeContactoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]