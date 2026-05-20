import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  RefreshControl, 
  Alert 
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import AssignmentCard from '../../components/assignments/AssignmentCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Header from '../../components/common/Header';

type TabType = 'mantenimiento' | 'cotizacion';
type FilterStatus = 'todos' | 'pendiente' | 'en_progreso' | 'completado';

export const AssignmentsScreen: React.FC<any> = ({ navigation }) => {
  const { tecnico } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('mantenimiento');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [mantenimientos, setMantenimientos] = useState<any[]>([]);
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);

  const fetchAssignments = async () => {
    if (!tecnico) return;

    try {
      const [mants, quotes] = await Promise.all([
        MantenimientoService.getMyMantenimientos(tecnico.id),
        CotizacionService.getMyCotizaciones(tecnico.id),
      ]);
      setMantenimientos(mants);
      setCotizaciones(quotes);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron recuperar las asignaciones.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [tecnico]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAssignments();
  }, [tecnico]);

  // Filters logic
  const getFilteredData = () => {
    const list = activeTab === 'mantenimiento' ? mantenimientos : cotizaciones;
    
    // 1. Text Search Filter
    let filtered = list;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = list.filter((item) => 
        item.codigo.toLowerCase().includes(query) ||
        item.nombre_cliente.toLowerCase().includes(query) ||
        item.direccion.toLowerCase().includes(query) ||
        item.distrito.toLowerCase().includes(query)
      );
    }

    // 2. Status Segment Filter
    if (activeFilter === 'todos') {
      return filtered;
    }

    return filtered.filter((item) => {
      const status = item.estado;
      if (activeTab === 'mantenimiento') {
        if (activeFilter === 'pendiente') {
          return status === 'recibido' || status === 'visita_agendada';
        }
        if (activeFilter === 'en_progreso') {
          return status === 'en_proceso' || status === 'en_revision' || status === 'diagnostico_remoto' || status === 'esperando_repuestos';
        }
        if (activeFilter === 'completado') {
          return status === 'resuelto';
        }
      } else {
        if (activeFilter === 'pendiente') {
          return status === 'recibido' || status === 'visita_agendada';
        }
        if (activeFilter === 'en_progreso') {
          return status === 'en_instalacion' || status === 'en_revision' || status === 'instalacion_agendada';
        }
        if (activeFilter === 'completado') {
          return status === 'completado' || status === 'cotizado' || status === 'aceptado';
        }
      }
      return false;
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <AssignmentCard
      item={item}
      type={activeTab}
      onPress={() => navigation.navigate('AssignmentDetail', { id: item.id, type: activeTab })}
    />
  );

  if (loading) {
    return <Loader message="Sincronizando asignaciones..." />;
  }

  const listData = getFilteredData();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mis Asignaciones" />

      {/* Segmented Tab Control */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'mantenimiento' && styles.activeTab]}
          onPress={() => {
            setActiveTab('mantenimiento');
            setActiveFilter('todos');
          }}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'mantenimiento' }}
        >
          <Text style={[styles.tabText, activeTab === 'mantenimiento' && styles.activeTabText]}>
            🔧 Mantenimientos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'cotizacion' && styles.activeTab]}
          onPress={() => {
            setActiveTab('cotizacion');
            setActiveFilter('todos');
          }}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'cotizacion' }}
        >
          <Text style={[styles.tabText, activeTab === 'cotizacion' && styles.activeTabText]}>
            📏 Cotizaciones
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por código, cliente o distrito..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Buscador de asignaciones"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✖</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {(['todos', 'pendiente', 'en_progreso', 'completado'] as FilterStatus[]).map((filter) => {
          const isActive = activeFilter === filter;
          let label = '';
          switch (filter) {
            case 'todos': label = 'Todos'; break;
            case 'pendiente': label = 'Pendientes'; break;
            case 'en_progreso': label = 'En Proceso'; break;
            case 'completado': label = 'Completados'; break;
          }
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
              onPress={() => setActiveFilter(filter)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Assignment List */}
      <FlatList
        data={listData}
        keyExtractor={(item) => `${activeTab}-${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.PRIMARY_GOLD}
            colors={[COLORS.PRIMARY_GOLD]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="Sin asignaciones"
            message={
              searchQuery 
                ? 'No se encontraron resultados para su búsqueda en esta categoría.'
                : 'No tiene asignaciones registradas para este filtro.'
            }
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_DARK,
    margin: LAYOUT.spacing.md,
    borderRadius: LAYOUT.borderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  tabButton: {
    flex: 1,
    paddingVertical: LAYOUT.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: LAYOUT.borderRadius.md,
  },
  activeTab: {
    backgroundColor: COLORS.PRIMARY_GOLD,
  },
  tabText: {
    fontSize: LAYOUT.typography.sizes.body,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
  },
  activeTabText: {
    color: COLORS.BG_DARK,
  },
  searchSection: {
    paddingHorizontal: LAYOUT.spacing.md,
    marginBottom: LAYOUT.spacing.sm,
  },
  searchBar: {
    height: 44,
    backgroundColor: COLORS.CARD_DARK,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: LAYOUT.borderRadius.lg,
    paddingHorizontal: LAYOUT.spacing.md,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_DARK,
  },
  searchIcon: {
    marginRight: LAYOUT.spacing.sm,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.TEXT_PRIMARY,
    fontSize: LAYOUT.typography.sizes.body,
    fontFamily: 'System',
  },
  clearBtn: {
    padding: LAYOUT.spacing.xs,
  },
  clearText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: LAYOUT.spacing.md,
    marginBottom: LAYOUT.spacing.sm,
    justifyContent: 'space-between',
  },
  filterChip: {
    paddingHorizontal: LAYOUT.spacing.sm,
    paddingVertical: LAYOUT.spacing.xs,
    borderRadius: LAYOUT.borderRadius.round,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  activeFilterChip: {
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    borderColor: COLORS.PRIMARY_GOLD,
  },
  filterChipText: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: COLORS.PRIMARY_GOLD,
  },
  listContent: {
    padding: LAYOUT.spacing.md,
    paddingTop: 0,
    flexGrow: 1,
  },
});

export default AssignmentsScreen;
