import { createMMKV, type MMKV } from 'react-native-mmkv';

let storageInstance: MMKV | null = null;

export const getStorage = (): MMKV => {
  if (!storageInstance) {
    storageInstance = createMMKV({
      id: 'opinio-storage',
      encryptionKey: 'opinio-secure-key',
    });
  }
  return storageInstance;
};

export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const;
