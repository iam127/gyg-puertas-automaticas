from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TecnicoViewSet, CodigoInvitacionViewSet

router = DefaultRouter()
router.register(r'tecnicos', TecnicoViewSet)
router.register(r'codigos-invitacion', CodigoInvitacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]