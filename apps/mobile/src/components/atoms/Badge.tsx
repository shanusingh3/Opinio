import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  icon,
  style,
}) => {
  return (
    <View style={[styles.container, styles[variant], style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },

  // Variants
  primary: {
    backgroundColor: colors.primaryLight + '20',
  },
  primaryText: {
    color: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondaryLight + '20',
  },
  secondaryText: {
    color: colors.secondary,
  },
  success: {
    backgroundColor: colors.successLight,
  },
  successText: {
    color: colors.success,
  },
  warning: {
    backgroundColor: colors.warningLight,
  },
  warningText: {
    color: colors.warning,
  },
  error: {
    backgroundColor: colors.errorLight,
  },
  errorText: {
    color: colors.error,
  },
  neutral: {
    backgroundColor: colors.background,
  },
  neutralText: {
    color: colors.textSecondary,
  },
});
