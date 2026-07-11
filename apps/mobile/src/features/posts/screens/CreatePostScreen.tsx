import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { MainScreenProps } from '@/navigation/types';
import { useAuth } from '@/features/auth/context/AuthContext';

import { createPost, selectPostsCreating } from '../state';
import { PostType } from '../api/postsApi';

type Props = MainScreenProps<'CreatePost'>;

export const CreatePostScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const isCreating = useAppSelector(selectPostsCreating);

  const [postType, setPostType] = useState<PostType>(PostType.QUESTION);
  const [content, setContent] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const isPoll = postType === PostType.POLL;
  const isValid =
    content.trim().length > 0 &&
    (!isPoll || pollOptions.filter(o => o.trim()).length >= 2);
  const charCount = content.length;
  const maxChars = 1000;
  const validOptionsCount = pollOptions.filter(o => o.trim()).length;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const getInitials = () => {
    if ((user as any)?.name) {
      return (user as any).name.slice(0, 2).toUpperCase();
    }
    if (user?.phone) {
      return user.phone.slice(-2);
    }
    return '?';
  };

  const getProgressColor = () => {
    const ratio = charCount / maxChars;
    if (ratio > 0.9) return colors.error;
    if (ratio > 0.7) return colors.warning;
    return colors.primary;
  };

  const handleAddOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!isValid || isCreating) return;

    try {
      const result = await dispatch(
        createPost({
          type: postType,
          content: content.trim(),
          ...(isPoll && {
            pollOptions: pollOptions
              .filter(o => o.trim())
              .map(text => ({ text: text.trim() })),
          }),
        }),
      );

      if (createPost.fulfilled.match(result)) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to create post. Please try again.');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleBack = () => {
    if (content.trim() || pollOptions.some(o => o.trim())) {
      Alert.alert(
        'Discard Post?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Gradient Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerGradient} />
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>New Post</Text>
            <Text style={styles.headerSubtitle}>
              {isPoll ? 'Create a poll' : 'Ask a question'}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.publishButton,
              (!isValid || isCreating) && styles.publishButtonDisabled,
            ]}
            disabled={!isValid || isCreating}
            activeOpacity={0.8}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Text style={styles.publishIcon}>✓</Text>
                <Text style={styles.publishButtonText}>Post</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Post Type Toggle */}
        <View style={styles.typeToggleContainer}>
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeToggleOption,
                postType === PostType.QUESTION && styles.typeToggleActive,
              ]}
              onPress={() => setPostType(PostType.QUESTION)}
              activeOpacity={0.8}
            >
              <Text style={styles.typeToggleIcon}>💭</Text>
              <Text style={[
                styles.typeToggleText,
                postType === PostType.QUESTION && styles.typeToggleTextActive,
              ]}>
                Question
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeToggleOption,
                postType === PostType.POLL && styles.typeToggleActive,
              ]}
              onPress={() => setPostType(PostType.POLL)}
              activeOpacity={0.8}
            >
              <Text style={styles.typeToggleIcon}>📊</Text>
              <Text style={[
                styles.typeToggleText,
                postType === PostType.POLL && styles.typeToggleTextActive,
              ]}>
                Poll
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          {/* Author Info */}
          <View style={styles.authorSection}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{(user as any)?.name || 'You'}</Text>
              <View style={styles.visibilityBadge}>
                <Text style={styles.visibilityIcon}>🌍</Text>
                <Text style={styles.visibilityText}>Public</Text>
              </View>
            </View>
          </View>

          {/* Content Input */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.contentInput}
              placeholder={
                isPoll
                  ? "What do you want to ask?"
                  : "What's on your mind?"
              }
              placeholderTextColor={colors.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={maxChars}
              autoFocus
            />
          </View>

          {/* Character Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min((charCount / maxChars) * 100, 100)}%`,
                    backgroundColor: getProgressColor(),
                  }
                ]} 
              />
            </View>
            <Text style={[
              styles.charCount,
              charCount > maxChars * 0.9 && styles.charCountWarning,
            ]}>
              {charCount}/{maxChars}
            </Text>
          </View>
        </View>

        {/* Poll Options */}
        {isPoll && (
          <View style={styles.pollCard}>
            <View style={styles.pollHeader}>
              <View style={styles.pollTitleRow}>
                <Text style={styles.pollIcon}>📊</Text>
                <Text style={styles.pollTitle}>Poll Options</Text>
              </View>
              <View style={styles.optionCountBadge}>
                <Text style={styles.optionCountText}>
                  {validOptionsCount}/{pollOptions.length}
                </Text>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              {pollOptions.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <View style={[
                    styles.optionNumber,
                    option.trim() && styles.optionNumberFilled,
                  ]}>
                    <Text style={[
                      styles.optionNumberText,
                      option.trim() && styles.optionNumberTextFilled,
                    ]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.optionInputWrapper}>
                    <TextInput
                      style={[
                        styles.optionInput,
                        option.trim() && styles.optionInputFilled,
                      ]}
                      placeholder={`Option ${index + 1}`}
                      placeholderTextColor={colors.textTertiary}
                      value={option}
                      onChangeText={value => handleOptionChange(index, value)}
                      maxLength={100}
                    />
                    {option.trim() && (
                      <View style={styles.optionCheckmark}>
                        <Text style={styles.optionCheckmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                  {pollOptions.length > 2 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveOption(index)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {pollOptions.length < 6 && (
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={handleAddOption}
                activeOpacity={0.7}
              >
                <View style={styles.addOptionIcon}>
                  <Text style={styles.addOptionIconText}>+</Text>
                </View>
                <Text style={styles.addOptionText}>Add option</Text>
                <Text style={styles.addOptionHint}>({6 - pollOptions.length} left)</Text>
              </TouchableOpacity>
            )}

            {validOptionsCount < 2 && (
              <View style={styles.warningBanner}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningText}>
                  Add at least 2 options to create a poll
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for great posts</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Keep it clear and concise</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Ask open-ended questions</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Be respectful and inclusive</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  publishIcon: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginRight: 4,
  },
  publishButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  typeToggleContainer: {
    marginBottom: spacing.md,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  typeToggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  typeToggleActive: {
    backgroundColor: colors.primary,
  },
  typeToggleIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  typeToggleText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeToggleTextActive: {
    color: colors.white,
  },
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  authorInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  authorName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  visibilityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  visibilityText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  inputSection: {
    marginBottom: spacing.md,
  },
  contentInput: {
    minHeight: 140,
    ...typography.body,
    color: colors.text,
    textAlignVertical: 'top',
    fontSize: 18,
    lineHeight: 28,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  charCount: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'right',
  },
  charCountWarning: {
    color: colors.error,
  },
  pollCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pollTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  pollTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  optionCountBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  optionCountText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  optionsContainer: {
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  optionNumberFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionNumberText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    fontWeight: '700',
  },
  optionNumberTextFilled: {
    color: colors.white,
  },
  optionInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  optionInput: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingRight: spacing.xl,
    ...typography.body,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  optionInputFilled: {
    borderColor: colors.success,
    backgroundColor: colors.successLight + '10',
  },
  optionCheckmark: {
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    marginTop: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCheckmarkText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  removeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: 18,
  },
  removeButtonText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
  },
  addOptionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  addOptionIconText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  addOptionText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  addOptionHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    padding: spacing.sm,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  warningIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  warningText: {
    ...typography.bodySmall,
    color: colors.warning,
    flex: 1,
  },
  tipsCard: {
    backgroundColor: colors.primaryLight + '10',
    borderRadius: 20,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight + '30',
  },
  tipsTitle: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  tipBullet: {
    color: colors.primary,
    marginRight: spacing.xs,
    fontSize: 14,
  },
  tipText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});
