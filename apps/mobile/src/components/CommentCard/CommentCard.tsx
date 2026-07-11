import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import { Comment } from '@/features/comments/api/commentsApi';

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const authorName = comment.author.name || comment.author.phone;

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {authorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.connector} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.bubble}>
          <View style={styles.header}>
            <Text style={styles.authorName}>{authorName}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.timestamp}>{formatDate(comment.createdAt)}</Text>
          </View>
          <Text style={styles.content}>{comment.content}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: colors.borderLight,
    marginTop: spacing.xs,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: spacing.xs,
  },
  bubble: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  authorName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  dot: {
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
    fontSize: 10,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  content: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
});
