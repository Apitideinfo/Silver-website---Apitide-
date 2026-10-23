export const StorageService = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      try {
        return JSON.parse(item);
      } catch {
        // Legacy plain-string value (e.g. "Super Admin" stored without JSON.stringify)
        // Return it as-is so app doesn't crash; next write will properly stringify it.
        return item;
      }
    } catch (e) {
      console.warn(`StorageService read error for key "${key}":`, e);
      return defaultValue;
    }
  },


  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`StorageService write error for key "${key}":`, e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`StorageService removal error for key "${key}":`, e);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('StorageService clear error:', e);
    }
  }
};
