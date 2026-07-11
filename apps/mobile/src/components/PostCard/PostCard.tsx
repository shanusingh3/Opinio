import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { colors, spacing, typography } from '@/theme';
import { Post, PostType } from '@/features/posts/api/postsApi';
import { PollOptions } from '../PollOptions/PollOptions';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onVote?: (optionId: string) => void;
  isLiked?: boolean;
  votedOptionId?: string | null;
  showFullContent?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onLike,
  onComment,
  onVote,
  isLiked = false,
  votedOptionId = null,
  showFullContent = false,
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

  const authorName = post.author.name || post.author.phone;
  const isPoll = post.type === PostType.POLL;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {authorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
            {isPoll && (
              <View style={styles.pollBadge}>
                <Text style={styles.pollBadgeText}>📊 Poll</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text
        style={styles.content}
        numberOfLines={showFullContent ? undefined : 4}
      >
        {post.content}
      </Text>

      {isPoll && post.poll && (
        <PollOptions
          options={post.poll.options}
          totalVotes={post.poll.totalVotes}
          votedOptionId={votedOptionId}
          onVote={onVote}
          endsAt={post.poll.endsAt}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, isLiked && styles.actionButtonActive]}
          onPress={onLike}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconContainer, isLiked && styles.likedIconContainer]}>
            <Text style={styles.actionIconText}>{isLiked ? '❤️' : '🤍'}</Text>
          </View>
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {post.likeCount > 0 ? post.likeCount : 'Like'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onComment}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIconText}>💬</Text>
          </View>
          <Text style={styles.actionText}>
            {post.commentCount > 0 ? post.commentCount : 'Comment'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIconText}>📤</Text>
          </View>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  authorName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  pollBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: spacing.sm,
  },
  pollBadgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.md,
    letterSpacing: 0.2,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  actionButtonActive: {
    backgroundColor: colors.errorLight,
  },
  actionIconContainer: {
    marginRight: spacing.xs,
  },
  likedIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  actionIconText: {
    fontSize: 16,
  },
  actionText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  likedText: {
    color: colors.error,
    fontWeight: '600',
  },
});
