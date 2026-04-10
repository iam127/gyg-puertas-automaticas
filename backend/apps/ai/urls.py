from django.urls import path
from .views import chatbot, buscar_inteligente

urlpatterns = [
    path('chatbot/', chatbot),
    path('buscar-inteligente/', buscar_inteligente),
]