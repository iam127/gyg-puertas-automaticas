import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SectionList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Header from '../../components/common/Header';

interface HistoryItem {
  id: number; codigo: string; nombre_cliente: string;
  direccion: string; distrito: string; estado: string;
  tipo_puerta?: string; tipo_uso?: string;
  taskType: 'mantenimiento' | 'cotizacion'; fechaCompleted: string;
}
interface SectionData { title: string; data: HistoryItem[]; }

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export const HistoryScreen: React.FC<any> = ({ navigation }) => {
  const { tecnico } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const fetchHistory = async () => {
    if (!tecnico) return;
    try {
      const [mantenimientos, cotizaciones] = await Promise.all([
        MantenimientoService.getMyMantenimientos(tecnico.id),
        CotizacionService.getMyCotizaciones(tecnico.id),
      ]);
      const completedMants: HistoryItem[] = mantenimientos.filter(m => m.estado === 'resuelto').map(m => ({
        id: m.id, codigo: m.codigo, nombre_cliente: m.nombre_cliente, direccion: m.direccion,
        distrito: m.distrito, estado: m.estado, tipo_puerta: m.tipo_puerta, taskType: 'mantenimiento',
        fechaCompleted: m.visitas?.[0]?.fecha ?? m.actualizado_en?.split('T')[0] ?? '2026-05-01',
      }));
      const completedQuotes: HistoryItem[] = cotizaciones.filter(c => c.estado === 'completado').map(c => ({
        id: c.id, codigo: c.codigo, nombre_cliente: c.nombre_cliente, direccion: c.direccion,
        distrito: c.distrito, estado: c.estado, tipo_uso: c.tipo_uso, taskType: 'cotizacion',
        fechaCompleted: c.visitas?.[0]?.fecha ?? c.actualizado_en?.split('T')[0] ?? '2026-05-01',
      }));
      const allCompleted = [...completedMants, ...completedQuotes];
      setTotalCompleted(allCompleted.length);
      const groups: Record<string, HistoryItem[]> = {};
      allCompleted.forEach(item => {
        const parts = item.fechaCompleted.split('-');
        if (parts.length >= 2) {
          const key = `${MONTHS_ES[parseInt(parts[1], 10) - 1] ?? 'General'} ${parts[0]}`;
          if (!groups[key]) groups[key] = [];
          groups[key].push(item);
        }
      });
      setSections(Object.keys(groups).map(key => ({
        title: key,
        data: groups[key].sort((a, b) => b.fechaCompleted.localeCompare(a.fechaCompleted)),
      })).sort((a, b) => (b.data[0]?.fechaCompleted ?? '').localeCompare(a.data[0]?.fechaCompleted ?? '')));
    } catch {
      Alert.alert('Error', 'No se pudo cargar el historial.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const unsubscribe = navigation.addListener('focus', fetchHistory);
    return unsubscribe;
  }, [tecnico]);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchHistory(); }, [tecnico]);

  const renderSectionHeader = ({ section: { title } }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionPill}>
        <MaterialIcons name="calendar-today" size={11} color={COLORS.PRIMARY_GOLD_DARK} style={{ marginRight: 5 }} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const isMant = item.taskType === 'mantenimiento';
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AssignmentsTab', { screen: 'AssignmentDetail', params: { id: item.id, type: item.taskType } })}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`Trabajo ${item.codigo} para ${item.nombre_cliente}`}
      >
        <Card style={styles.itemCard} hasBorder>
          <View style={styles.itemTop}>
            <View style={styles.typeBadge}>
              <View style={[styles.typeDot, { backgroundColor: isMant ? COLORS.PREVENTIVE_BLUE : COLORS.CORRECTIVE_ORANGE }]} />
              <Text style={[styles.typeText, { color: isMant ? COLORS.PREVENTIVE_BLUE : COLORS.CORRECTIVE_ORANGE }]}>
                {isMant ? 'Mantenimiento' : 'Visita técnica'}
              </Text>
            </View>
            <View style={styles.completedBadge}>
              <MaterialIcons name="check-circle" size={12} color={COLORS.SUCCESS} />
              <Text style={styles.completedText}>Completado</Text>
            </View>
          </View>
          <Text style={styles.clientName}>{item.nombre_cliente}</Text>
          <Text style={styles.itemCode}>{item.codigo}</Text>
          <Text style={styles.itemSub}>{isMant ? item.tipo_puerta ?? 'General' : `Uso ${item.tipo_uso ?? 'Residencial'}`}</Text>
          <View style={styles.itemFooter}>
            <View style={styles.metaChip}>
              <MaterialIcons name="location-on" size={12} color={COLORS.TEXT_TERTIARY} />
              <Text style={styles.metaText}>{item.distrito}</Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcons name="event" size={12} color={COLORS.PRIMARY_GOLD} />
              <Text style={[styles.metaText, styles.metaGold]}>{item.fechaCompleted}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) return <Loader message="Cargando historial de trabajos..." />;

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Historial técnico" />

      <View style={styles.statSection}>
        <Card variant="gold" style={styles.statCard}>
          <View style={styles.statIconWrap}>
            <MaterialIcons name="history" size={22} color={COLORS.PRIMARY_GOLD_DARK} />
          </View>
          <View style={styles.statBody}>
            <Text style={styles.statLabel}>Servicios realizados</Text>
            <Text style={styles.statCount}>{totalCompleted}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={COLORS.TEXT_MUTED} />
        </Card>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => `${item.taskType}-${item.id}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.PRIMARY_GOLD} colors={[COLORS.PRIMARY_GOLD]} />}
        ListEmptyComponent={<EmptyState title="Sin historial" message="Aún no registra servicios completados en el sistema." iconName="history" />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG_BASE },

  statSection: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  statCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.BORDER_GOLD, gap: 14 },
  statIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
    justifyContent: 'center', alignItems: 'center',
  },
  statBody: { flex: 1 },
  statLabel: { fontSize: 12, color: COLORS.TEXT_SECONDARY, fontWeight: '500', marginBottom: 2 },
  statCount: { fontSize: 26, fontWeight: '800', color: COLORS.PRIMARY_GOLD_DARK, lineHeight: 30 },

  sectionHeader: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 6 },
  sectionPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: COLORS.BORDER_GOLD,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.PRIMARY_GOLD_DARK, letterSpacing: 0.3 },

  listContent: { paddingHorizontal: 16, paddingBottom: 32, flexGrow: 1 },

  itemCard: { padding: 14, marginVertical: 4 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  typeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.SUCCESS_BG, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  completedText: { fontSize: 11, fontWeight: '700', color: COLORS.SUCCESS },
  clientName: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 2 },
  itemCode: { fontSize: 12, color: COLORS.TEXT_TERTIARY, fontWeight: '500', marginBottom: 4, letterSpacing: 0.5 },
  itemSub: { fontSize: 13, color: COLORS.TEXT_SECONDARY, marginBottom: 10 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.BORDER_SUBTLE, paddingTop: 10 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: COLORS.TEXT_TERTIARY, fontWeight: '500' },
  metaGold: { color: COLORS.PRIMARY_GOLD_DARK },
});

export default HistoryScreen;