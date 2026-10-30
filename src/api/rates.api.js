import { goldRateService } from '../services/goldRateService';

export const ratesApi = {
  // Get active rates document (one-time)
  async getRates() {
    return goldRateService.getRates();
  },

  // Listen to live rates changes (realtime with local cache & cross-tab sync)
  subscribeToRates(onUpdate, onError) {
    return goldRateService.subscribeToRates(onUpdate, onError);
  },

  // Save rates (full payload including 22K, 18K, silver, platinum, metadata)
  async saveRates(ratesData) {
    return goldRateService.saveRates(ratesData);
  }
};
