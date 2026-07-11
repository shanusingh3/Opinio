import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';
import { MainScreenProps } from '@/navigation/types';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchUserPosts,
  selectUserPosts,
  selectPostsLoading,
  selectLikedPosts,
  selectVotedOptions,
  updatePostLikeCount,
  updatePollVote,
} from '@/features/posts/state';
import { PostCard } from '@/components';
import { Post } from '@/features/posts/api/postsApi';
import { Routes } from '@/navigation/routes';
import { likesService } from '@/features/likes/services/likesServiceRest';
import { votesService } from '@/features/votes/services/votesServiceRest';

type Props = MainScreenProps<'MyPosts'>;

export const MyPostsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const userPosts = useAppSelector(selectUserPosts);
  const isLoading = useAppSelector(selectPostsLoading);
  const likedPosts = useAppSelector(selectLikedPosts);
  const votedOptions = useAppSelector(selectVotedOptions);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserPosts({ userId: user.id }));
    }
  }, [dispatch, user?.id]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePostPress = useCallback(
    (post: Post) => {
      navigation.navigate(Routes.Main.PostDetail, { postId: post.id });
    },
    [navigation],
  );

  const handleLike = useCallback(
    async (post: Post) => {
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
    },
    [dispatch, likedPosts],
  );

  const handleComment = useCallback(
    (post: Post) => {
      navigation.navigate(Routes.Main.PostDetail, { postId: post.id });
    },
    [navigation],
  );

  const handleVote = useCallback(
    async (post: Post, optionId: string) => {
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
    [dispatch, votedOptions],
  );

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        onPress={() => handlePostPress(item)}
        onLike={() => handleLike(item)}
        onComment={() => handleComment(item)}
        onVote={optionId => handleVote(item, optionId)}
        isLiked={likedPosts[item.id]}
        votedOptionId={votedOptions[item.id]}
      />
    ),
    [handlePostPress, handleLike, handleComment, handleVote, likedPosts, votedOptions],
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📝</Text>
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>
          Your posts will appear here
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate(Routes.Main.CreatePost)}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>Create your first post</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Posts</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading && userPosts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    fontSize: 22,
    color: colors.text,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  createButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
