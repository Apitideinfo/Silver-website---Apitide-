import { StorageService } from './StorageService';

const ADMIN_SECRET = 'manish_admin_secure_vault_2026';
const CLOUDINARY_RAW_FALLBACK = 'https://res.cloudinary.com/pndcvmmv/raw/upload/manish_store_config.json';

class StoreSyncService {
  constructor() {
    this.hasInitialized = false;
    this.isFetching = false;
    this.lastSyncTime = 0;
    this.lastPublishTimes = {};
  }

  // Broadcast sync pulse across windows/tabs
  broadcast(type, data) {
    if (typeof window === 'undefined') return;

    try {
      window.dispatchEvent(new CustomEvent(`manish_${type}_updated`, { detail: data }));
    } catch (_e) { /* noop */ }

    try {
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('manish_store_sync');
        bc.postMessage({ type, data, timestamp: Date.now() });
        bc.close();
      }
    } catch (_e) { /* noop */ }

    try {
      localStorage.setItem('manish_sync_pulse', `${type}_${Date.now()}`);
    } catch (_e) { /* noop */ }
  }

  // Fetch published config from API (or CDN raw fallback) and hydrate local state
  async pullLatestConfig(force = false) {
    const now = Date.now();
    if (!force && this.isFetching) return null;
    if (!force && now - this.lastSyncTime < 4000) return null; // Throttle to prevent hammer

    this.isFetching = true;
    try {
      let config = null;

      // 1. Try local serverless endpoint
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        const res = await fetch(`/api/store-sync?t=${now}`, {
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          if (json?.data && typeof json.data === 'object') {
            config = json.data;
          }
        }
      } catch (err) {
        console.warn('[storeSync] Primary /api/store-sync pull notice:', err.message);
      }

      // 2. Direct CDN fallback if serverless endpoint is cold or unavailable
      if (!config) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);
          const cdnRes = await fetch(`${CLOUDINARY_RAW_FALLBACK}?t=${now}`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (cdnRes.ok) {
            config = await cdnRes.json();
          }
        } catch (cdnErr) {
          console.warn('[storeSync] CDN fallback pull notice:', cdnErr.message);
        }
      }

      if (config && typeof config === 'object') {
        this.lastSyncTime = Date.now();
        this.applyConfigLocally(config);
        return config;
      }
    } catch (globalErr) {
      console.warn('[storeSync] Sync pull warning:', globalErr.message);
    } finally {
      this.isFetching = false;
    }

    return null;
  }

  // Apply fetched cloud config to local stores and notify all listening components
  applyConfigLocally(config) {
    if (!config) return;
    const now = Date.now();

    // 1. Categories
    if (Array.isArray(config.categories) && (now - (this.lastPublishTimes['categories'] || 0) > 10000)) {
      const deletedCatIds = StorageService.get('manish_categories_deleted_ids', []);
      const isAllCatsCleared = StorageService.get('manish_categories_all_cleared', false);
      const safeCats = isAllCatsCleared 
        ? [] 
        : config.categories.filter(c => c && c.id && !deletedCatIds.includes(c.id));
      StorageService.set('manish_categories_store', safeCats);
      StorageService.set('manish_categories_initialized', true);
      this.broadcast('catalog', safeCats);
    }

    // 2. Hero Banners
    if (Array.isArray(config.heroBanners) && (now - (this.lastPublishTimes['heroBanners'] || 0) > 10000)) {
      const deletedHeroIds = StorageService.get('manish_hero_banners_deleted_ids', []);
      const safeHeroBanners = config.heroBanners.filter(
        b => b && b.id && !deletedHeroIds.includes(b.id)
      );
      StorageService.set('manish_hero_banners_data', safeHeroBanners);
      this.broadcast('hero_banners', safeHeroBanners);
    }

    // 3. Silver Story Spotlight
    if (config.silverStory && typeof config.silverStory === 'object' && (now - (this.lastPublishTimes['silverStory'] || 0) > 10000)) {
      const isStoryCleared = StorageService.get('manish_silver_story_all_cleared', false);
      const deletedStoryCardIds = StorageService.get('manish_silver_story_deleted_card_ids', []);
      const safeStoryCards = isStoryCleared
        ? []
        : Array.isArray(config.silverStory.cards)
        ? config.silverStory.cards.filter(c => c && c.id && !deletedStoryCardIds.includes(c.id))
        : [];
      const safeStory = { ...config.silverStory, cards: safeStoryCards };
      StorageService.set('manish_silver_story_data', safeStory);
      this.broadcast('silver_story', safeStory);
    }

    // 4. Gifting Hampers
    if (Array.isArray(config.giftingHampers) && (now - (this.lastPublishTimes['giftingHampers'] || 0) > 10000)) {
      const isHampersCleared = StorageService.get('manish_gifting_hampers_all_cleared', false);
      const deletedHamperIds = StorageService.get('manish_gifting_hampers_deleted_ids', []);
      const safeHampers = isHampersCleared
        ? []
        : config.giftingHampers.filter(h => h && h.id && !deletedHamperIds.includes(h.id));
      StorageService.set('manish_gifting_hampers_data', safeHampers);
      this.broadcast('gifting_hampers', safeHampers);
    }

    // 5. Curated Showcases (For Her, Him, Kids, Couples, Gifts)
    if (config.curatedShowcases && typeof config.curatedShowcases === 'object' && (now - (this.lastPublishTimes['curatedShowcases'] || this.lastPublishTimes['curated_showcases'] || 0) > 10000)) {
      StorageService.set('manish_curated_showcase_data_v2', config.curatedShowcases);
      this.broadcast('curated_showcase', config.curatedShowcases);
    }
  }

  // Securely publish an update from Admin to the shared Cloud
  async publishSection(section, data) {
    if (section) {
      this.lastPublishTimes[section] = Date.now();
    }
    // 1. Immediately apply locally for zero latency
    this.broadcast(section, data);

    // 2. Transmit to serverless endpoint
    let attempts = 0;
    while (attempts < 2) {
      attempts++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch('/api/store-sync', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': ADMIN_SECRET
          },
          body: JSON.stringify({ section, data })
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const result = await res.json();
          this.lastSyncTime = Date.now();
          return result;
        }
      } catch (err) {
        console.warn(`[storeSync] Publish attempt ${attempts} warning:`, err.message);
        if (attempts >= 2) break;
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    return { success: false, error: 'Could not sync to cloud' };
  }

  // Hook into App lifecycle
  initGlobalSync() {
    if (this.hasInitialized || typeof window === 'undefined') return;
    this.hasInitialized = true;

    // Initial pull on mount
    this.pullLatestConfig(true);

    // Re-pull when browser window gains focus or device wakes from sleep
    window.addEventListener('focus', () => this.pullLatestConfig(false));
    window.addEventListener('online', () => this.pullLatestConfig(true));
  }
}

export const storeSyncService = new StoreSyncService();

