import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import NativeLinking from '../../services/linking';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import StatusBar from '../../components/common/StatusBar';

export const AssignmentDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { id, type } = route.params;
  const { tecnico } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<any>(null);

  const fetchDetail = async () => {
    try {
      if (type === 'mantenimiento') {
        const res = await MantenimientoService.getMantenimientoDetail(id);
        setItem(res);
      } else {
        const res = await CotizacionService.getCotizacionDetail(id);
        setItem(res);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron recuperar los detalles de la asignación.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    
    // Add listener to refresh detail when coming back from UpdateStatus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDetail();
    });
    return unsubscribe;
  }, [id, type]);

  if (loading) {
    return <Loader message="Cargando expediente técnico..." />;
  }

  if (!item) return null;

  // Determine timeline configuration
  let timelineSteps: string[] = [];
  let currentStepIndex = 0;

  if (type === 'mantenimiento') {
    timelineSteps = ['Recibido', 'Agendado', 'En Proceso', 'Resuelto'];
    const status = item.estado;
    if (status === 'recibido') currentStepIndex = 0;
    else if (status === 'visita_agendada') currentStepIndex = 1;
    else if (
      status === 'en_proceso' || 
      status === 'en_revision' || 
      status === 'diagnostico_remoto' || 
      status === 'esperando_repuestos'
    ) currentStepIndex = 2;
    else if (status === 'resuelto') currentStepIndex = 3;
  } else {
    timelineSteps = ['Recibido', 'Agendado', 'Instalación', 'Completado'];
    const status = item.estado;
    if (status === 'recibido' || status === 'en_revision') currentStepIndex = 0;
    else if (status === 'visita_agendada' || status === 'cotizado' || status === 'aceptado') currentStepIndex = 1;
    else if (status === 'instalacion_agendada' || status === 'en_instalacion') currentStepIndex = 2;
    else if (status === 'completado') currentStepIndex = 3;
  }

  // Quick Action triggers
  const activeVisit = item.visitas && item.visitas.length > 0 ? item.visitas[0] : null;
  const isCompleted = type === 'mantenimiento' 
    ? item.estado === 'resuelto' || item.estado === 'cancelado'
    : item.estado === 'completado' || item.estado === 'cancelado' || item.estado === 'rechazado';

  const handleCall = () => {
    if (item.telefono) {
      NativeLinking.callPhone(item.telefono);
    } else {
      Alert.alert('Info', 'El cliente no tiene teléfono registrado.');
    }
  };

  const handleWhatsApp = () => {
    if (item.telefono) {
      const technicianName = tecnico?.usuario.first_name || 'Técnico';
      const template = `Hola ${item.nombre_cliente}, le saluda ${technicianName} de GyG Puertas Automáticas. Estoy a cargo de su atención programada con código ${item.codigo}. Por favor, confírmeme si se encuentra en casa o local para proceder con la visita técnica.`;
      NativeLinking.openWhatsApp(item.telefono, template);
    } else {
      Alert.alert('Info', 'El cliente no tiene teléfono registrado.');
    }
  };

  const handleMaps = () => {
    if (item.direccion) {
      NativeLinking.openGoogleMaps(item.direccion, item.distrito);
    } else {
      Alert.alert('Info', 'No hay dirección especificada.');
    }
  };

  const handleUpdateStatus = () => {
    if (!activeVisit) {
      Alert.alert(
        'Sin Visita Asignada', 
        'No se puede actualizar el progreso porque no hay visitas asociadas a este registro. Póngase en contacto con el administrador.'
      );
      return;
    }
    
    navigation.navigate('UpdateStatus', {
      id: item.id,
      type: type,
      currentStatus: item.estado,
      visitaId: activeVisit.id
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={item.codigo} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Status indicator timeline header */}
        <View style={styles.statusSection}>
          <View style={styles.badgeRow}>
            <Text style={styles.sectionHeader}>Progreso del Trabajo</Text>
            <Badge status={item.estado} type={type} />
          </View>
          <StatusBar steps={timelineSteps} currentStepIndex={currentStepIndex} />
        </View>

        {/* Client & Fast Actions Contact */}
        <Card style={styles.card} hasBorder>
          <Text style={styles.cardTitle}>Datos de Contacto</Text>
          <Text style={styles.clientName}>{item.nombre_cliente}</Text>
          <Text style={styles.contactItem}>📧 {item.correo || 'Sin correo electrónico'}</Text>
          <Text style={styles.contactItem}>📞 {item.telefono || 'Sin teléfono celular'}</Text>
          <Text style={styles.contactItem}>📍 {item.distrito} - {item.direccion}</Text>
          {item.referencias ? (
            <Text style={styles.referenceItem}>🔍 Referencia: {item.referencias}</Text>
          ) : null}

          {/* Quick Linking Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              onPress={handleCall} 
              style={[styles.actionBtn, styles.callBtn]}
              accessibilityRole="button"
              accessibilityLabel="Llamar por teléfono al cliente"
            >
              <Text style={styles.actionBtnText}>📞 Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleWhatsApp} 
              style={[styles.actionBtn, styles.waBtn]}
              accessibilityRole="button"
              accessibilityLabel="Enviar mensaje por WhatsApp al cliente"
            >
              <Text style={styles.actionBtnText}>💬 WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleMaps} 
              style={[styles.actionBtn, styles.mapsBtn]}
              accessibilityRole="button"
              accessibilityLabel="Ver dirección en Google Maps"
            >
              <Text style={styles.actionBtnText}>🗺️ Maps</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Technical specs */}
        <Card style={styles.card} hasBorder>
          <Text style={styles.cardTitle}>Especificaciones Técnicas</Text>
          {type === 'mantenimiento' ? (
            <>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Tipo de Puerta:</Text>
                <Text style={styles.specValue}>{item.tipo_puerta || 'General'}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Clase Mantenimiento:</Text>
                <Text style={[styles.specValue, styles.highlightValue]}>
                  {item.tipo === 'preventivo' ? '⚙️ Preventivo' : item.tipo === 'correctivo' ? '🚨 Correctivo' : '🛡️ Garantía'}
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Disponibilidad Horaria:</Text>
                <Text style={styles.specValue}>{item.disponibilidad || 'Sin especificar'}</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.specHeader}>Descripción del Problema:</Text>
              <Text style={styles.descriptionText}>{item.descripcion_problema || 'No se detalló problema.'}</Text>
            </>
          ) : (
            <>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Tipo de Uso:</Text>
                <Text style={styles.specValue}>{item.tipo_uso || 'Residencial'}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Disponibilidad Horaria:</Text>
                <Text style={styles.specValue}>{item.disponibilidad || 'Sin especificar'}</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.specHeader}>Descripción de la Solicitud:</Text>
              <Text style={styles.descriptionText}>{item.descripcion || 'No se detalló solicitud.'}</Text>
            </>
          )}
        </Card>

        {/* Active Visit status & diagnostics */}
        <Card style={styles.card} hasBorder>
          <Text style={styles.cardTitle}>Detalles de la Visita Programada</Text>
          {activeVisit ? (
            <View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Fecha agendada:</Text>
                <Text style={styles.specValue}>📅 {activeVisit.fecha}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Hora programada:</Text>
                <Text style={styles.specValue}>⏰ {activeVisit.hora}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Estado Visita:</Text>
                <Text style={[styles.specValue, styles.visitStatus]}>
                  {activeVisit.estado === 'programada' ? '📅 Programada' : activeVisit.estado === 'completada' ? '✅ Completada' : activeVisit.estado === 'reprogramada' ? '🔄 Reprogramada' : '❌ Cancelada'}
                </Text>
              </View>

              {/* Read only diagnostic reports if complete */}
              {activeVisit.estado === 'completada' && (
                <View style={styles.diagnosticSection}>
                  <View style={styles.divider} />
                  <Text style={styles.diagnosticTitle}>Reporte Técnico Cargado</Text>
                  
                  {type === 'mantenimiento' ? (
                    <>
                      <Text style={styles.diagnosticLabel}>Diagnóstico:</Text>
                      <Text style={styles.diagnosticText}>{activeVisit.diagnostico || 'N/A'}</Text>
                      
                      <Text style={styles.diagnosticLabel}>Trabajos Realizados:</Text>
                      <Text style={styles.diagnosticText}>{activeVisit.trabajos_realizados || 'N/A'}</Text>

                      <Text style={styles.diagnosticLabel}>Repuestos Utilizados:</Text>
                      <Text style={styles.diagnosticText}>{activeVisit.repuestos_utilizados || 'N/A'}</Text>

                      <Text style={styles.diagnosticLabel}>Costo Total del Servicio:</Text>
                      <Text style={styles.costText}>S/ {activeVisit.costo_total || '0.00'}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.diagnosticLabel}>Medidas Técnicas Tomadas:</Text>
                      <Text style={styles.diagnosticText}>{activeVisit.medidas || 'N/A'}</Text>
                      
                      <Text style={styles.diagnosticLabel}>Dificultad de la Instalación:</Text>
                      <Text style={styles.diagnosticText}>{activeVisit.dificultad || 'N/A'}</Text>

                      <Text style={styles.diagnosticLabel}>Tiempo Estimado de Trabajo:</Text>
                      <Text style={styles.diagnosticText}>{activeVisit.tiempo_estimado || 'N/A'}</Text>

                      <Text style={styles.diagnosticLabel}>Observaciones de Visita:</Text>
                      <Text style={styles.diagnosticText}>{activeVisit.observaciones || 'N/A'}</Text>
                    </>
                  )}
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.noVisitText}>⚠️ No hay visitas programadas asignadas.</Text>
          )}
        </Card>

        {/* Haupt Action Button */}
        {!isCompleted ? (
          <TouchableOpacity 
            onPress={handleUpdateStatus} 
            style={styles.mainActionBtn}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Actualizar Estado del Servicio"
          >
            <Text style={styles.mainActionBtnText}>⚙️ Actualizar Estado / Reporte</Text>
          </TouchableOpacity>
        ) : (
          <Card style={styles.readOnlyBanner} hasBorder>
            <Text style={styles.readOnlyText}>📜 Servicio Finalizado (Solo Lectura)</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  scrollContent: {
    padding: LAYOUT.spacing.md,
  },
  statusSection: {
    marginBottom: LAYOUT.spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.xs,
  },
  sectionHeader: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
  },
  card: {
    padding: LAYOUT.spacing.md,
    marginVertical: LAYOUT.spacing.sm,
  },
  cardTitle: {
    fontSize: LAYOUT.typography.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    marginBottom: LAYOUT.spacing.md,
    fontFamily: 'System',
  },
  clientName: {
    fontSize: LAYOUT.typography.sizes.h2,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT.spacing.md,
    fontFamily: 'System',
  },
  contactItem: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    marginVertical: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  referenceItem: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    marginTop: LAYOUT.spacing.sm,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: LAYOUT.spacing.lg,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: LAYOUT.borderRadius.md,
    marginHorizontal: 4,
    ...LAYOUT.shadows.sm,
  },
  actionBtnText: {
    fontSize: LAYOUT.typography.sizes.small,
    fontWeight: 'bold',
    color: COLORS.BG_DARK,
    fontFamily: 'System',
  },
  callBtn: {
    backgroundColor: COLORS.PREVENTIVE_BLUE,
  },
  waBtn: {
    backgroundColor: COLORS.WHATSAPP_GREEN,
  },
  mapsBtn: {
    backgroundColor: COLORS.PRIMARY_GOLD,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: LAYOUT.spacing.sm,
  },
  specLabel: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    fontWeight: '600',
  },
  specValue: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
    fontWeight: '700',
  },
  highlightValue: {
    color: COLORS.PRIMARY_GOLD,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER_DARK,
    marginVertical: LAYOUT.spacing.md,
  },
  specHeader: {
    fontSize: LAYOUT.typography.sizes.body,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT.spacing.sm,
    fontFamily: 'System',
  },
  descriptionText: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: LAYOUT.typography.lineHeights.body,
    fontFamily: 'System',
  },
  visitStatus: {
    color: COLORS.PRIMARY_GOLD,
  },
  noVisitText: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.ERROR_RED,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: LAYOUT.spacing.md,
  },
  diagnosticSection: {
    marginTop: LAYOUT.spacing.xs,
  },
  diagnosticTitle: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    marginBottom: LAYOUT.spacing.sm,
    fontFamily: 'System',
  },
  diagnosticLabel: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: 'bold',
    marginTop: LAYOUT.spacing.sm,
    fontFamily: 'System',
  },
  diagnosticText: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: LAYOUT.typography.lineHeights.body,
    marginTop: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  costText: {
    fontSize: LAYOUT.typography.sizes.h2,
    fontWeight: '900',
    color: COLORS.WARRANTY_GREEN,
    marginTop: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  mainActionBtn: {
    height: 52,
    backgroundColor: COLORS.PRIMARY_GOLD,
    borderRadius: LAYOUT.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: LAYOUT.spacing.lg,
    ...LAYOUT.shadows.md,
  },
  mainActionBtnText: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.BG_DARK,
    fontFamily: 'System',
  },
  readOnlyBanner: {
    padding: LAYOUT.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.CARD_DARK,
    marginVertical: LAYOUT.spacing.lg,
  },
  readOnlyText: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
  },
});

export default AssignmentDetailScreen;
