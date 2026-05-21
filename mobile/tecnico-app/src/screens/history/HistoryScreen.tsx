import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SectionList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  RefreshControl, 
  Alert 
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import MantenimientoService from '../../api/mantenimientos';
import CotizacionService from '../../api/cotizaciones';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Header from '../../components/common/Header';

interface HistoryItem {
  id: number;
  codigo: string;
  nombre_cliente: string;
  direccion: string;
  distrito: string;
  estado: string;
  tipo_puerta?: string;
  tipo_uso?: string;
  taskType: 'mantenimiento' | 'cotizacion';
  fechaCompleted: string; // YYYY-MM-DD
}

interface SectionData {
  title: string; // e.g. "Mayo 2026"
  data: HistoryItem[];
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

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

      // Filter only finished tickets
      const completedMants: HistoryItem[] = mantenimientos
        .filter((m) => m.estado === 'resuelto')
        .map((m) => {
          const visit = m.visitas && m.visitas.length > 0 ? m.visitas[0] : null;
          return {
            id: m.id,
            codigo: m.codigo,
            nombre_cliente: m.nombre_cliente,
            direccion: m.direccion,
            distrito: m.distrito,
            estado: m.estado,
            tipo_puerta: m.tipo_puerta,
            taskType: 'mantenimiento',
            fechaCompleted: visit?.fecha || m.actualizado_en?.split('T')[0] || '2026-05-01',
          };
        });

      const completedQuotes: HistoryItem[] = cotizaciones
        .filter((c) => c.estado === 'completado')
        .map((c) => {
          const visit = c.visitas && c.visitas.length > 0 ? c.visitas[0] : null;
          return {
            id: c.id,
            codigo: c.codigo,
            nombre_cliente: c.nombre_cliente,
            direccion: c.direccion,
            distrito: c.distrito,
            estado: c.estado,
            tipo_uso: c.tipo_uso,
            taskType: 'cotizacion',
            fechaCompleted: visit?.fecha || c.actualizado_en?.split('T')[0] || '2026-05-01',
          };
        });

      const allCompleted = [...completedMants, ...completedQuotes];
      setTotalCompleted(allCompleted.length);

      // Group by Month Year
      const groups: Record<string, HistoryItem[]> = {};
      
      allCompleted.forEach((item) => {
        const parts = item.fechaCompleted.split('-'); // [YYYY, MM, DD]
        if (parts.length >= 2) {
          const year = parts[0];
          const monthIndex = parseInt(parts[1], 10) - 1;
          const monthName = MONTHS_ES[monthIndex] || 'General';
          const groupKey = `${monthName} ${year}`;
          
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
        }
      });

      // Sort items inside groups by date descending, and sort groups chronologically descending
      const formattedSections = Object.keys(groups)
        .map((key) => {
          // Sort items by date descending
          const sortedData = groups[key].sort((a, b) => b.fechaCompleted.localeCompare(a.fechaCompleted));
          return {
            title: key,
            data: sortedData,
          };
        })
        .sort((a, b) => {
          // Compare group titles (we can extract month/year or compare first item dates)
          const dateA = a.data[0]?.fechaCompleted || '';
          const dateB = b.data[0]?.fechaCompleted || '';
          return dateB.localeCompare(dateA);
        });

      setSections(formattedSections);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el historial de trabajos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Refresh history when focus returns
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [tecnico]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, [tecnico]);

  const renderSectionHeader = ({ section: { title } }: { section: SectionData }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AssignmentsTab', {
        screen: 'AssignmentDetail',
        params: { id: item.id, type: item.taskType }
      })}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Trabajo resuelto ${item.codigo} para ${item.nombre_cliente}`}
    >
      <Card style={styles.itemCard} hasBorder>
        <View style={styles.itemHeader}>
          <Text style={styles.itemCode}>{item.codigo}</Text>
          <Text style={styles.itemBadge}>✅ Completado</Text>
        </View>
        
        <Text style={styles.itemClient}>{item.nombre_cliente}</Text>
        <Text style={styles.itemSubText}>
          {item.taskType === 'mantenimiento' 
            ? `🔧 Mantenimiento: ${item.tipo_puerta || 'General'}` 
            : `📐 Visita Técnica: Uso ${item.tipo_uso || 'Residencial'}`}
        </Text>
        
        <View style={styles.itemFooter}>
          <Text style={styles.itemAddress}>📍 {item.distrito}</Text>
          <Text style={styles.itemDate}>📅 {item.fechaCompleted}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loader message="Cargando historial de trabajos..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Historial Técnico" />
      
      {/* Summary Stat Card */}
      <View style={styles.summarySection}>
        <Card style={styles.summaryCard} hasBorder>
          <Text style={styles.summaryEmoji}>📜</Text>
          <View style={styles.summaryStats}>
            <Text style={styles.summaryLabel}>Total Servicios Realizados</Text>
            <Text style={styles.summaryCount}>{totalCompleted} Trabajos</Text>
          </View>
        </Card>
      </View>

      {/* Sections list */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => `${item.taskType}-${item.id}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
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
            title="Sin historial"
            message="Aún no registra servicios completados en el sistema."
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
  summarySection: {
    paddingHorizontal: LAYOUT.spacing.md,
    marginTop: LAYOUT.spacing.sm,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: LAYOUT.spacing.md,
    borderColor: COLORS.PRIMARY_GOLD,
    borderWidth: 1,
  },
  summaryEmoji: {
    fontSize: 32,
    marginRight: LAYOUT.spacing.md,
  },
  summaryStats: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: LAYOUT.typography.sizes.body,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    fontWeight: '600',
  },
  summaryCount: {
    fontSize: LAYOUT.typography.sizes.h2,
    fontWeight: '900',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  sectionHeaderContainer: {
    backgroundColor: COLORS.BG_DARK,
    paddingVertical: LAYOUT.spacing.sm,
    paddingHorizontal: LAYOUT.spacing.md,
  },
  sectionHeaderText: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  listContent: {
    paddingHorizontal: LAYOUT.spacing.md,
    paddingBottom: LAYOUT.spacing.lg,
    flexGrow: 1,
  },
  itemCard: {
    padding: LAYOUT.spacing.md,
    marginVertical: LAYOUT.spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.xs,
  },
  itemCode: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
  },
  itemBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WARRANTY_GREEN,
    fontFamily: 'System',
  },
  itemClient: {
    fontSize: LAYOUT.typography.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  itemSubText: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: LAYOUT.spacing.md,
    fontFamily: 'System',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_DARK,
    paddingTop: LAYOUT.spacing.sm,
  },
  itemAddress: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
  },
  itemDate: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
