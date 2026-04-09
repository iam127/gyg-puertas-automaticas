from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MantenimientoViewSet, VisitaMantenimientoViewSet, TestimonioViewSet

router = DefaultRouter()
router.register(r'mantenimientos', MantenimientoViewSet)
router.register(r'visitas-mantenimiento', VisitaMantenimientoViewSet)
router.register(r'testimonios', TestimonioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]