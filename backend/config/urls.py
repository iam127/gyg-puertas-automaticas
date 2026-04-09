from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.productos.urls')),
    path('api/', include('apps.cotizaciones.urls')),
    path('api/', include('apps.mantenimientos.urls')),
    path('api/', include('apps.tecnicos.urls')),
    path('api/', include('apps.contenido.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)