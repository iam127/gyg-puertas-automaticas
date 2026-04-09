from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet, FAQViewSet, GaleriaViewSet, TestimonioViewSet

router = DefaultRouter()
router.register(r'blog', BlogViewSet)
router.register(r'faq', FAQViewSet)
router.register(r'galeria', GaleriaViewSet)
router.register(r'testimonios', TestimonioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]