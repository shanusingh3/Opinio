import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';
import { MainScreenProps } from '@/navigation/types';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchUserPosts, selectUserPosts } from '@/features/posts/state';
import { Routes } from '@/navigation/routes';

type Props = MainScreenProps<'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const userPosts = useAppSelector(selectUserPosts);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserPosts({ userId: user.id }));
    }
  }, [dispatch, user?.id]);

  const handleLogout = async () => {
    await logout();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getInitials = () => {
    if (user?.phone) {
      return user.phone.slice(-2);
    }
    return '?';
  };

  const handleEditProfile = () => {
    navigation.navigate(Routes.Main.EditProfile);
  };

  const handleMyPosts = () => {
    navigation.navigate(Routes.Main.MyPosts);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>✓</Text>
            </View>
          </View>
          <Text style={styles.userName}>User</Text>
          <Text style={styles.phoneText}>+91 {user?.phone}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleEditProfile}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight + '20' }]}>
                <Text style={styles.menuIconText}>✏️</Text>
              </View>
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            activeOpacity={0.7}
            onPress={handleMyPosts}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.accent + '20' }]}>
                <Text style={styles.menuIconText}>📝</Text>
              </View>
              <Text style={styles.menuItemText}>My Posts</Text>
            </View>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom || spacing.lg }]}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 22,
    color: colors.text,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  avatarBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  phoneText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textTertiary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  menuIconText: {
    fontSize: 18,
  },
  menuItemText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  menuItemArrow: {
    fontSize: 22,
    color: colors.textTertiary,
    fontWeight: '300',
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: colors.errorLight,
    paddingVertical: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  logoutButtonText: {
    ...typography.button,
    color: colors.error,
    fontWeight: '600',
  },
});
