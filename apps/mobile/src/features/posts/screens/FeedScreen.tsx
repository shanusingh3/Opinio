import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { PostCard } from '@/components';
import { MainScreenProps } from '@/navigation/types';
import { Routes } from '@/navigation/routes';
import { likesService } from '@/features/likes/services/likesServiceRest';
import { votesService } from '@/features/votes/services/votesServiceRest';

import {
  fetchFeed,
  selectFeed,
  selectPostsLoading,
  selectPostsRefreshing,
  selectHasMore,
  selectLikedPosts,
  selectVotedOptions,
  updatePostLikeCount,
  updatePollVote,
} from '../state';
import { Post } from '../api/postsApi';

type Props = MainScreenProps<'Feed'>;

export const FeedScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const feed = useAppSelector(selectFeed);
  const isLoading = useAppSelector(selectPostsLoading);
  const isRefreshing = useAppSelector(selectPostsRefreshing);
  const hasMore = useAppSelector(selectHasMore);
  const likedPosts = useAppSelector(selectLikedPosts);
  const votedOptions = useAppSelector(selectVotedOptions);

  useEffect(() => {
    dispatch(fetchFeed({ skip: 0, take: 20, isRefresh: true }));
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchFeed({ skip: 0, take: 20, isRefresh: true }));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(fetchFeed({ skip: feed.length, take: 20 }));
    }
  }, [dispatch, feed.length, hasMore, isLoading]);

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

  const handleCreatePost = useCallback(() => {
    navigation.navigate(Routes.Main.CreatePost);
  }, [navigation]);

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

  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>
          Be the first to share something!
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={feed}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
