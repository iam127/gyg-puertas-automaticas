from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Blog, FAQ, Galeria, Testimonio
from .serializers import BlogSerializer, FAQSerializer, GaleriaSerializer, TestimonioSerializer


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.filter(activo=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]


class GaleriaViewSet(viewsets.ModelViewSet):
    queryset = Galeria.objects.filter(activo=True)
    serializer_class = GaleriaSerializer
    permission_classes = [AllowAny]


class TestimonioViewSet(viewsets.ModelViewSet):
    queryset = Testimonio.objects.all()
    serializer_class = TestimonioSerializer
    permission_classes = [AllowAny]