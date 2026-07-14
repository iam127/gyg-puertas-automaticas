import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  RefreshControl, TouchableOpacity, Alert, StatusBar as RNStatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

interface Metrics { pendingMant: number; inProgressMant: number; completedMant: number; activeQuotes: number; }
interface MetricConfig { key: keyof Metrics; label: string; icon: React.ComponentProps<typeof MaterialIcons>['name']; color: string; bg: string; }

const METRIC_CONFIGS: MetricConfig[] = [
  { key: 'pendingMant',    label: 'Mants. Pendientes',    icon: 'pending-actions', color: COLORS.PREVENTIVE_BLUE,   bg: COLORS.PREVENTIVE_BLUE_BG   },
  { key: 'inProgressMant', label: 'En Proceso',           icon: 'construction',    color: COLORS.PRIMARY_GOLD_DARK, bg: COLORS.PRIMARY_GOLD_MUTED   },
  { key: 'completedMant',  label: 'Resueltos Hoy',        icon: 'check-circle',    color: COLORS.SUCCESS,           bg: COLORS.SUCCESS_BG           },
  { key: 'activeQuotes',   label: 'Cotizaciones Activas', icon: 'description',     color: COLORS.CORRECTIVE_ORANGE, bg: COLORS.CORRECTIVE_ORANGE_BG },
];

