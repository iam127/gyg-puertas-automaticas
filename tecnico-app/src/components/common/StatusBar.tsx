import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import LAYOUT from '../../constants/layout';

interface StatusBarProps {
  steps: string[];
  currentStepIndex: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ steps, currentStepIndex }) => {
  return (
    <View style={styles.container} accessibilityRole="image" accessibilityLabel={`Progreso actual: paso ${currentStepIndex + 1} de ${steps.length}`}>
      <View style={styles.timelineContainer}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          
          return (
            <React.Fragment key={step}>
              {/* Line connector between nodes */}
              {index > 0 && (
                <View 
                  style={[
                    styles.connector, 
                    index <= currentStepIndex ? styles.connectorActive : styles.connectorInactive
                  ]} 
                />
              )}
              
              {/* Step Node */}
              <View style={styles.stepWrapper}>
                <View 
                  style={[
                    styles.node,
                    isCompleted && styles.nodeCompleted,
                    isActive && styles.nodeActive,
                    !isCompleted && !isActive && styles.nodeInactive
                  ]}
                >
                  {isCompleted ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <View style={[styles.innerCircle, isActive && styles.innerCircleActive]} />
                  )}
                </View>
                <Text 
                  style={[
                    styles.label,
                    (isCompleted || isActive) ? styles.labelActive : styles.labelInactive
                  ]}
                  numberOfLines={2}
                >
                  {step}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: LAYOUT.spacing.md,
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: LAYOUT.borderRadius.lg,
    marginVertical: LAYOUT.spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.BORDER_DARK,
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.spacing.md,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: LAYOUT.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 2,
  },
  nodeCompleted: {
    backgroundColor: COLORS.WARRANTY_GREEN,
    borderColor: COLORS.WARRANTY_GREEN,
  },
  nodeActive: {
    backgroundColor: COLORS.BG_DARK,
    borderColor: COLORS.PRIMARY_GOLD,
  },
  nodeInactive: {
    backgroundColor: COLORS.BG_DARK,
    borderColor: COLORS.BORDER_DARK,
  },
  checkmark: {
    color: COLORS.BG_DARK,
    fontSize: 12,
    fontWeight: 'bold',
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: LAYOUT.borderRadius.round,
    backgroundColor: COLORS.BORDER_DARK,
  },
  innerCircleActive: {
    backgroundColor: COLORS.PRIMARY_GOLD,
  },
  connector: {
    flex: 1,
    height: 2,
    marginTop: -20, // Align with the center of the nodes
    zIndex: 1,
  },
  connectorActive: {
    backgroundColor: COLORS.PRIMARY_GOLD,
  },
  connectorInactive: {
    backgroundColor: COLORS.BORDER_DARK,
  },
  label: {
    fontSize: 10,
    marginTop: LAYOUT.spacing.xs,
    textAlign: 'center',
    fontFamily: 'System',
    fontWeight: '600',
  },
  labelActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  labelInactive: {
    color: COLORS.TEXT_SECONDARY,
  },
});

export default StatusBar;
