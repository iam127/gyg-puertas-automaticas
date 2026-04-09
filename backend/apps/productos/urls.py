from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CategoriaProductoViewSet, ImagenProductoViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaProductoViewSet)
router.register(r'imagenes', ImagenProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]