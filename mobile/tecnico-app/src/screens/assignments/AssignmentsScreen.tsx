import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, RefreshControl, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import AssignmentCard from '../../components/assignments/AssignmentCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Header from '../../components/common/Header';

type TabType = 'mantenimiento' | 'cotizacion';
type FilterStatus = 'todos' | 'pendiente' | 'en_progreso' | 'completado';

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'todos',       label: 'Todos'      },
  { key: 'pendiente',   label: 'Pendientes' },
  { key: 'en_progreso', label: 'En proceso' },
  { key: 'completado',  label: 'Completados'},
];

export const AssignmentsScreen: React.FC<any> = ({ navigation }) => {
  const { tecnico } = useAuthStore();
  const [activeTab, setActiveTab]       = useState<TabType>('mantenimiento');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('todos');
  const [searchQuery, setSearchQuery]   = useState('');
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [mantenimientos, setMantenimientos] = useState<any[]>([]);
  const [cotizaciones, setCotizaciones]     = useState<any[]>([]);

  const fetchAssignments = async () => {
    if (!tecnico) return;
    try {
      const [mants, quotes] = await Promise.all([
        MantenimientoService.getMyMantenimientos(tecnico.id),
        CotizacionService.getMyCotizaciones(tecnico.id),
      ]);
      setMantenimientos(mants);
      setCotizaciones(quotes);
    } catch {
      Alert.alert('Error', 'No se pudieron recuperar las asignaciones.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, [tecnico]);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchAssignments(); }, [tecnico]);

  const getFilteredData = () => {
    const list = activeTab === 'mantenimiento' ? mantenimientos : cotizaciones;
    let filtered = list;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = list.filter(i =>
        i.codigo.toLowerCase().includes(q) ||
        i.nombre_cliente.toLowerCase().includes(q) ||
        i.direccion.toLowerCase().includes(q) ||
        i.distrito.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'todos') return filtered;

    return filtered.filter(item => {
      const s = item.estado;
      if (activeTab === 'mantenimiento') {
        if (activeFilter === 'pendiente')   return ['recibido','visita_agendada'].includes(s);
        if (activeFilter === 'en_progreso') return ['en_proceso','en_revision','diagnostico_remoto','esperando_repuestos'].includes(s);
        if (activeFilter === 'completado')  return s === 'resuelto';
      } else {
        if (activeFilter === 'pendiente')   return ['recibido','visita_agendada'].includes(s);
        if (activeFilter === 'en_progreso') return ['en_instalacion','en_revision','instalacion_agendada'].includes(s);
        if (activeFilter === 'completado')  return ['completado','cotizado','aceptado'].includes(s);
      }
      return false;
    });
  };

  if (loading) return <Loader message="Sincronizando asignaciones..." />;

  const listData = getFilteredData();
  const mantCount  = mantenimientos.filter(m => !['resuelto','cancelado'].includes(m.estado)).length;
  const cotizCount = cotizaciones.filter(c => !['completado','cancelado','rechazado'].includes(c.estado)).length;

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Mis Asignaciones" />

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <View style={styles.tabRow}>
        {(['mantenimiento','cotizacion'] as TabType[]).map(tab => {
          const active = activeTab === tab;
          const count  = tab === 'mantenimiento' ? mantCount : cotizCount;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => { setActiveTab(tab); setActiveFilter('todos'); }}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={tab === 'mantenimiento' ? 'build' : 'straighten'}
                size={16}
                color={active ? COLORS.WHITE : COLORS.TEXT_TERTIARY}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab === 'mantenimiento' ? 'Mantenimientos' : 'Cotizaciones'}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Buscador ──────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={18} color={COLORS.TEXT_TERTIARY} />
          <TextInput
            style={styles.searchInput}
            placeholder="Código, cliente o distrito..."
            placeholderTextColor={COLORS.TEXT_TERTIARY}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Buscador de asignaciones"
          />
          {!!searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn} accessibilityLabel="Limpiar búsqueda">
              <MaterialIcons name="close" size={16} color={COLORS.TEXT_TERTIARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Filtros ───────────────────────────────────────────────────── */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveFilter(f.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Lista ─────────────────────────────────────────────────────── */}
      <FlatList
        data={listData}
        keyExtractor={item => `${activeTab}-${item.id}`}
        renderItem={({ item }) => (
          <AssignmentCard
            item={item}
            type={activeTab}
            onPress={() => navigation.navigate('AssignmentDetail', { id: item.id, type: activeTab })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
            tintColor={COLORS.PRIMARY_GOLD} colors={[COLORS.PRIMARY_GOLD]} />
        }
        ListEmptyComponent={
          <EmptyState
            title="Sin asignaciones"
            message={searchQuery
              ? 'No se encontraron resultados para su búsqueda.'
              : 'No tiene asignaciones para este filtro.'}
            iconName={activeTab === 'mantenimiento' ? 'build' : 'straighten'}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BG_BASE },

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    margin: 14,
    backgroundColor: COLORS.BG_ELEVATED,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
    gap: 6,
  },
  tabActive: {
    backgroundColor: COLORS.PRIMARY_GOLD,
    shadowColor: COLORS.PRIMARY_GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  tabLabel: { fontSize: 13, fontWeight: '600', color: COLORS.TEXT_TERTIARY },
  tabLabelActive: { color: COLORS.WHITE },
  tabBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.BORDER_MEDIUM,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.30)' },
  tabBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.TEXT_SECONDARY },
  tabBadgeTextActive: { color: COLORS.WHITE },

  // ── Buscador ──────────────────────────────────────────────────────────────
  searchWrap: { paddingHorizontal: 14, marginBottom: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.BG_SURFACE,
    borderRadius: 12, paddingHorizontal: 12,
    height: 46, borderWidth: 1, borderColor: COLORS.BORDER_DARK,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  searchInput: { flex: 1, color: COLORS.TEXT_PRIMARY, fontSize: 14, fontFamily: 'System' },
  clearBtn: { padding: 4 },

  // ── Filtros ───────────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: 'row', paddingHorizontal: 14,
    marginBottom: 10, gap: 8,
  },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: COLORS.BG_SURFACE,
    borderWidth: 1, borderColor: COLORS.BORDER_DARK,
  },
  chipActive: {
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
    borderColor: COLORS.BORDER_GOLD_STRONG,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: COLORS.TEXT_SECONDARY },
  chipTextActive: { color: COLORS.PRIMARY_GOLD_DARK },

  // ── Lista ─────────────────────────────────────────────────────────────────
  listContent: { paddingHorizontal: 14, paddingBottom: 24, flexGrow: 1 },
});

export default AssignmentsScreen;