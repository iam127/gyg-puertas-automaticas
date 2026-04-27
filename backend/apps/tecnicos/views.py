from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Tecnico, CodigoInvitacion
from .serializers import TecnicoSerializer, TecnicoRegistroSerializer, CodigoInvitacionSerializer

class TecnicoViewSet(viewsets.ModelViewSet):
    queryset = Tecnico.objects.all()
    serializer_class = TecnicoSerializer

    @action(detail=False, methods=['post'])
    def registro(self, request):
        serializer = TecnicoRegistroSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            codigo = CodigoInvitacion.objects.get(codigo=data['codigo_invitacion'], usado=False)
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email']
            )
            Tecnico.objects.create(
                usuario=user,
                telefono=data['telefono'],
                codigo_invitacion=data['codigo_invitacion']
            )
            codigo.usado = True
            codigo.save()
            return Response({'mensaje': 'Tecnico registrado correctamente'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CodigoInvitacionViewSet(viewsets.ModelViewSet):
    queryset = CodigoInvitacion.objects.all()
    serializer_class = CodigoInvitacionSerializer

    def create(self, request, *args, **kwargs):
        import random
        import string
        codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        obj = CodigoInvitacion.objects.create(codigo=codigo)
        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)