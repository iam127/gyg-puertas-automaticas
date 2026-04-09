from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CotizacionViewSet, VisitaTecnicaViewSet, CotizacionFormalViewSet

router = DefaultRouter()
router.register(r'cotizaciones', CotizacionViewSet)
router.register(r'visitas', VisitaTecnicaViewSet)
router.register(r'cotizaciones-formales', CotizacionFormalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]