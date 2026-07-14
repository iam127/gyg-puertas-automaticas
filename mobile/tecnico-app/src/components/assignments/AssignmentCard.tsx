import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Card from '../common/Card';
import Badge from '../common/Badge';

interface AssignmentCardProps {
  item: any;
  type: 'mantenimiento' | 'cotizacion';
  onPress: () => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ item, type, onPress }) => {
  const isMant = type === 'mantenimiento';
  const visit = item.visitas?.[0] ?? null;
  const dateStr = visit ? `${visit.fecha}  ${visit.hora}` : 'Sin fecha agendada';
  const subtitle = isMant
    ? `${item.tipo_puerta || 'General'} · ${item.tipo || 'Mantenimiento'}`
    : `Uso ${item.tipo_uso || 'Residencial'}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityLabel={`Servicio ${item.codigo} para ${item.nombre_cliente}. Estado: ${item.estado}`}
    >
      <Card style={styles.card} hasBorder>
        {/* Franja de color por tipo */}
        <View style={[styles.typeStripe, { backgroundColor: isMant ? COLORS.PREVENTIVE_BLUE_BG : COLORS.CORRECTIVE_ORANGE_BG }]}>
          <MaterialIcons
            name={isMant ? 'build' : 'straighten'}
            size={13}
            color={isMant ? COLORS.PREVENTIVE_BLUE : COLORS.CORRECTIVE_ORANGE}
          />
          <Text style={[styles.typeLabel, { color: isMant ? COLORS.PREVENTIVE_BLUE : COLORS.CORRECTIVE_ORANGE }]}>
            {isMant ? 'MANTENIMIENTO' : 'VISITA TÉCNICA'}
          </Text>
        </View>

        {/* Header: código + badge */}
        <View style={styles.headerRow}>
          <Text style={styles.codeText}>{item.codigo}</Text>
          <Badge status={item.estado} type={type} />
        </View>

        {/* Cliente */}
        <Text style={styles.clientText}>{item.nombre_cliente}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>

        <View style={styles.divider} />

        {/* Ubicación */}
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={14} color={COLORS.TEXT_TERTIARY} />
          <Text style={styles.infoValue} numberOfLines={1}>
            {item.distrito} — {item.direccion}
          </Text>
        </View>

        {/* Fecha */}
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={14} color={COLORS.PRIMARY_GOLD} />
          <Text style={[styles.infoValue, styles.dateValue]}>{dateStr}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    padding: 0,
    overflow: 'hidden',
  },
  typeStripe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    marginBottom: 6,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  clientText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: 14,
    marginBottom: 2,
    fontFamily: 'System',
  },
  subtitleText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    paddingHorizontal: 14,
    marginBottom: 10,
    fontFamily: 'System',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER_SUBTLE,
    marginHorizontal: 14,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    marginBottom: 7,
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'System',
    fontWeight: '500',
  },
  dateValue: {
    color: COLORS.PRIMARY_GOLD_DARK,
    fontWeight: '600',
  },
});

export default AssignmentCard;