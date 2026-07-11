import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Share,
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
  onDelete?: () => void;
  isLiked?: boolean;
  votedOptionId?: string | null;
  showFullContent?: boolean;
  showDeleteOption?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onLike,
  onComment,
  onVote,
  onDelete,
  isLiked = false,
  votedOptionId = null,
  showFullContent = false,
  showDeleteOption = false,
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

  const handleShare = async () => {
    try {
      const postType = isPoll ? 'poll' : 'question';
      const message = `Check out this ${postType} on Opinio:\n\n"${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''}"\n\nDownload Opinio to join the conversation!`;
      
      await Share.share({
        message,
        title: `Opinio - ${authorName}'s ${postType}`,
      });
    } catch (error) {
      // User cancelled or share failed - silently ignore
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      {/* Gradient accent bar */}
      <View style={styles.accentBar} />
      
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {authorName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{authorName}</Text>
              {isPoll && (
                <View style={styles.pollBadge}>
                  <Text style={styles.pollBadgeIcon}>📊</Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          </View>
          
          {showDeleteOption && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteIcon}>�️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text
            style={styles.content}
            numberOfLines={showFullContent ? undefined : 4}
          >
            {post.content}
          </Text>
        </View>

        {/* Poll */}
        {isPoll && post.poll && (
          <View style={styles.pollContainer}>
            <PollOptions
              options={post.poll.options}
              totalVotes={post.poll.totalVotes}
              votedOptionId={votedOptionId}
              onVote={onVote}
              endsAt={post.poll.endsAt}
            />
          </View>
        )}

        {/* Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.actionButtonActive]}
            onPress={onLike}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {post.likeCount > 0 ? post.likeCount : 'Like'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onComment}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>
              {post.commentCount > 0 ? post.commentCount : 'Comment'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    overflow: 'hidden',
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.08,
  },
  accentBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  cardContent: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
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
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  pollBadge: {
    marginLeft: spacing.xs,
  },
  pollBadgeIcon: {
    fontSize: 14,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
  },
  contentContainer: {
    marginBottom: spacing.sm,
  },
  content: {
    ...typography.body,
    color: colors.text,
    lineHeight: 26,
    fontSize: 16,
  },
  pollContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
  },
  actionButtonActive: {
    backgroundColor: colors.errorLight,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  likedIcon: {
    transform: [{ scale: 1.1 }],
  },
  actionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  likedText: {
    color: colors.error,
  },
});
