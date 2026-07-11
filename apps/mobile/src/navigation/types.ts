import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Welcome: undefined;
  PhoneInput: undefined;
  OTPVerification: { phone: string };
};

export type MainStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  Profile: undefined;
  MyPosts: undefined;
  EditProfile: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;
