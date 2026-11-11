import mongoose from 'mongoose';

const cvActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cvId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CV',
      default: null,
      index: true,
    },
    cvTitle: {
      type: String,
      default: '',
      trim: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'created',
        'updated',
        'renamed',
        'template_changed',
        'duplicated',
        'deleted',
        'restored',
        'exported_pdf',
        'exported_docx',
        'payment_submitted',
        'payment_approved',
        'payment_rejected',
        'entitlement_granted',
        'account_status_changed',
      ],
    },
    details: {
      type: String,
      default: '',
      trim: true,
    },
    actorRole: {
      type: String,
      enum: ['user', 'admin', 'system'],
      default: 'user',
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

cvActivitySchema.index({ userId: 1, createdAt: -1 });
cvActivitySchema.index({ createdAt: -1 });

export const CVActivity = mongoose.model('CVActivity', cvActivitySchema);
export default CVActivity;

