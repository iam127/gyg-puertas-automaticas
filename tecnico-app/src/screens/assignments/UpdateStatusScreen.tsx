import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Switch, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const UpdateStatusScreen: React.FC<any> = ({ route, navigation }) => {
  const { id, type, currentStatus, visitaId } = route.params;
  const [submitting, setSubmitting] = useState(false);

  // Status transitions state
  const [targetStatus, setTargetStatus] = useState<string>('');

  // Maintenance Form State
  const [diagnostico, setDiagnostico] = useState('');
  const [trabajosRealizados, setTrabajosRealizados] = useState('');
  const [repuestosUtilizados, setRepuestosUtilizados] = useState('');
  const [costoTotal, setCostoTotal] = useState('0');
  const [firmaMant, setFirmaMant] = useState(false);

  // Cotizacion Form State
  const [medidas, setMedidas] = useState('');
  const [dificultad, setDificultad] = useState('Media');
  const [tiempoEstimado, setTiempoEstimado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [firmaCot, setFirmaCot] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    let isValid = true;

    if (type === 'mantenimiento') {
      if (!diagnostico.trim()) {
        tempErrors.diagnostico = 'El diagnóstico es obligatorio.';
        isValid = false;
      }
      if (!trabajosRealizados.trim()) {
        tempErrors.trabajosRealizados = 'El detalle de trabajos es obligatorio.';
        isValid = false;
      }
      if (isNaN(Number(costoTotal)) || Number(costoTotal) < 0) {
        tempErrors.costoTotal = 'Ingrese un costo numérico válido.';
        isValid = false;
      }
      if (!firmaMant) {
        tempErrors.firmaMant = 'Debe declarar conformidad física del cliente.';
        isValid = false;
      }
    } else {
      if (!medidas.trim()) {
        tempErrors.medidas = 'El registro de medidas técnicas es obligatorio.';
        isValid = false;
      }
      if (!tiempoEstimado.trim()) {
        tempErrors.tiempoEstimado = 'El tiempo estimado es obligatorio.';
        isValid = false;
      }
      if (!firmaCot) {
        tempErrors.firmaCot = 'Debe declarar conformidad del cliente.';
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleUpdateToInProgress = async () => {
    const nextStatus = type === 'mantenimiento' ? 'en_proceso' : 'en_instalacion';
    
    setSubmitting(true);
    try {
      if (type === 'mantenimiento') {
        await MantenimientoService.updateMantenimientoStatus(id, nextStatus);
      } else {
        await CotizacionService.updateCotizacionStatus(id, nextStatus as any);
      }
      Alert.alert('Estado Actualizado', `El servicio se encuentra ahora en ${type === 'mantenimiento' ? 'Proceso' : 'Instalación'}.`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del servicio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteService = async () => {
    if (!validateForm()) return;

    const nextGlobalStatus = type === 'mantenimiento' ? 'resuelto' : 'completado';
    setSubmitting(true);

    try {
      if (type === 'mantenimiento') {
        // 1. Double Patch: Visit detail
        await MantenimientoService.updateVisitaMantenimiento(visitaId, {
          estado: 'completada',
          diagnostico: diagnostico.trim(),
          trabajos_realizados: trabajosRealizados.trim(),
          repuestos_utilizados: repuestosUtilizados.trim(),
          costo_total: Number(costoTotal),
        });

        // 2. Double Patch: Global maintenance status
        await MantenimientoService.updateMantenimientoStatus(id, nextGlobalStatus);

      } else {
        // 1. Double Patch: Visit detail
        await CotizacionService.updateVisitaTecnica(visitaId, {
          estado: 'completada',
          medidas: medidas.trim(),
          observaciones: observaciones.trim(),
          dificultad: dificultad.trim(),
          tiempo_estimado: tiempoEstimado.trim(),
        });

        // 2. Double Patch: Global cotizacion status
        await CotizacionService.updateCotizacionStatus(id, nextGlobalStatus as any);
      }

      Alert.alert(
        'Servicio Completado', 
        'El reporte técnico fue cargado correctamente y el cliente ha sido notificado.',
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo reportar el cierre del servicio técnico.');
    } finally {
      setSubmitting(false);
    }
  };

  const showForm = targetStatus === 'complete';

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Actualizar Servicio" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.screenLabel}>Estado actual: <Text style={styles.highlightText}>{currentStatus.toUpperCase()}</Text></Text>
          
          {!showForm ? (
            <View style={styles.actionMenu}>
              <Text style={styles.sectionTitle}>Acciones Rápidas de Progreso</Text>
              <Text style={styles.sectionDesc}>Seleccione la siguiente etapa en el flujo de trabajo:</Text>

              {/* Progress to In Progress state if not done */}
              {currentStatus !== 'en_proceso' && currentStatus !== 'en_instalacion' && (
                <Button
                  title={type === 'mantenimiento' ? '🔧 Iniciar Mantenimiento (En Proceso)' : '📐 Iniciar Instalación'}
                  onPress={handleUpdateToInProgress}
                  loading={submitting}
                  style={styles.actionBtn}
                />
              )}

              {/* Transition to Complete Report Form */}
              <Button
                title={type === 'mantenimiento' ? '✅ Finalizar y Cargar Diagnóstico' : '📋 Cargar Medidas Técnicas'}
                onPress={() => setTargetStatus('complete')}
                variant="outline"
                style={[styles.actionBtn, styles.completeOutline]}
                textStyle={{ color: COLORS.WARRANTY_GREEN }}
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Reporte Técnico Final</Text>
              <Text style={styles.sectionDesc}>Complete el expediente de servicio. Esta información es obligatoria y se sincronizará con el panel central:</Text>

              {type === 'mantenimiento' ? (
                // Mantenimiento Fields
                <View>
                  <Input
                    label="Diagnóstico del Problema *"
                    placeholder="Describa el diagnóstico inicial encontrado en el sitio..."
                    value={diagnostico}
                    onChangeText={setDiagnostico}
                    error={errors.diagnostico}
                    multiline
                    numberOfLines={4}
                    style={styles.textArea}
                  />

                  <Input
                    label="Trabajos Realizados *"
                    placeholder="Detalle todas las reparaciones, calibraciones, limpieza o ajustes..."
                    value={trabajosRealizados}
                    onChangeText={setTrabajosRealizados}
                    error={errors.trabajosRealizados}
                    multiline
                    numberOfLines={4}
                    style={styles.textArea}
                  />

                  <Input
                    label="Repuestos Utilizados (Opcional)"
                    placeholder="Ej. Resorte de torsión 2'', Cremallera de nylon..."
                    value={repuestosUtilizados}
                    onChangeText={setRepuestosUtilizados}
                    multiline
                    numberOfLines={2}
                    style={styles.textArea}
                  />

                  <Input
                    label="Costo Adicional del Servicio (S/) *"
                    placeholder="Ingrese costo adicional, o 0 si está incluido"
                    value={costoTotal}
                    onChangeText={setCostoTotal}
                    error={errors.costoTotal}
                    keyboardType="numeric"
                  />

                  {/* Conformity Switch */}
                  <View style={styles.switchWrapper}>
                    <View style={styles.switchTextContainer}>
                      <Text style={styles.switchLabel}>Firma de Conformidad *</Text>
                      <Text style={styles.switchDesc}>Declaro que el cliente firmó conformidad física o digital en el sitio.</Text>
                    </View>
                    <Switch
                      value={firmaMant}
                      onValueChange={setFirmaMant}
                      trackColor={{ false: COLORS.BORDER_DARK, true: COLORS.WARRANTY_GREEN }}
                      thumbColor={firmaMant ? COLORS.PRIMARY_GOLD : COLORS.TEXT_SECONDARY}
                    />
                  </View>
                  {errors.firmaMant && (
                    <Text style={styles.errorText}>{errors.firmaMant}</Text>
                  )}
                </View>
              ) : (
                // Cotizacion Fields
                <View>
                  <Input
                    label="Medidas Técnicas Tomadas (Ancho x Alto, etc.) *"
                    placeholder="Ej. Ancho: 3.50m, Alto: 2.40m, Espacio de cabezal: 30cm..."
                    value={medidas}
                    onChangeText={setMedidas}
                    error={errors.medidas}
                    multiline
                    numberOfLines={3}
                    style={styles.textArea}
                  />

                  <Input
                    label="Grado de Dificultad de la Instalación *"
                    placeholder="Ej. Baja / Media / Alta - Detalles estructurales"
                    value={dificultad}
                    onChangeText={setDificultad}
                    error={errors.dificultad}
                  />

                  <Input
                    label="Tiempo Estimado de Instalación (Días u Horas) *"
                    placeholder="Ej. 1 día de trabajo (4 horas)"
                    value={tiempoEstimado}
                    onChangeText={setTiempoEstimado}
                    error={errors.tiempoEstimado}
                  />

                  <Input
                    label="Observaciones Adicionales (Opcional)"
                    placeholder="Ej. Requiere soldar base superior, cliente prefiere motor CAME..."
                    value={observaciones}
                    onChangeText={setObservaciones}
                    multiline
                    numberOfLines={3}
                    style={styles.textArea}
                  />

                  {/* Conformity Switch */}
                  <View style={styles.switchWrapper}>
                    <View style={styles.switchTextContainer}>
                      <Text style={styles.switchLabel}>Firma de Conformidad *</Text>
                      <Text style={styles.switchDesc}>Declaro que el cliente aprobó las medidas tomadas y observaciones técnicas.</Text>
                    </View>
                    <Switch
                      value={firmaCot}
                      onValueChange={setFirmaCot}
                      trackColor={{ false: COLORS.BORDER_DARK, true: COLORS.WARRANTY_GREEN }}
                      thumbColor={firmaCot ? COLORS.PRIMARY_GOLD : COLORS.TEXT_SECONDARY}
                    />
                  </View>
                  {errors.firmaCot && (
                    <Text style={styles.errorText}>{errors.firmaCot}</Text>
                  )}
                </View>
              )}

              {/* Form buttons */}
              <View style={styles.formButtonsRow}>
                <Button
                  title="Atrás"
                  onPress={() => setTargetStatus('')}
                  variant="secondary"
                  style={styles.formHalfBtn}
                />
                
                <Button
                  title="Guardar Reporte"
                  onPress={handleCompleteService}
                  loading={submitting}
                  style={[styles.formHalfBtn, styles.submitBtn]}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: LAYOUT.spacing.md,
    flexGrow: 1,
  },
  screenLabel: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    marginBottom: LAYOUT.spacing.md,
  },
  highlightText: {
    color: COLORS.PRIMARY_GOLD,
    fontWeight: 'bold',
  },
  actionMenu: {
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: LAYOUT.borderRadius.xl,
    padding: LAYOUT.spacing.lg,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
    ...LAYOUT.shadows.md,
  },
  sectionTitle: {
    fontSize: LAYOUT.typography.sizes.h2,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    marginBottom: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  sectionDesc: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: LAYOUT.typography.lineHeights.body,
    marginBottom: LAYOUT.spacing.lg,
    fontFamily: 'System',
  },
  actionBtn: {
    marginVertical: LAYOUT.spacing.sm,
  },
  completeOutline: {
    borderColor: COLORS.WARRANTY_GREEN,
  },
  formContainer: {
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: LAYOUT.borderRadius.xl,
    padding: LAYOUT.spacing.lg,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
    ...LAYOUT.shadows.md,
    marginBottom: LAYOUT.spacing.xl,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingVertical: LAYOUT.spacing.sm,
  },
  switchWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: LAYOUT.spacing.md,
    padding: LAYOUT.spacing.sm,
    backgroundColor: COLORS.BG_DARK,
    borderRadius: LAYOUT.borderRadius.lg,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: LAYOUT.spacing.md,
  },
  switchLabel: {
    fontSize: LAYOUT.typography.sizes.body,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
  },
  switchDesc: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
    fontFamily: 'System',
  },
  errorText: {
    color: COLORS.ERROR_RED,
    fontSize: LAYOUT.typography.sizes.small,
    marginTop: -LAYOUT.spacing.xs,
    marginBottom: LAYOUT.spacing.sm,
    paddingHorizontal: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  formButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: LAYOUT.spacing.xl,
  },
  formHalfBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.WARRANTY_GREEN,
  },
});

export default UpdateStatusScreen;
