import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  expiry?: number;
}

export class StorageService {
  // Regular storage keys
  private static readonly STORAGE_KEYS = {
    USER_PREFERENCES: 'user_preferences',
    LANGUAGE: 'app_language',
    THEME: 'app_theme',
    LOCATION_PERMISSION: 'location_permission',
    NOTIFICATION_SETTINGS: 'notification_settings',
    SEARCH_HISTORY: 'search_history',
    RECENT_ADDRESSES: 'recent_addresses',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    APP_VERSION: 'app_version',
    CART_DATA: 'cart_data',
    BOOKING_DRAFT: 'booking_draft',
  } as const;

  // Secure storage keys (for sensitive data)
  private static readonly SECURE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_CREDENTIALS: 'user_credentials',
    PAYMENT_METHODS: 'payment_methods',
    BIOMETRIC_ENABLED: 'biometric_enabled',
  } as const;

  // Regular AsyncStorage methods
  static async setItem<T>(key: keyof typeof StorageService.STORAGE_KEYS, value: T, expiryHours?: number): Promise<boolean> {
    try {
      const storageItem: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiry: expiryHours ? Date.now() + (expiryHours * 60 * 60 * 1000) : undefined,
      };

      const actualKey = this.STORAGE_KEYS[key];
      await AsyncStorage.setItem(actualKey, JSON.stringify(storageItem));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  static async getItem<T>(key: keyof typeof StorageService.STORAGE_KEYS): Promise<T | null> {
    try {
      const actualKey = this.STORAGE_KEYS[key];
      const stored = await AsyncStorage.getItem(actualKey);
      
      if (!stored) return null;

      const storageItem: StorageItem<T> = JSON.parse(stored);

      // Check expiry
      if (storageItem.expiry && Date.now() > storageItem.expiry) {
        await this.removeItem(key);
        return null;
      }

      return storageItem.value;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  static async removeItem(key: keyof typeof StorageService.STORAGE_KEYS): Promise<boolean> {
    try {
      const actualKey = this.STORAGE_KEYS[key];
      await AsyncStorage.removeItem(actualKey);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  static async clear(): Promise<boolean> {
    try {
      const keys = Object.values(this.STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Secure storage methods (for sensitive data)
  static async setSecureItem<T>(key: keyof typeof StorageService.SECURE_KEYS, value: T): Promise<boolean> {
    try {
      const actualKey = this.SECURE_KEYS[key];
      const storageItem: StorageItem<T> = {
        value,
        timestamp: Date.now(),
      };

      await SecureStore.setItemAsync(actualKey, JSON.stringify(storageItem));
      return true;
    } catch (error) {
      console.error(`Error setting secure item ${key}:`, error);
      return false;
    }
  }

  static async getSecureItem<T>(key: keyof typeof StorageService.SECURE_KEYS): Promise<T | null> {
    try {
      const actualKey = this.SECURE_KEYS[key];
      const stored = await SecureStore.getItemAsync(actualKey);
      
      if (!stored) return null;

      const storageItem: StorageItem<T> = JSON.parse(stored);
      return storageItem.value;
    } catch (error) {
      console.error(`Error getting secure item ${key}:`, error);
      return null;
    }
  }

  static async removeSecureItem(key: keyof typeof StorageService.SECURE_KEYS): Promise<boolean> {
    try {
      const actualKey = this.SECURE_KEYS[key];
      await SecureStore.deleteItemAsync(actualKey);
      return true;
    } catch (error) {
      console.error(`Error removing secure item ${key}:`, error);
      return false;
    }
  }

  static async clearSecureStorage(): Promise<boolean> {
    try {
      const keys = Object.values(this.SECURE_KEYS);
      for (const key of keys) {
        await SecureStore.deleteItemAsync(key);
      }
      return true;
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      return false;
    }
  }

  // Specific utility methods
  static async saveUserPreferences(preferences: any): Promise<boolean> {
    return this.setItem('USER_PREFERENCES', preferences);
  }

  static async getUserPreferences(): Promise<any> {
    return this.getItem('USER_PREFERENCES');
  }

  static async saveLanguage(language: string): Promise<boolean> {
    return this.setItem('LANGUAGE', language);
  }

  static async getLanguage(): Promise<string | null> {
    return this.getItem('LANGUAGE');
  }

  static async saveTheme(theme: 'light' | 'dark'): Promise<boolean> {
    return this.setItem('THEME', theme);
  }

  static async getTheme(): Promise<'light' | 'dark' | null> {
    return this.getItem('THEME');
  }

  static async saveSearchHistory(searches: string[]): Promise<boolean> {
    // Keep only last 10 searches
    const limitedSearches = searches.slice(-10);
    return this.setItem('SEARCH_HISTORY', limitedSearches);
  }

  static async getSearchHistory(): Promise<string[]> {
    const history = await this.getItem<string[]>('SEARCH_HISTORY');
    return history || [];
  }

  static async addToSearchHistory(searchTerm: string): Promise<boolean> {
    const currentHistory = await this.getSearchHistory();
    
    // Remove if already exists to avoid duplicates
    const filteredHistory = currentHistory.filter(term => term !== searchTerm);
    
    // Add to beginning
    const updatedHistory = [searchTerm, ...filteredHistory];
    
    return this.saveSearchHistory(updatedHistory);
  }

  static async saveRecentAddresses(addresses: any[]): Promise<boolean> {
    // Keep only last 5 addresses
    const limitedAddresses = addresses.slice(-5);
    return this.setItem('RECENT_ADDRESSES', limitedAddresses);
  }

  static async getRecentAddresses(): Promise<any[]> {
    const addresses = await this.getItem<any[]>('RECENT_ADDRESSES');
    return addresses || [];
  }

  static async addToRecentAddresses(address: any): Promise<boolean> {
    const currentAddresses = await this.getRecentAddresses();
    
    // Remove if already exists to avoid duplicates
    const filteredAddresses = currentAddresses.filter(addr => 
      addr.formatted_address !== address.formatted_address
    );
    
    // Add to beginning
    const updatedAddresses = [address, ...filteredAddresses];
    
    return this.saveRecentAddresses(updatedAddresses);
  }

  static async saveAuthToken(token: string): Promise<boolean> {
    return this.setSecureItem('AUTH_TOKEN', token);
  }

  static async getAuthToken(): Promise<string | null> {
    return this.getSecureItem('AUTH_TOKEN');
  }

  static async saveRefreshToken(token: string): Promise<boolean> {
    return this.setSecureItem('REFRESH_TOKEN', token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return this.getSecureItem('REFRESH_TOKEN');
  }

  static async clearAuthTokens(): Promise<boolean> {
    const tokenCleared = await this.removeSecureItem('AUTH_TOKEN');
    const refreshTokenCleared = await this.removeSecureItem('REFRESH_TOKEN');
    return tokenCleared && refreshTokenCleared;
  }

  static async setOnboardingCompleted(completed: boolean = true): Promise<boolean> {
    return this.setItem('ONBOARDING_COMPLETED', completed);
  }

  static async isOnboardingCompleted(): Promise<boolean> {
    const completed = await this.getItem<boolean>('ONBOARDING_COMPLETED');
    return completed === true;
  }

  static async saveAppVersion(version: string): Promise<boolean> {
    return this.setItem('APP_VERSION', version);
  }

  static async getAppVersion(): Promise<string | null> {
    return this.getItem('APP_VERSION');
  }

  static async saveCartData(cartData: any): Promise<boolean> {
    return this.setItem('CART_DATA', cartData, 24); // Expire after 24 hours
  }

  static async getCartData(): Promise<any> {
    return this.getItem('CART_DATA');
  }

  static async clearCartData(): Promise<boolean> {
    return this.removeItem('CART_DATA');
  }

  static async saveBookingDraft(bookingData: any): Promise<boolean> {
    return this.setItem('BOOKING_DRAFT', bookingData, 1); // Expire after 1 hour
  }

  static async getBookingDraft(): Promise<any> {
    return this.getItem('BOOKING_DRAFT');
  }

  static async clearBookingDraft(): Promise<boolean> {
    return this.removeItem('BOOKING_DRAFT');
  }

  static async saveNotificationSettings(settings: any): Promise<boolean> {
    return this.setItem('NOTIFICATION_SETTINGS', settings);
  }

  static async getNotificationSettings(): Promise<any> {
    const defaultSettings = {
      push: true,
      email: true,
      sms: false,
      bookingUpdates: true,
      promotions: false,
      serviceReminders: true,
    };
    
    const saved = await this.getItem('NOTIFICATION_SETTINGS');
    return saved || defaultSettings;
  }

  // Get storage info for debugging
  static async getStorageInfo(): Promise<{
    keys: readonly string[];
    secureKeys: string[];
    totalItems: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const secureKeys = Object.values(this.SECURE_KEYS);
      
      return {
        keys,
        secureKeys,
        totalItems: keys.length + secureKeys.length,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { keys: [], secureKeys: [], totalItems: 0 };
    }
  }

  // Migration helper for app updates
  static async migrateData(fromVersion: string, toVersion: string): Promise<boolean> {
    try {
      console.log(`Migrating data from ${fromVersion} to ${toVersion}`);
      
      // Add migration logic here based on version changes
      // Example migration logic would go here
      
      await this.saveAppVersion(toVersion);
      return true;
    } catch (error) {
      console.error('Error during data migration:', error);
      return false;
    }
  }
}

export default StorageService;
