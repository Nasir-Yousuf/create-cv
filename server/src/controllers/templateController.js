import mongoose from 'mongoose';
import Template from '../models/Template.js';
import { TEMPLATES_REGISTRY } from '../../../shared/constants/cvDefaults.js';

export const getTemplates = async (req, res, next) => {
  try {
    // If database is not currently connected, immediately serve registry without buffering delay
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: TEMPLATES_REGISTRY.length,
        data: TEMPLATES_REGISTRY,
      });
    }

    let templates = await Template.find({ isPublished: true })
      .maxTimeMS(3000)
      .sort({ createdAt: -1 });

    if (!templates || templates.length === 0) {
      return res.status(200).json({
        success: true,
        count: TEMPLATES_REGISTRY.length,
        data: TEMPLATES_REGISTRY,
      });
    }

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    // Graceful fallback to static registry if DB query times out
    return res.status(200).json({
      success: true,
      count: TEMPLATES_REGISTRY.length,
      data: TEMPLATES_REGISTRY,
    });
  }
};

export const seedTemplates = async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }
  try {
    const count = await Template.countDocuments().maxTimeMS(3000);
    if (count === 0) {
      console.log('Seeding initial 10 templates into MongoDB Atlas...');
      const seedData = TEMPLATES_REGISTRY.map((t) => ({
        templateId: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
        badge: t.badge,
        isPremium: t.isPremium,
        thumbnailColor: t.thumbnailColor,
        features: t.features,
      }));
      await Template.insertMany(seedData);
      console.log('✅ Templates seeded successfully.');
    }
  } catch (err) {
    console.warn('Template seed skipped (DB offline or timeout):', err.message);
  }
};
