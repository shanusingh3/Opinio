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

import { createPost, selectPostsCreating } from '../state';
import { PostType } from '../api/postsApi';

type Props = MainScreenProps<'CreatePost'>;

export const CreatePostScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const isCreating = useAppSelector(selectPostsCreating);

  const [postType, setPostType] = useState<PostType>(PostType.QUESTION);
  const [content, setContent] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const isPoll = postType === PostType.POLL;
  const isValid =
    content.trim().length > 0 &&
    (!isPoll || pollOptions.filter(o => o.trim()).length >= 2);

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
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.postButton,
            (!isValid || isCreating) && styles.postButtonDisabled,
          ]}
          disabled={!isValid || isCreating}
          activeOpacity={0.8}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              postType === PostType.QUESTION && styles.typeButtonActive,
            ]}
            onPress={() => setPostType(PostType.QUESTION)}
          >
            <Text
              style={[
                styles.typeButtonText,
                postType === PostType.QUESTION && styles.typeButtonTextActive,
              ]}
            >
              Question
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              postType === PostType.POLL && styles.typeButtonActive,
            ]}
            onPress={() => setPostType(PostType.POLL)}
          >
            <Text
              style={[
                styles.typeButtonText,
                postType === PostType.POLL && styles.typeButtonTextActive,
              ]}
            >
              Poll
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.contentInput}
          placeholder={
            isPoll
              ? "What would you like to ask?"
              : "What's on your mind?"
          }
          placeholderTextColor={colors.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={1000}
          autoFocus
        />

        {isPoll && (
          <View style={styles.pollSection}>
            <Text style={styles.pollSectionTitle}>Poll Options</Text>

            {pollOptions.map((option, index) => (
              <View key={index} style={styles.optionRow}>
                <TextInput
                  style={styles.optionInput}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor={colors.textSecondary}
                  value={option}
                  onChangeText={value => handleOptionChange(index, value)}
                  maxLength={100}
                />
                {pollOptions.length > 2 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveOption(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {pollOptions.length < 6 && (
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={handleAddOption}
              >
                <Text style={styles.addOptionText}>+ Add Option</Text>
              </TouchableOpacity>
            )}
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
    fontSize: 28,
    color: colors.textSecondary,
    marginTop: -2,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  postButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  postButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xs,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  contentInput: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    minHeight: 140,
    ...typography.body,
    color: colors.text,
    textAlignVertical: 'top',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  pollSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  pollSectionTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optionInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    fontSize: 20,
    color: colors.error,
    fontWeight: '500',
  },
  addOptionButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    marginTop: spacing.xs,
  },
  addOptionText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
