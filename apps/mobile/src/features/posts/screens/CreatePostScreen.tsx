import React, { useState } from 'react';
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

  const getInitials = () => {
    if (user?.phone) {
      return user.phone.slice(-2);
    }
    return '?';
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Create Post</Text>
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
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.publishButtonText}>Publish</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Post Type Selector */}
        <View style={styles.typeSelectorCard}>
          <Text style={styles.sectionLabel}>POST TYPE</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                postType === PostType.QUESTION && styles.typeOptionActive,
              ]}
              onPress={() => setPostType(PostType.QUESTION)}
              activeOpacity={0.7}
            >
              <Text style={styles.typeIcon}>💭</Text>
              <Text
                style={[
                  styles.typeText,
                  postType === PostType.QUESTION && styles.typeTextActive,
                ]}
              >
                Question
              </Text>
              <Text style={styles.typeDescription}>
                Ask anything
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeOption,
                postType === PostType.POLL && styles.typeOptionActive,
              ]}
              onPress={() => setPostType(PostType.POLL)}
              activeOpacity={0.7}
            >
              <Text style={styles.typeIcon}>📊</Text>
              <Text
                style={[
                  styles.typeText,
                  postType === PostType.POLL && styles.typeTextActive,
                ]}
              >
                Poll
              </Text>
              <Text style={styles.typeDescription}>
                Get opinions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Input Card */}
        <View style={styles.contentCard}>
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>You</Text>
              <Text style={styles.postingAs}>Posting publicly</Text>
            </View>
          </View>

          <TextInput
            style={styles.contentInput}
            placeholder={
              isPoll
                ? "What would you like to ask your audience?"
                : "Share your thoughts, ask a question..."
            }
            placeholderTextColor={colors.textTertiary}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={maxChars}
            autoFocus
          />

          <View style={styles.charCountRow}>
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
              <Text style={styles.sectionLabel}>POLL OPTIONS</Text>
              <Text style={styles.optionCount}>
                {pollOptions.filter(o => o.trim()).length} of {pollOptions.length}
              </Text>
            </View>

            {pollOptions.map((option, index) => (
              <View key={index} style={styles.optionRow}>
                <View style={styles.optionNumber}>
                  <Text style={styles.optionNumberText}>{index + 1}</Text>
                </View>
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

            {pollOptions.length < 6 && (
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={handleAddOption}
                activeOpacity={0.7}
              >
                <View style={styles.addOptionIcon}>
                  <Text style={styles.addOptionIconText}>+</Text>
                </View>
                <Text style={styles.addOptionText}>Add another option</Text>
              </TouchableOpacity>
            )}

            <View style={styles.pollTip}>
              <Text style={styles.pollTipIcon}>💡</Text>
              <Text style={styles.pollTipText}>
                Add 2-6 options. Keep them short and clear.
              </Text>
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  publishButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  publishButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  publishButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  typeSelectorCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeOption: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeOptionActive: {
    backgroundColor: colors.primaryLight + '15',
    borderColor: colors.primary,
  },
  typeIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  typeText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  typeTextActive: {
    color: colors.primary,
  },
  typeDescription: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  postingAs: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  contentInput: {
    minHeight: 120,
    ...typography.body,
    color: colors.text,
    textAlignVertical: 'top',
    fontSize: 17,
    lineHeight: 24,
  },
  charCountRow: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  charCount: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  charCountWarning: {
    color: colors.warning,
  },
  pollCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  optionCount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  optionNumberText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
  optionInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  optionInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '08',
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: 16,
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
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    marginTop: spacing.xs,
  },
  addOptionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  addOptionIconText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  addOptionText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  pollTip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  pollTipIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  pollTipText: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
  },
});
