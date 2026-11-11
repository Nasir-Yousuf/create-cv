import api from './api';
import {
  TEMPLATES_REGISTRY,
  getDynamicCategories,
} from '@shared/constants/cvDefaults.js';

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
};

export default templateService;

