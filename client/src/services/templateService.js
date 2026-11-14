import api from './api';
import {
  TEMPLATES_REGISTRY,
  getDynamicCategories,
} from '@shared/constants/cvDefaults.js';

const FAVORITES_STORAGE_KEY = 'novacv_favorite_templates';
const DEFAULT_FAVORITES = [
  'onepage-fresher-clean',
  'onepage-bd-compact',
  'onepage-modern-split',
  'bd-corporate-standard',
];

export const templateService = {
  async getTemplatesCatalog() {
    try {
      const res = await api.get('/templates');
      const list = Array.isArray(res.data?.data) && res.data.data.length > 0
        ? res.data.data
        : TEMPLATES_REGISTRY;
      const categories =
        Array.isArray(res.data?.categories) && res.data.categories.length > 0
          ? res.data.categories
          : getDynamicCategories(list);
      return { templates: list, categories };
    } catch {
      return {
        templates: TEMPLATES_REGISTRY,
        categories: getDynamicCategories(TEMPLATES_REGISTRY),
      };
    }
  },

  getFavorites() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return DEFAULT_FAVORITES;
      }
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) return DEFAULT_FAVORITES;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
    } catch (err) {
      console.warn('Failed to parse favorite templates from localStorage:', err);
      return DEFAULT_FAVORITES;
    }
  },

  saveFavorites(favorites) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      }
    } catch (err) {
      console.warn('Failed to persist favorite templates to localStorage:', err);
    }
  },

  toggleFavorite(templateId) {
    const current = this.getFavorites();
    const updated = current.includes(templateId)
      ? current.filter((id) => id !== templateId)
      : [...current, templateId];
    this.saveFavorites(updated);
    return updated;
  },

  isFavorite(templateId) {
    const current = this.getFavorites();
    return current.includes(templateId);
  },
};

export default templateService;


