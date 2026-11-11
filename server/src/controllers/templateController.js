import mongoose from 'mongoose';
import Template from '../models/Template.js';
import {
  TEMPLATES_REGISTRY,
  getDynamicCategories,
} from '../../../shared/constants/cvDefaults.js';

const mergeRegistryMetadata = (dbTemplate) => {
  const reg = TEMPLATES_REGISTRY.find((t) => t.id === dbTemplate.templateId) || {};
  return {
    ...reg,
    id: dbTemplate.templateId,
    name: dbTemplate.name || reg.name,
    category: dbTemplate.category || reg.category,
    categories:
      Array.isArray(dbTemplate.categories) && dbTemplate.categories.length > 0
        ? dbTemplate.categories
        : reg.categories || [dbTemplate.category],
    isOnePage:
      typeof dbTemplate.isOnePage === 'boolean' ? dbTemplate.isOnePage : Boolean(reg.isOnePage),
    isFeatured:
      typeof dbTemplate.isFeatured === 'boolean' ? dbTemplate.isFeatured : Boolean(reg.isFeatured),
    description: dbTemplate.description || reg.description || '',
    badge: dbTemplate.badge || reg.badge || '',
    isPremium: false,
    isPublished: dbTemplate.isPublished !== false,
    thumbnailColor: dbTemplate.thumbnailColor || reg.thumbnailColor || '#2563eb',
    photoFormat: dbTemplate.photoFormat || reg.photoFormat || 'circle',
    features:
      Array.isArray(dbTemplate.features) && dbTemplate.features.length > 0
        ? dbTemplate.features
        : reg.features || [],
    sortOrder: typeof dbTemplate.sortOrder === 'number' ? dbTemplate.sortOrder : 99,
  };
};

// @desc    Get all published CV templates + dynamically derived categories
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: TEMPLATES_REGISTRY.length,
        categories: getDynamicCategories(TEMPLATES_REGISTRY),
        data: TEMPLATES_REGISTRY,
      });
    }

    const dbTemplates = await Template.find({ isPublished: true })
      .maxTimeMS(3000)
      .sort({ sortOrder: 1, createdAt: 1 });

    if (!dbTemplates || dbTemplates.length === 0) {
      return res.status(200).json({
        success: true,
        count: TEMPLATES_REGISTRY.length,
        categories: getDynamicCategories(TEMPLATES_REGISTRY),
        data: TEMPLATES_REGISTRY,
      });
    }

    const canonicalIds = new Set(TEMPLATES_REGISTRY.map((t) => t.id));
    const filtered = dbTemplates
      .filter((t) => canonicalIds.has(t.templateId))
      .map(mergeRegistryMetadata);

    const list = filtered.length > 0 ? filtered : TEMPLATES_REGISTRY;

    return res.status(200).json({
      success: true,
      count: list.length,
      categories: getDynamicCategories(list),
      data: list,
    });
  } catch (err) {
    console.warn('Database error loading templates, falling back cleanly:', err.message);
    return res.status(200).json({
      success: true,
      count: TEMPLATES_REGISTRY.length,
      categories: getDynamicCategories(TEMPLATES_REGISTRY),
      data: TEMPLATES_REGISTRY,
    });
  }
};

/**
 * Synchronizes canonical TEMPLATES_REGISTRY into MongoDB and unpublishes removed legacy duplicates.
 */
export const seedTemplates = async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  try {
    const canonicalIds = TEMPLATES_REGISTRY.map((t) => t.id);

    // Unpublish any old duplicate template IDs from previous releases
    await Template.updateMany(
      { templateId: { $nin: canonicalIds } },
      { $set: { isPublished: false } }
    );

    const ops = TEMPLATES_REGISTRY.map((t, idx) => ({
      updateOne: {
        filter: { templateId: t.id },
        update: {
          $setOnInsert: {
            name: t.name,
            category: t.category,
            categories: t.categories,
            isOnePage: Boolean(t.isOnePage),
            isFeatured: Boolean(t.isFeatured),
            description: t.description,
            badge: t.badge,
            isPremium: false,
            isPublished: true,
            thumbnailColor: t.thumbnailColor,
            photoFormat: t.photoFormat,
            features: t.features,
          },
          $set: {
            sortOrder: idx,
          },
        },
        upsert: true,
      },
    }));

    await Template.bulkWrite(ops);
    console.log(`✅ Synchronized ${TEMPLATES_REGISTRY.length} distinct templates in MongoDB.`);
  } catch (err) {
    console.error('❌ Error syncing templates:', err.message);
  }
};
