import React from 'react';
import { Text as RNText, StyleSheet, TextStyle, TextProps as RNTextProps } from 'react-native';
import { colors, typography } from '@/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'button';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'white';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  weight,
  align,
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles[variant],
        styles[`color_${color}`],
        weight && styles[`weight_${weight}`],
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  // Variants
  h1: {
    ...typography.h1,
    color: colors.text,
  },
  h2: {
    ...typography.h2,
    color: colors.text,
  },
  h3: {
    ...typography.h3,
    color: colors.text,
  },
  body: {
    ...typography.body,
    color: colors.text,
  },
  bodySmall: {
    ...typography.bodySmall,
    color: colors.text,
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  button: {
    ...typography.button,
    color: colors.text,
  },

  // Colors
  color_primary: {
    color: colors.text,
  },
  color_secondary: {
    color: colors.textSecondary,
  },
  color_tertiary: {
    color: colors.textTertiary,
  },
  color_error: {
    color: colors.error,
  },
  color_success: {
    color: colors.success,
  },
  color_white: {
    color: colors.white,
  },

  // Weights
  weight_normal: {
    fontWeight: '400',
  },
  weight_medium: {
    fontWeight: '500',
  },
  weight_semibold: {
    fontWeight: '600',
  },
  weight_bold: {
    fontWeight: '700',
  },
});
