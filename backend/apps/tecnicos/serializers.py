from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tecnico
from .models import Tecnico, CodigoInvitacion

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class TecnicoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = Tecnico
        fields = '__all__'

class TecnicoRegistroSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    telefono = serializers.CharField()
    codigo_invitacion = serializers.CharField()

    def validate_codigo_invitacion(self, value):
        from .models import CodigoInvitacion
        try:
            codigo = CodigoInvitacion.objects.get(codigo=value, usado=False)
        except CodigoInvitacion.DoesNotExist:
            raise serializers.ValidationError("Codigo de invitacion invalido o ya fue usado.")
        return value
    
class CodigoInvitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodigoInvitacion
        fields = '__all__'
