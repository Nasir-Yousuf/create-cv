import mongoose from 'mongoose';

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    feature: {
      type: String,
      required: true, // e.g. 'generate-cv', 'summary', 'experience', 'matcher'
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    promptLength: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const AIUsage = mongoose.model('AIUsage', aiUsageSchema);
export default AIUsage;

