from rest_framework import viewsets
from .models import Blog, FAQ, Galeria, Testimonio
from .serializers import BlogSerializer, FAQSerializer, GaleriaSerializer, TestimonioSerializer

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.filter(activo=True)
    serializer_class = FAQSerializer

class GaleriaViewSet(viewsets.ModelViewSet):
    queryset = Galeria.objects.filter(activo=True)
    serializer_class = GaleriaSerializer

class TestimonioViewSet(viewsets.ModelViewSet):
    queryset = Testimonio.objects.all()
    serializer_class = TestimonioSerializer