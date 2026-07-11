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
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {authorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
        </View>
        {isPoll && (
          <View style={styles.pollBadge}>
            <Text style={styles.pollBadgeText}>Poll</Text>
          </View>
        )}
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
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {post.likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.commentCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  authorName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pollBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  pollBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionIcon: {
    fontSize: 16,
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
});
