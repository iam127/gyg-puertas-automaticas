import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  RefreshControl, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { tecnico } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Metrics state
  const [metrics, setMetrics] = useState({
    pendingMant: 0,
    inProgressMant: 0,
    completedMant: 0,
    activeQuotes: 0,
  });

  // Top 3 upcoming assignments
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    if (!tecnico) return;

    try {
      // Fetch both datasets concurrently
      const [mantenimientos, cotizaciones] = await Promise.all([
        MantenimientoService.getMyMantenimientos(tecnico.id),
        CotizacionService.getMyCotizaciones(tecnico.id),
      ]);

      // Calculate maintenance metrics
      let pendingMant = 0;
      let inProgressMant = 0;
      let completedMant = 0;

      mantenimientos.forEach((m) => {
        if (m.estado === 'resuelto') {
          completedMant++;
        } else if (
          m.estado === 'en_proceso' || 
          m.estado === 'en_revision' || 
          m.estado === 'diagnostico_remoto' ||
          m.estado === 'esperando_repuestos'
        ) {
          inProgressMant++;
        } else if (m.estado === 'recibido' || m.estado === 'visita_agendada') {
          pendingMant++;
        }
      });

      // Calculate cotizacion metrics (excluding completado, cancelado, rechazado)
      const activeQuotes = cotizaciones.filter(
        (c) => c.estado !== 'completado' && c.estado !== 'cancelado' && c.estado !== 'rechazado'
      ).length;

      setMetrics({
        pendingMant,
        inProgressMant,
        completedMant,
        activeQuotes,
      });

      // Combine and filter upcoming tasks (with programada status or future visits)
      const formattedMants = mantenimientos
        .filter((m) => m.estado !== 'resuelto' && m.estado !== 'cancelado')
        .map((m) => ({
          ...m,
          taskType: 'mantenimiento',
          date: m.visitas?.[0]?.fecha || '9999-12-31',
          time: m.visitas?.[0]?.hora || '23:59',
        }));

      const formattedQuotes = cotizaciones
        .filter((c) => c.estado !== 'completado' && c.estado !== 'cancelado' && c.estado !== 'rechazado')
        .map((c) => ({
          ...c,
          taskType: 'cotizacion',
          date: c.visitas?.[0]?.fecha || '9999-12-31',
          time: c.visitas?.[0]?.hora || '23:59',
        }));

      const combined = [...formattedMants, ...formattedQuotes]
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.time.localeCompare(b.time);
        })
        .slice(0, 3); // Take top 3 upcoming

      setUpcomingTasks(combined);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron sincronizar los datos del servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [tecnico]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [tecnico]);

  if (loading) {
    return <Loader message="Sincronizando panel..." />;
  }

  // Get current date representation in Spanish
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedToday = today.toLocaleDateString('es-ES', options);

  const technicianName = tecnico?.usuario.first_name || 'Técnico';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.PRIMARY_GOLD}
            colors={[COLORS.PRIMARY_GOLD]}
          />
        }
      >
        {/* Personalized Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hola, {technicianName}</Text>
            <Text style={styles.dateText}>{formattedToday.charAt(0).toUpperCase() + formattedToday.slice(1)}</Text>
          </View>
          <View style={styles.statusDotWrapper}>
            <View style={styles.statusDot} />
            <Text style={styles.onlineText}>En Línea</Text>
          </View>
        </View>

        {/* KPI Grid */}
        <Text style={styles.sectionTitle}>Métricas de Hoy</Text>
        <View style={styles.grid}>
          <Card style={[styles.kpiCard, { borderLeftColor: COLORS.PREVENTIVE_BLUE }]} hasBorder>
            <Text style={styles.kpiEmoji}>🔵</Text>
            <Text style={styles.kpiNumber}>{metrics.pendingMant}</Text>
            <Text style={styles.kpiLabel}>Mants. Pendientes</Text>
          </Card>

          <Card style={[styles.kpiCard, { borderLeftColor: COLORS.PRIMARY_GOLD }]} hasBorder>
            <Text style={styles.kpiEmoji}>🟡</Text>
            <Text style={styles.kpiNumber}>{metrics.inProgressMant}</Text>
            <Text style={styles.kpiLabel}>En Proceso</Text>
          </Card>

          <Card style={[styles.kpiCard, { borderLeftColor: COLORS.WARRANTY_GREEN }]} hasBorder>
            <Text style={styles.kpiEmoji}>🟢</Text>
            <Text style={styles.kpiNumber}>{metrics.completedMant}</Text>
            <Text style={styles.kpiLabel}>Resueltos Hoy</Text>
          </Card>

          <Card style={[styles.kpiCard, { borderLeftColor: COLORS.CORRECTIVE_ORANGE }]} hasBorder>
            <Text style={styles.kpiEmoji}>💼</Text>
            <Text style={styles.kpiNumber}>{metrics.activeQuotes}</Text>
            <Text style={styles.kpiLabel}>Cotizaciones Activas</Text>
          </Card>
        </View>

        {/* Upcoming Tasks Section */}
        <View style={styles.upcomingHeader}>
          <Text style={styles.sectionTitle}>Próximos Trabajos</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AssignmentsTab')}
            accessibilityRole="button"
            accessibilityLabel="Ver todas las asignaciones"
          >
            <Text style={styles.viewAllText}>Ver todo →</Text>
          </TouchableOpacity>
        </View>

        {upcomingTasks.length === 0 ? (
          <Card style={styles.emptyCard} hasBorder>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyText}>¡No tienes tareas programadas pendientes!</Text>
            <Text style={styles.emptySubtext}>Arrastra la pantalla hacia abajo para refrescar.</Text>
          </Card>
        ) : (
          upcomingTasks.map((task) => {
            const visit = task.visitas && task.visitas.length > 0 ? task.visitas[0] : null;
            const dateStr = visit ? `${visit.fecha} - ${visit.hora}` : 'Sin programar';
            return (
              <TouchableOpacity
                key={`${task.taskType}-${task.id}`}
                onPress={() => navigation.navigate('AssignmentsTab', {
                  screen: 'AssignmentDetail',
                  params: { id: task.id, type: task.taskType }
                })}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Tarea ${task.codigo}. Cliente ${task.nombre_cliente}. Estado ${task.estado}`}
              >
                <Card style={styles.taskCard} hasBorder>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskCode}>{task.codigo}</Text>
                    <Badge status={task.estado} type={task.taskType} />
                  </View>
                  <Text style={styles.taskClient}>{task.nombre_cliente}</Text>
                  <Text style={styles.taskAddress} numberOfLines={1}>📍 {task.distrito} - {task.direccion}</Text>
                  
                  <View style={styles.taskFooter}>
                    <Text style={styles.taskDate}>📅 {dateStr}</Text>
                    <Text style={styles.taskTag}>
                      {task.taskType === 'mantenimiento' ? '🔧 Mantenimiento' : '📏 Visita Técnica'}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.lg,
    paddingVertical: LAYOUT.spacing.sm,
  },
  welcomeText: {
    fontSize: LAYOUT.typography.sizes.h1,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  dateText: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    marginTop: LAYOUT.spacing.xs,
  },
  statusDotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    paddingHorizontal: LAYOUT.spacing.sm,
    paddingVertical: LAYOUT.spacing.xs,
    borderRadius: LAYOUT.borderRadius.sm,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: LAYOUT.borderRadius.round,
    backgroundColor: COLORS.WARRANTY_GREEN,
    marginRight: 6,
  },
  onlineText: {
    fontSize: LAYOUT.typography.sizes.xs,
    fontWeight: 'bold',
    color: COLORS.WARRANTY_GREEN,
    fontFamily: 'System',
  },
  sectionTitle: {
    fontSize: LAYOUT.typography.sizes.h2,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT.spacing.md,
    marginTop: LAYOUT.spacing.sm,
    fontFamily: 'System',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: LAYOUT.spacing.lg,
  },
  kpiCard: {
    width: '48%',
    padding: LAYOUT.spacing.md,
    borderLeftWidth: 4,
  },
  kpiEmoji: {
    fontSize: 24,
    marginBottom: LAYOUT.spacing.xs,
  },
  kpiNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
  },
  kpiLabel: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    marginTop: LAYOUT.spacing.xs,
    fontFamily: 'System',
    fontWeight: '600',
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.sm,
  },
  viewAllText: {
    fontSize: LAYOUT.typography.sizes.body,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  emptyCard: {
    padding: LAYOUT.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: LAYOUT.spacing.sm,
  },
  emptyText: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'System',
  },
  emptySubtext: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  taskCard: {
    padding: LAYOUT.spacing.md,
    marginVertical: LAYOUT.spacing.xs,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.xs,
  },
  taskCode: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  taskClient: {
    fontSize: LAYOUT.typography.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  taskAddress: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: LAYOUT.spacing.sm,
    fontFamily: 'System',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_DARK,
    paddingTop: LAYOUT.spacing.sm,
  },
  taskDate: {
    fontSize: LAYOUT.typography.sizes.small,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  taskTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
});

export default HomeScreen;
