import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FeedScreen, PostDetailScreen, CreatePostScreen } from '@/features/posts/screens';
import { Routes } from './routes';
import { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.Main.Feed}
        component={FeedScreen}
      />
      <Stack.Screen
        name={Routes.Main.PostDetail}
        component={PostDetailScreen}
      />
      <Stack.Screen
        name={Routes.Main.CreatePost}
        component={CreatePostScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
