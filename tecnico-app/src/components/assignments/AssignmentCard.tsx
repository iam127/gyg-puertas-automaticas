import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';
import Card from '../common/Card';
import Badge from '../common/Badge';

interface AssignmentCardProps {
  item: any;
  type: 'mantenimiento' | 'cotizacion';
  onPress: () => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ item, type, onPress }) => {
  // Common details extracted
  const code = item.codigo;
  const clientName = item.nombre_cliente;
  const district = item.distrito;
  const status = item.estado;
  
  // Specifics
  const subtitle = type === 'mantenimiento' 
    ? `Puerta: ${item.tipo_puerta || 'General'} (${item.tipo || 'mantenimiento'})`
    : `Uso: ${item.tipo_uso || 'Residencial'}`;

  // Get scheduled date from the first visit if available
  const visit = item.visitas && item.visitas.length > 0 ? item.visitas[0] : null;
  const dateStr = visit ? `${visit.fecha} a las ${visit.hora}` : 'Sin fecha agendada';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Servicio ${code} para ${clientName}. ${subtitle}. Estado: ${status}. Fecha: ${dateStr}`}
    >
      <Card style={styles.cardContainer} hasBorder>
        <View style={styles.headerRow}>
          <Text style={styles.codeText}>{code}</Text>
          <Badge status={status} type={type} />
        </View>

        <Text style={styles.clientText}>{clientName}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
        
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ubicación:</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {district} - {item.direccion}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Programado:</Text>
          <Text style={styles.infoValue}>📅 {dateStr}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: LAYOUT.spacing.sm,
    padding: LAYOUT.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.sm,
  },
  codeText: {
    fontSize: LAYOUT.typography.sizes.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GOLD,
    fontFamily: 'System',
  },
  clientText: {
    fontSize: LAYOUT.typography.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT.spacing.xs,
    fontFamily: 'System',
  },
  subtitleText: {
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: LAYOUT.spacing.md,
    fontFamily: 'System',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER_DARK,
    marginVertical: LAYOUT.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: LAYOUT.spacing.xs,
  },
  infoLabel: {
    width: 90,
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    fontSize: LAYOUT.typography.sizes.small,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
  },
});

export default AssignmentCard;
