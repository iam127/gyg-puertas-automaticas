import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

interface StatusBarProps { steps: string[]; currentStepIndex: number; }

export const StatusBar: React.FC<StatusBarProps> = ({ steps, currentStepIndex }) => (
  <View style={styles.container} accessibilityRole="image" accessibilityLabel={`Paso ${currentStepIndex + 1} de ${steps.length}`}>
    <View style={styles.row}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive    = index === currentStepIndex;
        const isInactive  = !isCompleted && !isActive;
        return (
          <React.Fragment key={step}>
            {index > 0 && (
              <View style={[styles.connector, index <= currentStepIndex ? styles.connectorActive : styles.connectorInactive]} />
            )}
            <View style={styles.step}>
              <View style={[styles.node, isCompleted && styles.nodeCompleted, isActive && styles.nodeActive, isInactive && styles.nodeInactive]}>
                {isCompleted
                  ? <MaterialIcons name="check" size={13} color={COLORS.WHITE} />
                  : isActive
                    ? <View style={styles.activeDot} />
                    : <View style={styles.inactiveDot} />}
              </View>
              <Text style={[styles.label, isActive ? styles.labelActive : isCompleted ? styles.labelDone : styles.labelInactive]} numberOfLines={2}>
                {step}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16, paddingHorizontal: 16,
    backgroundColor: COLORS.BG_SURFACE,
    borderRadius: 16, marginVertical: 6,
    borderWidth: 1, borderColor: COLORS.BORDER_DARK,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  step: { alignItems: 'center', flex: 1 },
  node: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 8 },
  nodeCompleted: { backgroundColor: COLORS.SUCCESS,        borderColor: COLORS.SUCCESS },
  nodeActive:    { backgroundColor: COLORS.PRIMARY_GOLD,   borderColor: COLORS.PRIMARY_GOLD },
  nodeInactive:  { backgroundColor: COLORS.BG_ELEVATED,    borderColor: COLORS.BORDER_DARK },
  activeDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.WHITE },
  inactiveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.TEXT_MUTED },
  connector: { flex: 1, height: 2, marginTop: 13, borderRadius: 1 },
  connectorActive:   { backgroundColor: COLORS.PRIMARY_GOLD },
  connectorInactive: { backgroundColor: COLORS.BORDER_DARK },
  label: { fontSize: 10, textAlign: 'center', fontFamily: 'System', fontWeight: '500', lineHeight: 14 },
  labelActive:   { color: COLORS.PRIMARY_GOLD_DARK, fontWeight: '700' },
  labelDone:     { color: COLORS.TEXT_SECONDARY },
  labelInactive: { color: COLORS.TEXT_MUTED },
});

export default StatusBar;