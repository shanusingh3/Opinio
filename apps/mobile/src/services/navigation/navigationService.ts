import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';

import { AuthStackParamList, MainStackParamList } from '@/navigation/types';
import { Routes } from '@/navigation/routes';

type RootStackParamList = AuthStackParamList & MainStackParamList;

class NavigationServiceClass {
  private static instance: NavigationServiceClass;
  public navigationRef = createNavigationContainerRef<RootStackParamList>();

  private constructor() {}

  public static getInstance(): NavigationServiceClass {
    if (!NavigationServiceClass.instance) {
      NavigationServiceClass.instance = new NavigationServiceClass();
    }
    return NavigationServiceClass.instance;
  }

  public isReady(): boolean {
    return this.navigationRef.isReady();
  }

  public navigate<T extends keyof RootStackParamList>(
    name: T,
    params?: RootStackParamList[T],
  ): void {
    if (this.navigationRef.isReady()) {
      // @ts-expect-error - Navigation types are complex with union params
      this.navigationRef.navigate(name, params);
    }
  }

  public goBack(): void {
    if (this.navigationRef.isReady() && this.navigationRef.canGoBack()) {
      this.navigationRef.goBack();
    }
  }

  public reset(routes: Array<{ name: string; params?: object }>): void {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes,
        }),
      );
    }
  }

  public resetToAuth(): void {
    this.reset([{ name: Routes.Auth.Welcome }]);
  }

  public resetToMain(): void {
    this.reset([{ name: Routes.Main.Home }]);
  }

  public push<T extends keyof RootStackParamList>(
    name: T,
    params?: RootStackParamList[T],
  ): void {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(StackActions.push(name as string, params));
    }
  }

  public replace<T extends keyof RootStackParamList>(
    name: T,
    params?: RootStackParamList[T],
  ): void {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(StackActions.replace(name as string, params));
    }
  }

  public popToTop(): void {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(StackActions.popToTop());
    }
  }

  public getCurrentRoute(): string | undefined {
    if (this.navigationRef.isReady()) {
      return this.navigationRef.getCurrentRoute()?.name;
    }
    return undefined;
  }
}

export const NavigationService = NavigationServiceClass.getInstance();
