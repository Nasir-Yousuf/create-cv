import mongoose from 'mongoose';

const cvVersionSchema = new mongoose.Schema(
  {
    cvId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CV',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      default: 'Auto Checkpoint',
      trim: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
    },
    templateId: {
      type: String,
      default: 'onepage-fresher-clean',
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

cvVersionSchema.index({ cvId: 1, version: -1 });

export const CVVersion = mongoose.model('CVVersion', cvVersionSchema);
export default CVVersion;

