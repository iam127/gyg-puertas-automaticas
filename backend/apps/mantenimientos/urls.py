from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MantenimientoViewSet, VisitaMantenimientoViewSet

router = DefaultRouter()
router.register(r'mantenimientos', MantenimientoViewSet)
router.register(r'visitas-mantenimiento', VisitaMantenimientoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]