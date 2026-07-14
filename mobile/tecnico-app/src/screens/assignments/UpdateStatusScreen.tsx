import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  Switch, Alert, KeyboardAvoidingView, Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// ── Helpers ──────────────────────────────────────────────────────────────────

const SectionCard: React.FC<{
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  desc?: string;
  children: React.ReactNode;
}> = ({ iconName, title, desc, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardIconWrap}>
        <MaterialIcons name={iconName} size={16} color={COLORS.PRIMARY_GOLD_DARK} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        {desc && <Text style={styles.cardDesc}>{desc}</Text>}
      </View>
    </View>
    {children}
  </View>
);

// ── Pantalla principal ────────────────────────────────────────────────────────

export const UpdateStatusScreen: React.FC<any> = ({ route, navigation }) => {
  const { id, type, currentStatus, visitaId } = route.params;
  const [submitting, setSubmitting]     = useState(false);
  const [showForm, setShowForm]         = useState(false);

  // Mantenimiento
  const [diagnostico, setDiagnostico]           = useState('');
  const [trabajosRealizados, setTrabajosRealizados] = useState('');
  const [repuestosUtilizados, setRepuestosUtilizados] = useState('');
  const [costoTotal, setCostoTotal]             = useState('0');
  const [firmaMant, setFirmaMant]               = useState(false);

  // Cotizacion
  const [medidas, setMedidas]                       = useState('');
  const [materialesNecesarios, setMaterialesNecesarios] = useState('');
  const [dificultad, setDificultad]                 = useState('Media');
  const [tiempoEstimado, setTiempoEstimado]         = useState('');
  const [observaciones, setObservaciones]           = useState('');
  const [firmaCot, setFirmaCot]                     = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Validación ──────────────────────────────────────────────────────────────
  const validateForm = () => {
    const e: Record<string, string> = {};
    if (type === 'mantenimiento') {
      if (!diagnostico.trim())       e.diagnostico        = 'El diagnóstico es obligatorio.';
      if (!trabajosRealizados.trim()) e.trabajosRealizados = 'El detalle de trabajos es obligatorio.';
      if (isNaN(Number(costoTotal)) || Number(costoTotal) < 0) e.costoTotal = 'Ingrese un costo numérico válido.';
      if (!firmaMant) e.firmaMant = 'Debe declarar conformidad física del cliente.';
    } else {
      if (!medidas.trim())             e.medidas             = 'Las medidas técnicas son obligatorias.';
      if (!materialesNecesarios.trim()) e.materialesNecesarios = 'Los materiales necesarios son obligatorios.';
      if (!tiempoEstimado.trim())      e.tiempoEstimado      = 'El tiempo estimado es obligatorio.';
      if (!firmaCot) e.firmaCot = 'Debe declarar conformidad del cliente.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Acciones ────────────────────────────────────────────────────────────────
  const handleUpdateToInProgress = async () => {
    const nextStatus = type === 'mantenimiento' ? 'en_proceso' : 'en_instalacion';
    setSubmitting(true);
    try {
      if (type === 'mantenimiento') {
        await MantenimientoService.updateMantenimientoStatus(id, nextStatus);
      } else {
        await CotizacionService.updateCotizacionStatus(id, nextStatus as any);
      }
      Alert.alert(
        'Estado actualizado',
        `El servicio está ahora en ${type === 'mantenimiento' ? 'proceso' : 'instalación'}.`,
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado del servicio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteService = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (type === 'mantenimiento') {
        await MantenimientoService.updateVisitaMantenimiento(visitaId, {
          estado: 'completada',
          diagnostico: diagnostico.trim(),
          trabajos_realizados: trabajosRealizados.trim(),
          repuestos_utilizados: repuestosUtilizados.trim(),
          costo_total: Number(costoTotal),
        });
        await MantenimientoService.updateMantenimientoStatus(id, 'resuelto');
      } else {
        await CotizacionService.updateVisitaTecnica(visitaId, {
          estado: 'completada',
          medidas: medidas.trim(),
          materiales_necesarios: materialesNecesarios.trim(),
          observaciones: observaciones.trim(),
          dificultad: dificultad.trim(),
          tiempo_estimado: tiempoEstimado.trim(),
        });
      }
      Alert.alert(
        type === 'mantenimiento' ? 'Reporte guardado' : 'Medidas registradas',
        type === 'mantenimiento'
          ? 'El diagnóstico fue enviado al administrador y el servicio quedó resuelto.'
          : 'Las medidas y materiales fueron guardados. El administrador preparará la cotización formal.',
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    } catch {
      Alert.alert('Error', 'No se pudo guardar el reporte técnico.');
    } finally {
      setSubmitting(false);
    }
  };

  const canStartProgress = !['en_proceso', 'en_instalacion'].includes(currentStatus);
  const isMant = type === 'mantenimiento';

  return (
    <View style={styles.root}>
      <RNStatusBar barStyle="dark-content" backgroundColor={COLORS.BG_SURFACE} />
      <SafeAreaView style={styles.safe}>
        <Header title="Actualizar servicio" onBack={() => navigation.goBack()} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Estado actual ────────────────────────────────────────── */}
            <View style={styles.statusRow}>
              <View style={styles.statusLeft}>
                <Text style={styles.statusLbl}>Estado actual</Text>
                <Text style={styles.statusVal}>{currentStatus.replace(/_/g, ' ').toUpperCase()}</Text>
              </View>
              <View style={styles.statusIconWrap}>
                <MaterialIcons name="update" size={22} color={COLORS.PRIMARY_GOLD_DARK} />
              </View>
            </View>

            {/* ── Vista: selección de acción ───────────────────────────── */}
            {!showForm ? (
              <SectionCard
                iconName="trending-up"
                title="Acciones de progreso"
                desc="Seleccione la siguiente etapa en el flujo de trabajo"
              >
                {/* Iniciar */}
                {canStartProgress && (
                  <View style={styles.actionItem}>
                    <View style={styles.actionTop}>
                      <View style={[styles.actionIconWrap, { backgroundColor: COLORS.INFO_BG }]}>
                        <MaterialIcons
                          name={isMant ? 'build' : 'construction'}
                          size={18}
                          color={COLORS.INFO}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.actionTitle}>
                          {isMant ? 'Iniciar mantenimiento' : 'Iniciar instalación'}
                        </Text>
                        <Text style={styles.actionSubtitle}>
                          Cambia el estado a {isMant ? '"En proceso"' : '"En instalación"'}
                        </Text>
                      </View>
                    </View>
                    <Button
                      title="Iniciar"
                      onPress={handleUpdateToInProgress}
                      loading={submitting}
                      style={styles.actionBtn}
                    />
                  </View>
                )}

                {/* Completar */}
                <View style={[styles.actionItem, { marginBottom: 0 }]}>
                  <View style={styles.actionTop}>
                    <View style={[styles.actionIconWrap, { backgroundColor: COLORS.SUCCESS_BG }]}>
                      <MaterialIcons name="assignment-turned-in" size={18} color={COLORS.SUCCESS} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.actionTitle}>
                        {isMant ? 'Finalizar y cargar diagnóstico' : 'Registrar medidas y materiales'}
                      </Text>
                      <Text style={styles.actionSubtitle}>
                        {isMant
                          ? 'Completa el reporte técnico del servicio'
                          : 'Registra las medidas para preparar la cotización'}
                      </Text>
                    </View>
                  </View>
                  <Button
                    title="Completar"
                    onPress={() => setShowForm(true)}
                    variant="outline"
                    style={[styles.actionBtn, { borderColor: COLORS.SUCCESS_BORDER }]}
                    textStyle={{ color: COLORS.SUCCESS }}
                  />
                </View>
              </SectionCard>
            ) : (

              /* ── Vista: formulario ────────────────────────────────────── */
              <SectionCard
                iconName="description"
                title="Reporte técnico final"
                desc="Complete el expediente. Será visible para el administrador en el panel."
              >
                {isMant ? (
                  <>
                    <Input
                      label="Diagnóstico del problema *"
                      placeholder="Describa el diagnóstico encontrado..."
                      value={diagnostico}
                      onChangeText={setDiagnostico}
                      error={errors.diagnostico}
                      multiline
                      numberOfLines={4}
                      style={styles.textArea}
                    />
                    <Input
                      label="Trabajos realizados *"
                      placeholder="Detalle las reparaciones, calibraciones..."
                      value={trabajosRealizados}
                      onChangeText={setTrabajosRealizados}
                      error={errors.trabajosRealizados}
                      multiline
                      numberOfLines={4}
                      style={styles.textArea}
                    />
                    <Input
                      label="Repuestos utilizados"
                      placeholder="Ej. Resorte de torsión 2'', Cremallera..."
                      value={repuestosUtilizados}
                      onChangeText={setRepuestosUtilizados}
                      multiline
                      numberOfLines={2}
                      style={styles.textArea}
                    />
                    <Input
                      label="Costo adicional (S/)"
                      placeholder="Ingrese costo o 0 si está incluido"
                      value={costoTotal}
                      onChangeText={setCostoTotal}
                      error={errors.costoTotal}
                      keyboardType="numeric"
                    />
                    <ConformidadSwitch
                      checked={firmaMant}
                      onChange={setFirmaMant}
                      desc="Declaro que el cliente firmó conformidad física o digital en el sitio"
                      error={errors.firmaMant}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Medidas técnicas *"
                      placeholder="Ej: Ancho: 3.50m, Alto: 2.40m, Cabezal: 30cm..."
                      value={medidas}
                      onChangeText={setMedidas}
                      error={errors.medidas}
                      multiline
                      numberOfLines={3}
                      style={styles.textArea}
                    />
                    <Input
                      label="Materiales necesarios *"
                      placeholder="Ej: Motor CAME 1HP, Riel 4m, Control remoto x2..."
                      value={materialesNecesarios}
                      onChangeText={setMaterialesNecesarios}
                      error={errors.materialesNecesarios}
                      multiline
                      numberOfLines={4}
                      style={styles.textArea}
                    />
                    <Input
                      label="Grado de dificultad"
                      placeholder="Baja / Media / Alta"
                      value={dificultad}
                      onChangeText={setDificultad}
                    />
                    <Input
                      label="Tiempo estimado de instalación *"
                      placeholder="Ej. 1 día (4 horas)"
                      value={tiempoEstimado}
                      onChangeText={setTiempoEstimado}
                      error={errors.tiempoEstimado}
                    />
                    <Input
                      label="Observaciones adicionales"
                      placeholder="Detalles adicionales, condiciones del lugar..."
                      value={observaciones}
                      onChangeText={setObservaciones}
                      multiline
                      numberOfLines={3}
                      style={styles.textArea}
                    />
                    <ConformidadSwitch
                      checked={firmaCot}
                      onChange={setFirmaCot}
                      desc="Declaro que el cliente aprobó las medidas y materiales tomados"
                      error={errors.firmaCot}
                    />
                  </>
                )}

                {/* Botones */}
                <View style={styles.formBtns}>
                  <Button
                    title="Cancelar"
                    onPress={() => setShowForm(false)}
                    variant="secondary"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Guardar reporte"
                    onPress={handleCompleteService}
                    loading={submitting}
                    style={{ flex: 1 }}
                  />
                </View>
              </SectionCard>
            )}

            <View style={{ height: 32 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// ── Switch de conformidad ─────────────────────────────────────────────────────
const ConformidadSwitch: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  desc: string;
  error?: string;
}> = ({ checked, onChange, desc, error }) => (
  <View style={styles.switchCard}>
    <View style={styles.switchHeader}>
      <View style={[styles.actionIconWrap, { backgroundColor: COLORS.PRIMARY_GOLD_MUTED }]}>
        <MaterialIcons name="verified" size={16} color={COLORS.PRIMARY_GOLD_DARK} />
      </View>
      <Text style={styles.switchLabel}>Firma de conformidad</Text>
    </View>
    <Text style={styles.switchDesc}>{desc}</Text>
    <View style={styles.switchRow}>
      <Text style={[styles.switchStatus, checked && styles.switchStatusOn]}>
        {checked ? 'Confirmado ✓' : 'Pendiente'}
      </Text>
      <Switch
        value={checked}
        onValueChange={onChange}
        trackColor={{ false: COLORS.BORDER_MEDIUM, true: COLORS.SUCCESS_BORDER }}
        thumbColor={checked ? COLORS.SUCCESS : COLORS.TEXT_TERTIARY}
      />
    </View>
    {error && (
      <View style={styles.switchError}>
        <MaterialIcons name="error-outline" size={13} color={COLORS.ERROR_RED} />
        <Text style={styles.switchErrorText}>{error}</Text>
      </View>
    )}
  </View>
);

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG_BASE },
  safe: { flex: 1 },
  scroll: { padding: 14, paddingTop: 12, flexGrow: 1 },

  // ── Estado actual ─────────────────────────────────────────────────────────
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BG_SURFACE,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GOLD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statusLeft: { flex: 1 },
  statusLbl: { fontSize: 11, color: COLORS.TEXT_TERTIARY, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  statusVal: { fontSize: 15, color: COLORS.PRIMARY_GOLD_DARK, fontWeight: '800', letterSpacing: 0.5 },
  statusIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Card contenedor ───────────────────────────────────────────────────────
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_SUBTLE,
  },
  cardIconWrap: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 3 },
  cardDesc:  { fontSize: 12, color: COLORS.TEXT_SECONDARY, lineHeight: 17 },

  // ── Action items ──────────────────────────────────────────────────────────
  actionItem: {
    backgroundColor: COLORS.BG_ELEVATED,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  actionTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  actionIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  actionTitle:    { fontSize: 14, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 3 },
  actionSubtitle: { fontSize: 11, color: COLORS.TEXT_SECONDARY, lineHeight: 16 },
  actionBtn:      { marginTop: 0 },

  // ── Textarea ──────────────────────────────────────────────────────────────
  textArea: { minHeight: 90, textAlignVertical: 'top' },

  // ── Switch conformidad ────────────────────────────────────────────────────
  switchCard: {
    backgroundColor: COLORS.BG_ELEVATED,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_GOLD,
  },
  switchHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  switchLabel:  { fontSize: 14, fontWeight: '700', color: COLORS.TEXT_PRIMARY },
  switchDesc:   { fontSize: 12, color: COLORS.TEXT_SECONDARY, lineHeight: 18, marginBottom: 12 },
  switchRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchStatus:    { fontSize: 13, color: COLORS.TEXT_TERTIARY, fontWeight: '600' },
  switchStatusOn:  { color: COLORS.SUCCESS },
  switchError:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  switchErrorText: { fontSize: 12, color: COLORS.ERROR_RED, fontWeight: '500' },

  // ── Botones formulario ────────────────────────────────────────────────────
  formBtns: { flexDirection: 'row', gap: 10, marginTop: 20 },
});

export default UpdateStatusScreen;