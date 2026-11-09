import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: 'Standard',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    thumbnailColor: {
      type: String,
      default: '#4f46e5',
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Template = mongoose.model('Template', templateSchema);
export default Template;
