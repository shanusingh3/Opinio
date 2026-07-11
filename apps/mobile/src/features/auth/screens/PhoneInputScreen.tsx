import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';
import { AuthScreenProps } from '@/navigation/types';
import { Routes } from '@/navigation/routes';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button, Text } from '@/components/atoms';
import { PhoneInput, Header } from '@/components/molecules';

type Props = AuthScreenProps<'PhoneInput'>;

export const PhoneInputScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { sendOtp, isLoading, error, clearAuthError } = useAuth();
  const [phone, setPhone] = useState('');

  const isValidPhone = phone.length >= 10;

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearAuthError }]);
    }
  }, [error, clearAuthError]);

  const handleSendOTP = async () => {
    if (!isValidPhone) return;

    const success = await sendOtp(phone);
    if (success) {
      navigation.navigate(Routes.Auth.OTPVerification, { phone });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <Header
        title=""
        leftIcon="←"
        onLeftPress={() => navigation.goBack()}
        transparent
      />

      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>
          Enter your phone number
        </Text>
        <Text variant="body" color="secondary" style={styles.subtitle}>
          We'll send you a verification code to confirm your identity
        </Text>

        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          countryCode="+91"
          autoFocus
        />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title={isLoading ? 'Sending...' : 'Continue'}
          onPress={handleSendOTP}
          disabled={!isValidPhone}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  countryCode: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  countryCodeText: {
    ...typography.body,
    color: colors.text,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.body,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: colors.border,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
