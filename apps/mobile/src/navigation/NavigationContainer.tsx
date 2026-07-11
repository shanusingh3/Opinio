import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';

import { NavigationService } from '@/services/navigation/navigationService';

import { RootNavigator } from './RootNavigator';

export const NavigationContainer: React.FC = () => {
  return (
    <RNNavigationContainer ref={NavigationService.navigationRef}>
      <RootNavigator />
    </RNNavigationContainer>
  );
};