const MetricCard: React.FC<{ config: MetricConfig; value: number }> = ({ config, value }) => (
  <View style={[styles.metricCard, { borderColor: config.color + '33' }]}>
    <View style={[styles.metricIconWrap, { backgroundColor: config.bg }]}>
      <MaterialIcons name={config.icon} size={22} color={config.color} />
    </View>
    <Text style={styles.metricNumber}>{value}</Text>
    <Text style={styles.metricLabel}>{config.label}</Text>
  </View>
);

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { tecnico } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({ pendingMant: 0, inProgressMant: 0, completedMant: 0, activeQuotes: 0 });
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    if (!tecnico) return;
    try {
      const [mantenimientos, cotizaciones] = await Promise.all([
        MantenimientoService.getMyMantenimientos(tecnico.id),
        CotizacionService.getMyCotizaciones(tecnico.id),
      ]);
      let pendingMant = 0, inProgressMant = 0, completedMant = 0;
      mantenimientos.forEach((m: any) => {
        if (m.estado === 'resuelto') completedMant++;
        else if (['en_proceso','en_revision','diagnostico_remoto','esperando_repuestos'].includes(m.estado)) inProgressMant++;
        else if (['recibido','visita_agendada'].includes(m.estado)) pendingMant++;
      });
      const activeQuotes = cotizaciones.filter((c: any) => !['completado','cancelado','rechazado'].includes(c.estado)).length;
      setMetrics({ pendingMant, inProgressMant, completedMant, activeQuotes });

      const combined = [
        ...mantenimientos.filter((m: any) => !['resuelto','cancelado'].includes(m.estado))
          .map((m: any) => ({ ...m, taskType: 'mantenimiento', date: m.visitas?.[0]?.fecha || '9999-12-31', time: m.visitas?.[0]?.hora || '23:59' })),
        ...cotizaciones.filter((c: any) => !['completado','cancelado','rechazado'].includes(c.estado))
          .map((c: any) => ({ ...c, taskType: 'cotizacion', date: c.visitas?.[0]?.fecha || '9999-12-31', time: c.visitas?.[0]?.hora || '23:59' })),
      ].sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time)).slice(0, 3);

      setUpcomingTasks(combined);
    } catch {
      Alert.alert('Error', 'No se pudieron sincronizar los datos del servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, [tecnico]);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchDashboardData(); }, [tecnico]);

  if (loading) return <Loader message="Sincronizando panel..." />;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dateDisplay = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  const techName = tecnico?.usuario.first_name || 'Técnico';

  return (
    <View style={styles.root}>
      <RNStatusBar barStyle="dark-content" backgroundColor={COLORS.BG_BASE} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.PRIMARY_GOLD} colors={[COLORS.PRIMARY_GOLD]} />}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeText}>Hola, {techName} 👋</Text>
              <Text style={styles.dateText}>{dateDisplay}</Text>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>En línea</Text>
            </View>
          </View>

          {/* ── Métricas ── */}
          <Text style={styles.sectionTitle}>Métricas de hoy</Text>
          <View style={styles.metricsGrid}>
            {METRIC_CONFIGS.map(cfg => <MetricCard key={cfg.key} config={cfg} value={metrics[cfg.key]} />)}
          </View>

          {/* ── Próximos trabajos ── */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Próximos trabajos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AssignmentsTab')} style={styles.viewAllBtn} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>Ver todo</Text>
              <MaterialIcons name="arrow-forward" size={15} color={COLORS.PRIMARY_GOLD_DARK} />
            </TouchableOpacity>
          </View>

          {upcomingTasks.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <MaterialIcons name="celebration" size={30} color={COLORS.PRIMARY_GOLD} />
              </View>
              <Text style={styles.emptyTitle}>¡Sin tareas pendientes!</Text>
              <Text style={styles.emptySubtext}>Arrastra hacia abajo para refrescar</Text>
            </View>
          ) : (
            upcomingTasks.map((task) => {
              const isMant = task.taskType === 'mantenimiento';
              const visit = task.visitas?.[0] ?? null;
              const dateStr = visit ? `${visit.fecha}  ${visit.hora}` : 'Sin programar';
              return (
                <TouchableOpacity
                  key={`${task.taskType}-${task.id}`}
                  onPress={() => navigation.navigate('AssignmentsTab', { screen: 'AssignmentDetail', params: { id: task.id, type: task.taskType } })}
                  activeOpacity={0.76}
                >
                  <View style={styles.taskCard}>
                    <View style={[styles.taskStripe, { backgroundColor: isMant ? COLORS.PREVENTIVE_BLUE_BG : COLORS.CORRECTIVE_ORANGE_BG }]}>
                      <MaterialIcons name={isMant ? 'build' : 'request-quote'} size={12} color={isMant ? COLORS.PREVENTIVE_BLUE : COLORS.CORRECTIVE_ORANGE} />
                      <Text style={[styles.taskStripeText, { color: isMant ? COLORS.PREVENTIVE_BLUE : COLORS.CORRECTIVE_ORANGE }]}>
                        {isMant ? 'MANTENIMIENTO' : 'COTIZACIÓN'}
                      </Text>
                    </View>
                    <View style={styles.taskBody}>
                      <View style={styles.taskHeaderRow}>
                        <Text style={styles.taskCode}>{task.codigo}</Text>
                        <Badge status={task.estado} type={task.taskType} />
                      </View>
                      <Text style={styles.taskClient}>{task.nombre_cliente}</Text>
                      <View style={styles.taskMeta}>
                        <MaterialIcons name="location-on" size={13} color={COLORS.TEXT_TERTIARY} />
                        <Text style={styles.taskMetaText} numberOfLines={1}>{task.distrito} — {task.direccion}</Text>
                      </View>
                      <View style={styles.taskFooter}>
                        <View style={styles.taskMeta}>
                          <MaterialIcons name="event" size={13} color={COLORS.PRIMARY_GOLD} />
                          <Text style={styles.taskDate}>{dateStr}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={18} color={COLORS.TEXT_MUTED} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG_BASE },
  safe: { flex: 1 },
  scroll: { padding: 16, paddingTop: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  headerLeft: { flex: 1 },
  welcomeText: { fontSize: 24, fontWeight: '800', color: COLORS.TEXT_PRIMARY, letterSpacing: 0.2, marginBottom: 4 },
  dateText: { fontSize: 12, color: COLORS.TEXT_SECONDARY, fontWeight: '500', textTransform: 'capitalize' },
  onlineBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.SUCCESS_BG, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.SUCCESS_BORDER, gap: 6, marginLeft: 12,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.SUCCESS },
  onlineText: { fontSize: 11, fontWeight: '700', color: COLORS.SUCCESS },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 12, letterSpacing: 0.2 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  viewAllText: { fontSize: 13, fontWeight: '600', color: COLORS.PRIMARY_GOLD_DARK },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24, gap: 10 },
  metricCard: {
    width: '47.5%', backgroundColor: COLORS.BG_SURFACE, borderRadius: 16, padding: 16, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  metricIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  metricNumber: { fontSize: 30, fontWeight: '900', color: COLORS.TEXT_PRIMARY, lineHeight: 34, marginBottom: 4 },
  metricLabel: { fontSize: 11, color: COLORS.TEXT_SECONDARY, fontWeight: '600', lineHeight: 15 },

  emptyCard: {
    backgroundColor: COLORS.BG_SURFACE, borderRadius: 16, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
  },
  emptyIconWrap: {
    width: 60, height: 60, borderRadius: 18, backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD, justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.TEXT_PRIMARY, textAlign: 'center', marginBottom: 6 },
  emptySubtext: { fontSize: 12, color: COLORS.TEXT_SECONDARY, textAlign: 'center' },

  taskCard: {
    backgroundColor: COLORS.BG_SURFACE, borderRadius: 16, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.BORDER_DARK, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  taskStripe: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6 },
  taskStripeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  taskBody: { padding: 14, paddingTop: 10 },
  taskHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  taskCode: { fontSize: 14, fontWeight: '700', color: COLORS.TEXT_PRIMARY, letterSpacing: 0.3 },
  taskClient: { fontSize: 15, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  taskMetaText: { flex: 1, fontSize: 12, color: COLORS.TEXT_SECONDARY, fontWeight: '500' },
  taskFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: COLORS.BORDER_SUBTLE, paddingTop: 10, marginTop: 6,
  },
  taskDate: { fontSize: 12, color: COLORS.PRIMARY_GOLD_DARK, fontWeight: '600' },
});

export default HomeScreen;