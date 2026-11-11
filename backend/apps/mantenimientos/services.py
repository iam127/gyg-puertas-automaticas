from .models import Mantenimiento, VisitaMantenimiento


def crear_mantenimiento(data):
    mantenimiento = Mantenimiento.objects.create(**data)
    try:
        from apps.notificaciones.whatsapp import notificar_nuevo_mantenimiento
        from apps.notificaciones.email import notificar_mantenimiento_email
        notificar_nuevo_mantenimiento(mantenimiento)
        notificar_mantenimiento_email(mantenimiento)
    except Exception as e:
        import traceback
        print(f"Error enviando notificacion: {e}")
        traceback.print_exc()
    return mantenimiento


def asignar_tecnico_mantenimiento(mantenimiento, tecnico, fecha, hora):
    visita_existente = VisitaMantenimiento.objects.filter(mantenimiento=mantenimiento).first()
    if visita_existente:
        visita_existente.tecnico = tecnico
        visita_existente.fecha = fecha
        visita_existente.hora = hora
        visita_existente.save()
        visita = visita_existente
    else:
        visita = VisitaMantenimiento.objects.create(
            mantenimiento=mantenimiento,
            tecnico=tecnico,
            fecha=fecha,
            hora=hora,
        )
    mantenimiento.estado = 'visita_agendada'
    mantenimiento.save()
    return visita