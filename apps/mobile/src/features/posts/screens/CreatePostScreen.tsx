import React, { useState, useCallback } from 'react';
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
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.headerButton}
          disabled={!isValid || isCreating}
        >
          <Text
            style={[
              styles.postText,
              (!isValid || isCreating) && styles.postTextDisabled,
            ]}
          >
            {isCreating ? 'Posting...' : 'Post'}
          </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: spacing.xs,
    minWidth: 60,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  cancelText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  postText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  postTextDisabled: {
    color: colors.border,
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
    borderRadius: 8,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: colors.surface,
  },
  contentInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    minHeight: 120,
    ...typography.body,
    color: colors.text,
    textAlignVertical: 'top',
  },
  pollSection: {
    marginTop: spacing.md,
  },
  pollSectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  optionInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  removeButtonText: {
    fontSize: 24,
    color: colors.error,
  },
  addOptionButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  addOptionText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
});
