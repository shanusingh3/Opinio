import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import { Comment } from '@/features/comments/api/commentsApi';

interface CommentCardProps {
  comment: Comment;
  onLike?: () => void;
  onReply?: () => void;
  onViewReplies?: () => void;
  isLiked?: boolean;
  isReply?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  onViewReplies,
  isLiked = false,
  isReply = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const authorName = comment.author.name || comment.author.phone;
  const replyCount = comment._count?.replies || 0;

  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      <View style={styles.header}>
        <View style={[styles.avatar, isReply && styles.replyAvatar]}>
          <Text style={[styles.avatarText, isReply && styles.replyAvatarText]}>
            {authorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.timestamp}>{formatDate(comment.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.content}>{comment.content}</Text>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {comment.likeCount}
          </Text>
        </TouchableOpacity>

        {!isReply && (
          <TouchableOpacity style={styles.actionButton} onPress={onReply}>
            <Text style={styles.actionIcon}>↩️</Text>
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        )}

        {!isReply && replyCount > 0 && (
          <TouchableOpacity style={styles.actionButton} onPress={onViewReplies}>
            <Text style={styles.viewRepliesText}>
              View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  replyContainer: {
    marginLeft: spacing.xl,
    borderBottomWidth: 0,
    paddingVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  replyAvatarText: {
    fontSize: 11,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  content: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 32 + spacing.sm,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    marginLeft: 32 + spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  likedIcon: {
    color: colors.error,
  },
  likedText: {
    color: colors.error,
  },
  viewRepliesText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
});
