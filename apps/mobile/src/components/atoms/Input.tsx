import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftElement,
      rightElement,
      containerStyle,
      style,
      ...props
    },
    ref,
  ) => {
    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <View
          style={[
            styles.inputContainer,
            hasError && styles.inputContainerError,
            props.editable === false && styles.inputContainerDisabled,
          ]}
        >
          {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
          
          <TextInput
            ref={ref}
            style={[
              styles.input,
              !!leftElement && styles.inputWithLeft,
              !!rightElement && styles.inputWithRight,
              style,
            ]}
            placeholderTextColor={colors.textTertiary}
            {...props}
          />
          
          {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
        </View>
        
        {(error || hint) && (
          <Text style={[styles.hint, hasError && styles.errorText]}>
            {error || hint}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: colors.background,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputWithLeft: {
    paddingLeft: spacing.xs,
  },
  inputWithRight: {
    paddingRight: spacing.xs,
  },
  leftElement: {
    paddingLeft: spacing.md,
  },
  rightElement: {
    paddingRight: spacing.md,
  },
  hint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
  },
});
