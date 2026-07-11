import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { PostCard, CommentCard } from '@/components';
import { MainScreenProps } from '@/navigation/types';
import { likesService } from '@/features/likes/services/likesServiceRest';
import { votesService } from '@/features/votes/services/votesServiceRest';
import { commentsService } from '@/features/comments/services/commentsServiceRest';
import { Comment } from '@/features/comments/api/commentsApi';

import {
  fetchPostById,
  selectCurrentPost,
  selectPostsLoading,
  selectLikedPosts,
  selectVotedOptions,
  updatePostLikeCount,
  updatePollVote,
} from '../state';

type Props = MainScreenProps<'PostDetail'>;

export const PostDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { postId } = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const post = useAppSelector(selectCurrentPost);
  const isLoading = useAppSelector(selectPostsLoading);
  const likedPosts = useAppSelector(selectLikedPosts);
  const votedOptions = useAppSelector(selectVotedOptions);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    dispatch(fetchPostById(postId));
    loadComments();
  }, [dispatch, postId]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await commentsService.getByPostId(postId);
      setComments(data);
    } catch {
      // Handle error
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = useCallback(async () => {
    if (!post) return;
    const isLiked = likedPosts[post.id];
    dispatch(updatePostLikeCount({ postId: post.id, increment: !isLiked }));

    try {
      if (isLiked) {
        await likesService.unlikePost(post.id);
      } else {
        await likesService.likePost(post.id);
      }
    } catch {
      dispatch(updatePostLikeCount({ postId: post.id, increment: isLiked }));
    }
  }, [dispatch, post, likedPosts]);

  const handleVote = useCallback(
    async (optionId: string) => {
      if (!post) return;
      const currentVote = votedOptions[post.id];
      dispatch(
        updatePollVote({
          postId: post.id,
          oldOptionId: currentVote,
          newOptionId: optionId,
        }),
      );

      try {
        if (currentVote) {
          await votesService.changeVote({ pollOptionId: optionId });
        } else {
          await votesService.vote({ pollOptionId: optionId });
        }
      } catch {
        if (currentVote) {
          dispatch(
            updatePollVote({
              postId: post.id,
              oldOptionId: optionId,
              newOptionId: currentVote,
            }),
          );
        }
      }
    },
    [dispatch, post, votedOptions],
  );

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const comment = await commentsService.create({
        content: newComment.trim(),
        postId,
      });
      setComments([comment, ...comments]);
      setNewComment('');
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading && !post) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PostCard
          post={post}
          onLike={handleLike}
          onVote={handleVote}
          isLiked={likedPosts[post.id]}
          votedOptionId={votedOptions[post.id]}
          showFullContent
        />

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            Comments ({post.commentCount})
          </Text>

          {loadingComments ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.commentsLoader}
            />
          ) : comments.length === 0 ? (
            <Text style={styles.noComments}>No comments yet</Text>
          ) : (
            comments.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onLike={() => {}}
                onReply={() => {}}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || spacing.md }]}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor={colors.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newComment.trim() || isSubmitting) && styles.sendButtonDisabled,
          ]}
          onPress={handleSubmitComment}
          disabled={!newComment.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text style={styles.sendButtonText}>→</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    padding: spacing.xs,
  },
  backText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  commentsSection: {
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  commentsTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  commentsLoader: {
    paddingVertical: spacing.lg,
  },
  noComments: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    ...typography.body,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  sendButtonText: {
    color: colors.surface,
    fontSize: 20,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
