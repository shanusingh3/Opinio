import * as Keychain from 'react-native-keychain';

import { User } from '@/features/auth/state/authTypes';
import { getStorage, StorageKeys } from './mmkv';

const KEYCHAIN_SERVICE = 'com.opinio.auth';
const TOKEN_KEY = 'auth_token';

interface StoredCredentials {
  token: string;
  user: User;
}

export class SecureStorage {
  private static instance: SecureStorage;

  private constructor() {}

  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  public static async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      if (credentials) {
        const parsed: StoredCredentials = JSON.parse(credentials.password);
        return parsed.token;
      }
      return null;
    } catch {
      return null;
    }
  }

  public static async getUser(): Promise<User | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      if (credentials) {
        const parsed: StoredCredentials = JSON.parse(credentials.password);
        return parsed.user;
      }
      return null;
    } catch {
      return null;
    }
  }

  public static async getCredentials(): Promise<StoredCredentials | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      if (credentials) {
        return JSON.parse(credentials.password) as StoredCredentials;
      }
      return null;
    } catch {
      return null;
    }
  }

  public static async setCredentials(
    token: string,
    user: User,
  ): Promise<boolean> {
    try {
      const data: StoredCredentials = { token, user };
      await Keychain.setGenericPassword(TOKEN_KEY, JSON.stringify(data), {
        service: KEYCHAIN_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      return true;
    } catch {
      return false;
    }
  }

  public static async clearCredentials(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
      return true;
    } catch {
      return false;
    }
  }

  public static async hasCredentials(): Promise<boolean> {
    const credentials = await SecureStorage.getCredentials();
    return credentials !== null;
  }
}

export class AppStorage {
  public static getString(key: string): string | null {
    return getStorage().getString(key) ?? null;
  }

  public static setString(key: string, value: string): void {
    getStorage().set(key, value);
  }

  public static getBoolean(key: string): boolean | null {
    return getStorage().getBoolean(key) ?? null;
  }

  public static setBoolean(key: string, value: boolean): void {
    getStorage().set(key, value);
  }

  public static getNumber(key: string): number | null {
    return getStorage().getNumber(key) ?? null;
  }

  public static setNumber(key: string, value: number): void {
    getStorage().set(key, value);
  }

  public static remove(key: string): void {
    getStorage().remove(key);
  }

  public static clearAll(): void {
    getStorage().clearAll();
  }
}

export { StorageKeys };
