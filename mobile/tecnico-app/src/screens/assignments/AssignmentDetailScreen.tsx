import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Image, ActivityIndicator,
  StatusBar as RNStatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import NativeLinking from '../../services/linking';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import StatusBar from '../../components/common/StatusBar';
import api from '../../api/config';

// ── Helpers ──────────────────────────────────────────────────────────────────

const SectionCard: React.FC<{ title: string; iconName: React.ComponentProps<typeof MaterialIcons>['name']; children: React.ReactNode }> = ({ title, iconName, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardIconWrap}>
        <MaterialIcons name={iconName} size={16} color={COLORS.PRIMARY_GOLD_DARK} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const InfoRow: React.FC<{ icon: React.ComponentProps<typeof MaterialIcons>['name']; iconColor?: string; text: string }> = ({ icon, iconColor = COLORS.TEXT_TERTIARY, text }) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={16} color={iconColor} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.specRow}>
    <Text style={styles.specLabel}>{label}</Text>
    <Text style={styles.specValue}>{value}</Text>
  </View>
);

// ── Componente principal ──────────────────────────────────────────────────────

export const AssignmentDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { id, type } = route.params;
  const { tecnico }  = useAuthStore();
  const [loading, setLoading]                   = useState(true);
  const [item, setItem]                         = useState<any>(null);
  const [subiendoFoto, setSubiendoFoto]         = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null);

  const fetchDetail = async () => {
    try {
      const res = type === 'mantenimiento'
        ? await MantenimientoService.getMantenimientoDetail(id)
        : await CotizacionService.getCotizacionDetail(id);
      setItem(res);
    } catch {
      Alert.alert('Error', 'No se pudieron recuperar los detalles.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    const unsub = navigation.addListener('focus', fetchDetail);
    return unsub;
  }, [id, type]);

  if (loading) return <Loader message="Cargando expediente técnico..." />;
  if (!item)   return null;

  // ── Timeline ────────────────────────────────────────────────────────────────
  let timelineSteps: string[] = [];
  let currentStepIndex = 0;

  if (type === 'mantenimiento') {
    timelineSteps = ['Recibido', 'Agendado', 'En proceso', 'Resuelto'];
    const s = item.estado;
    if (s === 'recibido') currentStepIndex = 0;
    else if (s === 'visita_agendada') currentStepIndex = 1;
    else if (['en_proceso','en_revision','diagnostico_remoto','esperando_repuestos'].includes(s)) currentStepIndex = 2;
    else if (s === 'resuelto') currentStepIndex = 3;
  } else {
    timelineSteps = ['Agendado', 'Medidas', 'Instalación', 'Completado'];
    const s = item.estado;
    if (s === 'visita_agendada') currentStepIndex = 0;
    else if (['cotizado','aceptado'].includes(s)) currentStepIndex = 1;
    else if (['instalacion_agendada','en_instalacion'].includes(s)) currentStepIndex = 2;
    else if (s === 'completado') currentStepIndex = 3;
  }

  const activeVisit = item.visitas?.[0] ?? null;
  const isCompleted = type === 'mantenimiento'
    ? ['resuelto','cancelado'].includes(item.estado)
    : ['completado','cancelado','rechazado'].includes(item.estado);

  const puedeSubirFotoCotizacion  = type === 'cotizacion' && ['instalacion_agendada','en_instalacion'].includes(item.estado);
  const puedeSubirFotoMantenimiento = type === 'mantenimiento' && item.estado === 'en_proceso' && activeVisit;
  const puedeActualizar = !isCompleted && activeVisit;

  // ── Acciones ─────────────────────────────────────────────────────────────────
  const handleCall = () => {
    if (item.telefono) NativeLinking.callPhone(item.telefono);
    else Alert.alert('Sin teléfono', 'El cliente no tiene teléfono registrado.');
  };
  const handleWhatsApp = () => {
    if (!item.telefono) { Alert.alert('Sin teléfono', 'El cliente no tiene teléfono registrado.'); return; }
    const name = tecnico?.usuario.first_name || 'Técnico';
    const msg  = `Hola ${item.nombre_cliente}, le saluda ${name} de GyG Puertas Automáticas. Estoy a cargo de su atención con código ${item.codigo}. Por favor, confírmeme si se encuentra disponible para proceder con la visita.`;
    NativeLinking.openWhatsApp(item.telefono, msg);
  };
  const handleMaps = () => {
    if (item.direccion) NativeLinking.openGoogleMaps(item.direccion, item.distrito);
    else Alert.alert('Sin dirección', 'No hay dirección especificada.');
  };
  const handleUpdateStatus = () => {
    if (!activeVisit) { Alert.alert('Sin visita asignada', 'No hay visitas asociadas. Contacte al administrador.'); return; }
    navigation.navigate('UpdateStatus', { id: item.id, type, currentStatus: item.estado, visitaId: activeVisit.id });
  };

  // ── Foto ─────────────────────────────────────────────────────────────────────
  const seleccionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Se necesita acceso a la galería.'); return; }
    Alert.alert('Seleccionar foto', '¿De dónde quieres obtener la foto?', [
      { text: 'Cámara', onPress: async () => {
          const cam = await ImagePicker.requestCameraPermissionsAsync();
          if (cam.status !== 'granted') { Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara.'); return; }
          const r = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
          if (!r.canceled && r.assets[0]) setFotoSeleccionada(r.assets[0].uri);
        }},
      { text: 'Galería', onPress: async () => {
          const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
          if (!r.canceled && r.assets[0]) setFotoSeleccionada(r.assets[0].uri);
        }},
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const confirmarYSubirFoto = (onConfirm: () => Promise<void>) => {
    Alert.alert('Confirmar', '¿Confirmas que el servicio está completo y deseas enviar la foto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar y enviar', onPress: onConfirm },
    ]);
  };

  const subirFotoInstalacion = () => confirmarYSubirFoto(async () => {
    if (!fotoSeleccionada || !activeVisit) return;
    setSubiendoFoto(true);
    try {
      const formData = new FormData();
      const filename = fotoSeleccionada.split('/').pop() || 'foto.jpg';
      const ext = (/\.(\w+)$/.exec(filename) || [])[1] || 'jpg';
      formData.append('foto_instalacion', { uri: fotoSeleccionada, name: `instalacion_${item.codigo}.${ext}`, type: `image/${ext}` } as any);
      await api.patch(`/visitas/${activeVisit.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await CotizacionService.updateCotizacionStatus(id, 'completado' as any);
      Alert.alert('¡Foto enviada!', 'El servicio quedará marcado como completado.', [{ text: 'Aceptar', onPress: () => { setFotoSeleccionada(null); fetchDetail(); } }]);
    } catch { Alert.alert('Error', 'No se pudo subir la foto.'); }
    finally   { setSubiendoFoto(false); }
  });

  const subirFotoMantenimiento = () => confirmarYSubirFoto(async () => {
    if (!fotoSeleccionada || !activeVisit) return;
    setSubiendoFoto(true);
    try {
      await MantenimientoService.subirFotoMantenimiento(activeVisit.id, fotoSeleccionada);
      await MantenimientoService.updateMantenimientoStatus(id, 'resuelto');
      Alert.alert('¡Foto enviada!', 'El mantenimiento quedará marcado como resuelto.', [{ text: 'Aceptar', onPress: () => { setFotoSeleccionada(null); fetchDetail(); } }]);
    } catch { Alert.alert('Error', 'No se pudo subir la foto.'); }
    finally   { setSubiendoFoto(false); }
  });

  // ── Render foto card ─────────────────────────────────────────────────────────
  const renderFotoCard = (titulo: string, desc: string, onSubir: () => void) => (
    <View style={styles.fotoCard}>
      <View style={styles.fotoHeader}>
        <View style={styles.fotoIconWrap}>
          <MaterialIcons name="camera-alt" size={18} color={COLORS.PRIMARY_GOLD_DARK} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.fotoTitulo}>{titulo}</Text>
          <Text style={styles.fotoDesc}>{desc}</Text>
        </View>
      </View>

      {fotoSeleccionada ? (
        <View style={styles.fotoPreviewWrap}>
          <Image source={{ uri: fotoSeleccionada }} style={styles.fotoPreview} />
          <TouchableOpacity onPress={seleccionarFoto} style={styles.cambiarFotoBtn}>
            <MaterialIcons name="refresh" size={14} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.cambiarFotoText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={seleccionarFoto} style={styles.fotoDropzone} activeOpacity={0.75}>
          <MaterialIcons name="add-a-photo" size={28} color={COLORS.PRIMARY_GOLD} />
          <Text style={styles.fotoDropzoneText}>Seleccionar o tomar foto</Text>
        </TouchableOpacity>
      )}

      {fotoSeleccionada && (
        <TouchableOpacity onPress={onSubir} disabled={subiendoFoto} style={[styles.subirFotoBtn, subiendoFoto && { opacity: 0.6 }]} activeOpacity={0.82}>
          {subiendoFoto
            ? <ActivityIndicator color={COLORS.WHITE} />
            : (<><MaterialIcons name="cloud-upload" size={20} color={COLORS.WHITE} /><Text style={styles.subirFotoText}>Enviar foto y completar</Text></>)
          }
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Tipo mantenimiento tag ────────────────────────────────────────────────────
  const mantTipoColor = item.tipo === 'preventivo' ? COLORS.PREVENTIVE_BLUE : item.tipo === 'correctivo' ? COLORS.CORRECTIVE_ORANGE : COLORS.SUCCESS;
  const mantTipoBg    = item.tipo === 'preventivo' ? COLORS.PREVENTIVE_BLUE_BG : item.tipo === 'correctivo' ? COLORS.CORRECTIVE_ORANGE_BG : COLORS.SUCCESS_BG;
  const mantTipoLabel = item.tipo === 'preventivo' ? 'Preventivo' : item.tipo === 'correctivo' ? 'Correctivo' : 'Garantía';

  // ── Visit status label ────────────────────────────────────────────────────────
  const visitaEstadoLabel = activeVisit
    ? { programada: 'Programada', completada: 'Completada', reprogramada: 'Reprogramada', cancelada: 'Cancelada' }[activeVisit.estado as string] ?? activeVisit.estado
    : '';

  return (
    <View style={styles.root}>
      <RNStatusBar barStyle="dark-content" backgroundColor={COLORS.BG_SURFACE} />
      <SafeAreaView style={styles.safe}>
        <Header title={item.codigo} onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Progreso ──────────────────────────────────────────────── */}
          <SectionCard title="Progreso del trabajo" iconName="timeline">
            <View style={styles.progressBadgeRow}>
              <Badge status={item.estado} type={type} />
            </View>
            <StatusBar steps={timelineSteps} currentStepIndex={currentStepIndex} />
          </SectionCard>

          {/* ── Banner confirmación instalación ───────────────────────── */}
          {type === 'cotizacion' && item.estado === 'instalacion_agendada' && (
            <View style={[styles.bannerCard, styles.bannerSuccess]}>
              <MaterialIcons name="check-circle" size={22} color={COLORS.SUCCESS} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.bannerTitle, { color: COLORS.SUCCESS }]}>¡El cliente aceptó la cotización!</Text>
                <Text style={styles.bannerDesc}>El administrador confirmó la instalación. Ve al domicilio, realiza la instalación y sube la foto al completar.</Text>
              </View>
            </View>
          )}

          {/* ── Banner confirmación mantenimiento ─────────────────────── */}
          {type === 'mantenimiento' && item.estado === 'en_proceso' && (
            <View style={[styles.bannerCard, styles.bannerSuccess]}>
              <MaterialIcons name="build" size={22} color={COLORS.SUCCESS} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.bannerTitle, { color: COLORS.SUCCESS }]}>¡El cliente aceptó el mantenimiento!</Text>
                <Text style={styles.bannerDesc}>Ve al domicilio, realiza el trabajo y sube una foto al completar.</Text>
              </View>
            </View>
          )}

          {/* ── Datos de contacto ─────────────────────────────────────── */}
          <SectionCard title="Datos de contacto" iconName="person">
            <Text style={styles.clientName}>{item.nombre_cliente}</Text>

            <InfoRow icon="email"       text={item.correo    || 'Sin correo'} />
            <InfoRow icon="phone"       text={item.telefono  || 'Sin teléfono'} />
            <InfoRow icon="location-on" text={`${item.distrito} — ${item.direccion}`} />

            {item.referencias && (
              <View style={styles.referenceBox}>
                <MaterialIcons name="info-outline" size={14} color={COLORS.PRIMARY_GOLD_DARK} />
                <Text style={styles.referenceText}>Referencia: {item.referencias}</Text>
              </View>
            )}

            {/* Botones de acción */}
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={handleCall} style={styles.actionBtn} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: COLORS.INFO_BG }]}>
                  <MaterialIcons name="phone" size={18} color={COLORS.INFO} />
                </View>
                <Text style={styles.actionLabel}>Llamar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleWhatsApp} style={styles.actionBtn} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: COLORS.SUCCESS_BG }]}>
                  <MaterialIcons name="chat" size={18} color={COLORS.SUCCESS} />
                </View>
                <Text style={styles.actionLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleMaps} style={styles.actionBtn} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: COLORS.WARNING_BG }]}>
                  <MaterialIcons name="map" size={18} color={COLORS.PRIMARY_GOLD_DARK} />
                </View>
                <Text style={styles.actionLabel}>Mapa</Text>
              </TouchableOpacity>
            </View>
          </SectionCard>

          {/* ── Especificaciones técnicas ──────────────────────────────── */}
          <SectionCard title="Especificaciones técnicas" iconName="settings">
            {type === 'mantenimiento' ? (
              <>
                <SpecRow label="Tipo de puerta"        value={item.tipo_puerta || 'General'} />
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Clase mantenimiento</Text>
                  <View style={[styles.tipoTag, { backgroundColor: mantTipoBg }]}>
                    <MaterialIcons name={item.tipo === 'preventivo' ? 'build' : item.tipo === 'correctivo' ? 'warning' : 'verified'} size={13} color={mantTipoColor} />
                    <Text style={[styles.tipoTagText, { color: mantTipoColor }]}>{mantTipoLabel}</Text>
                  </View>
                </View>
                <SpecRow label="Disponibilidad" value={item.disponibilidad || 'Sin especificar'} />
                <View style={styles.divider} />
                <Text style={styles.subSectionLabel}>Descripción del problema</Text>
                <Text style={styles.descText}>{item.descripcion_problema || 'No se detalló problema.'}</Text>
              </>
            ) : (
              <>
                <SpecRow label="Tipo de uso"    value={item.tipo_uso      || 'Residencial'} />
                <SpecRow label="Disponibilidad" value={item.disponibilidad || 'Sin especificar'} />
                <View style={styles.divider} />
                <Text style={styles.subSectionLabel}>Descripción</Text>
                <Text style={styles.descText}>{item.descripcion || 'No se detalló solicitud.'}</Text>
              </>
            )}
          </SectionCard>

          {/* ── Detalles de la visita ─────────────────────────────────── */}
          <SectionCard title="Detalles de la visita" iconName="event">
            {activeVisit ? (
              <>
                <View style={styles.visitRow}>
                  <View style={[styles.visitIconWrap, { backgroundColor: COLORS.WARNING_BG }]}>
                    <MaterialIcons name="event" size={16} color={COLORS.PRIMARY_GOLD_DARK} />
                  </View>
                  <View>
                    <Text style={styles.visitLabel}>Fecha agendada</Text>
                    <Text style={styles.visitValue}>{activeVisit.fecha}</Text>
                  </View>
                </View>

                <View style={styles.visitRow}>
                  <View style={[styles.visitIconWrap, { backgroundColor: COLORS.WARNING_BG }]}>
                    <MaterialIcons name="access-time" size={16} color={COLORS.PRIMARY_GOLD_DARK} />
                  </View>
                  <View>
                    <Text style={styles.visitLabel}>Hora programada</Text>
                    <Text style={styles.visitValue}>{activeVisit.hora}</Text>
                  </View>
                </View>

                <View style={styles.visitRow}>
                  <View style={[styles.visitIconWrap, { backgroundColor: COLORS.SUCCESS_BG }]}>
                    <MaterialIcons name="check-circle" size={16} color={COLORS.SUCCESS} />
                  </View>
                  <View>
                    <Text style={styles.visitLabel}>Estado visita</Text>
                    <Text style={styles.visitValue}>{visitaEstadoLabel}</Text>
                  </View>
                </View>

                {/* Reporte técnico si visita completada */}
                {activeVisit.estado === 'completada' && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.subSectionLabel}>Reporte técnico</Text>

                    {type === 'mantenimiento' ? (
                      <>
                        <ReporteItem label="Diagnóstico"          value={activeVisit.diagnostico} />
                        <ReporteItem label="Trabajos realizados"  value={activeVisit.trabajos_realizados} />
                        <ReporteItem label="Repuestos utilizados" value={activeVisit.repuestos_utilizados} />
                        <View style={styles.costoRow}>
                          <Text style={styles.costoLabel}>Costo total</Text>
                          <Text style={styles.costoValue}>S/ {activeVisit.costo_total || '0.00'}</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <ReporteItem label="Medidas técnicas"      value={activeVisit.medidas} />
                        <ReporteItem label="Materiales necesarios" value={activeVisit.materiales_necesarios} />
                        <ReporteItem label="Dificultad"            value={activeVisit.dificultad} />
                        <ReporteItem label="Tiempo estimado"       value={activeVisit.tiempo_estimado} />
                        <ReporteItem label="Observaciones"         value={activeVisit.observaciones} />
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <View style={styles.noVisitBox}>
                <View style={[styles.noVisitIconWrap]}>
                  <MaterialIcons name="event-busy" size={26} color={COLORS.ERROR_RED} />
                </View>
                <Text style={styles.noVisitText}>No hay visitas programadas</Text>
                <Text style={styles.noVisitSub}>Contacte al administrador para asignar una visita</Text>
              </View>
            )}
          </SectionCard>

          {/* ── Foto instalación / mantenimiento ─────────────────────── */}
          {puedeSubirFotoCotizacion && renderFotoCard(
            'Foto de instalación completada',
            'Una vez terminada la instalación, toma una foto y envíala al administrador para cerrar el servicio.',
            subirFotoInstalacion
          )}
          {puedeSubirFotoMantenimiento && renderFotoCard(
            'Foto del mantenimiento realizado',
            'Toma una foto del mantenimiento completado y envíala al administrador para cerrar el servicio.',
            subirFotoMantenimiento
          )}

          {/* ── Botones de acción principal ───────────────────────────── */}
          {type === 'cotizacion' && item.estado === 'visita_agendada' && activeVisit && (
            <TouchableOpacity onPress={handleUpdateStatus} style={styles.primaryBtn} activeOpacity={0.82}>
              <MaterialIcons name="straighten" size={20} color={COLORS.WHITE} />
              <Text style={styles.primaryBtnText}>Registrar medidas y materiales</Text>
            </TouchableOpacity>
          )}

          {type === 'mantenimiento' && puedeActualizar && !puedeSubirFotoMantenimiento && (
            <TouchableOpacity onPress={handleUpdateStatus} style={styles.primaryBtn} activeOpacity={0.82}>
              <MaterialIcons name="update" size={20} color={COLORS.WHITE} />
              <Text style={styles.primaryBtnText}>Actualizar estado / reporte</Text>
            </TouchableOpacity>
          )}

          {isCompleted && (
            <View style={styles.completedBanner}>
              <MaterialIcons name="lock" size={18} color={COLORS.TEXT_TERTIARY} />
              <Text style={styles.completedText}>Servicio finalizado — Solo lectura</Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ── Helper interno ────────────────────────────────────────────────────────────
const ReporteItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <View style={styles.reporteItem}>
    <Text style={styles.reporteLabel}>{label}</Text>
    <Text style={styles.reporteText}>{value || 'N/A'}</Text>
  </View>
);

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG_BASE },
  safe: { flex: 1 },
  scroll: { padding: 14, paddingTop: 12 },

  // ── Cards ────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.BG_SURFACE,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14,
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER_SUBTLE,
  },
  cardIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
    justifyContent: 'center', alignItems: 'center',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.TEXT_PRIMARY, letterSpacing: 0.2 },

  // ── Progreso ─────────────────────────────────────────────────────────────
  progressBadgeRow: { alignItems: 'flex-start', marginBottom: 12 },

  // ── Banners ──────────────────────────────────────────────────────────────
  bannerCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    borderRadius: 14, padding: 14, marginBottom: 12,
    borderWidth: 1,
  },
  bannerSuccess: {
    backgroundColor: COLORS.SUCCESS_BG,
    borderColor: COLORS.SUCCESS_BORDER,
  },
  bannerTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  bannerDesc:  { fontSize: 12, color: COLORS.TEXT_SECONDARY, lineHeight: 17 },

  // ── Contacto ─────────────────────────────────────────────────────────────
  clientName: { fontSize: 19, fontWeight: '800', color: COLORS.TEXT_PRIMARY, marginBottom: 12 },
  infoRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  infoText:   { fontSize: 13, color: COLORS.TEXT_SECONDARY, flex: 1, fontWeight: '500' },
  referenceBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderRadius: 10, padding: 10, marginTop: 8,
    borderLeftWidth: 3, borderLeftColor: COLORS.PRIMARY_GOLD,
  },
  referenceText: { fontSize: 12, color: COLORS.TEXT_SECONDARY, flex: 1, fontStyle: 'italic', lineHeight: 17 },

  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  actionBtn:  { flex: 1, alignItems: 'center', gap: 6 },
  actionIcon: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  actionLabel: { fontSize: 11, fontWeight: '600', color: COLORS.TEXT_SECONDARY },

  // ── Specs ────────────────────────────────────────────────────────────────
  specRow:   { marginBottom: 10 },
  specLabel: { fontSize: 12, color: COLORS.TEXT_TERTIARY, fontWeight: '600', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3 },
  specValue: { fontSize: 14, color: COLORS.TEXT_PRIMARY, fontWeight: '600' },
  tipoTag:   { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  tipoTagText: { fontSize: 12, fontWeight: '700' },
  divider:   { height: 1, backgroundColor: COLORS.BORDER_SUBTLE, marginVertical: 14 },
  subSectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
  descText:  { fontSize: 13, color: COLORS.TEXT_SECONDARY, lineHeight: 20 },

  // ── Visita ───────────────────────────────────────────────────────────────
  visitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  visitIconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  visitLabel: { fontSize: 11, color: COLORS.TEXT_TERTIARY, fontWeight: '500', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.3 },
  visitValue: { fontSize: 14, color: COLORS.TEXT_PRIMARY, fontWeight: '700' },
  noVisitBox: { alignItems: 'center', paddingVertical: 24 },
  noVisitIconWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.ERROR_BG, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  noVisitText: { fontSize: 14, color: COLORS.ERROR_RED, fontWeight: '700', marginBottom: 4 },
  noVisitSub:  { fontSize: 12, color: COLORS.TEXT_TERTIARY, textAlign: 'center' },

  // ── Reporte ──────────────────────────────────────────────────────────────
  reporteItem:  { marginBottom: 12 },
  reporteLabel: { fontSize: 11, color: COLORS.TEXT_TERTIARY, fontWeight: '600', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3 },
  reporteText:  { fontSize: 13, color: COLORS.TEXT_PRIMARY, lineHeight: 19 },
  costoRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.SUCCESS_BG, padding: 14, borderRadius: 12, marginTop: 4 },
  costoLabel:   { fontSize: 13, color: COLORS.TEXT_SECONDARY, fontWeight: '600' },
  costoValue:   { fontSize: 22, fontWeight: '900', color: COLORS.SUCCESS },

  // ── Foto card ────────────────────────────────────────────────────────────
  fotoCard: {
    backgroundColor: COLORS.BG_SURFACE,
    borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
    shadowColor: COLORS.PRIMARY_GOLD,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  fotoHeader:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  fotoIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.PRIMARY_GOLD_MUTED, borderWidth: 1, borderColor: COLORS.BORDER_GOLD, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  fotoTitulo:   { fontSize: 14, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 3 },
  fotoDesc:     { fontSize: 12, color: COLORS.TEXT_SECONDARY, lineHeight: 17 },
  fotoDropzone: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.BORDER_GOLD_STRONG,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 28, gap: 8, marginBottom: 12,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
  },
  fotoDropzoneText: { fontSize: 13, color: COLORS.PRIMARY_GOLD_DARK, fontWeight: '600' },
  fotoPreviewWrap:  { marginBottom: 12 },
  fotoPreview:      { width: '100%', height: 200, borderRadius: 12, marginBottom: 8 },
  cambiarFotoBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  cambiarFotoText:  { fontSize: 12, color: COLORS.TEXT_SECONDARY, textDecorationLine: 'underline' },
  subirFotoBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.PRIMARY_GOLD, paddingVertical: 14, borderRadius: 14 },
  subirFotoText:    { fontSize: 15, fontWeight: '700', color: COLORS.WHITE },

  // ── Botón principal ──────────────────────────────────────────────────────
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.PRIMARY_GOLD,
    paddingVertical: 16, borderRadius: 16, marginBottom: 12,
    shadowColor: COLORS.PRIMARY_GOLD,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.WHITE },

  // ── Completado ───────────────────────────────────────────────────────────
  completedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.BG_ELEVATED,
    paddingVertical: 14, borderRadius: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.BORDER_DARK,
  },
  completedText: { fontSize: 13, fontWeight: '600', color: COLORS.TEXT_TERTIARY },
});

export default AssignmentDetailScreen;