// LocalStorage utility with encryption support
const STORAGE_PREFIX = 'lic_';

export interface StorageOptions {
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
}

// Simple encryption (for non-sensitive data)
const simpleEncrypt = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

const simpleDecrypt = (data: string): string => {
  try {
    return Buffer.from(data, 'base64').toString('utf-8');
  } catch {
    return data;
  }
};

export const storage = {
  // Set item in localStorage
  setItem: (key: string, value: any, options?: StorageOptions) => {
    try {
      if (typeof window === 'undefined') return;

      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      let dataToStore = JSON.stringify(value);

      if (options?.encrypt) {
        dataToStore = simpleEncrypt(dataToStore);
      }

      const storageData = {
        value: dataToStore,
        timestamp: Date.now(),
        ttl: options?.ttl,
        encrypted: options?.encrypt || false,
      };

      localStorage.setItem(prefixedKey, JSON.stringify(storageData));
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },

  // Get item from localStorage
  getItem: (key: string): any => {
    try {
      if (typeof window === 'undefined') return null;

      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      const item = localStorage.getItem(prefixedKey);

      if (!item) return null;

      const storageData = JSON.parse(item);

      // Check if expired
      if (storageData.ttl && Date.now() - storageData.timestamp > storageData.ttl) {
        localStorage.removeItem(prefixedKey);
        return null;
      }

      let value = storageData.value;

      if (storageData.encrypted) {
        value = simpleDecrypt(value);
      }

      return JSON.parse(value);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },

  // Remove item from localStorage
  removeItem: (key: string) => {
    try {
      if (typeof window === 'undefined') return;
      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  // Clear all items with prefix
  clear: () => {
    try {
      if (typeof window === 'undefined') return;
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Get all items
  getAll: (): Record<string, any> => {
    try {
      if (typeof window === 'undefined') return {};
      const result: Record<string, any> = {};
      const keys = Object.keys(localStorage);

      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          const cleanKey = key.replace(STORAGE_PREFIX, '');
          result[cleanKey] = storage.getItem(cleanKey);
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting all items:', error);
      return {};
    }
  },
};

// Session storage for temporary data
export const sessionStorage = {
  setItem: (key: string, value: any) => {
    try {
      if (typeof window === 'undefined') return;
      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      window.sessionStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing session ${key}:`, error);
    }
  },

  getItem: (key: string): any => {
    try {
      if (typeof window === 'undefined') return null;
      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      const item = window.sessionStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving session ${key}:`, error);
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      if (typeof window === 'undefined') return;
      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      window.sessionStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing session ${key}:`, error);
    }
  },

  clear: () => {
    try {
      if (typeof window === 'undefined') return;
      const keys = Object.keys(window.sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          window.sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  },
};
