import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: {
      type: String,
      trim: true,
      default: 'Guest User',
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Please provide the sender phone number'],
      trim: true,
    },
    transactionId: {
      type: String,
      required: [true, 'Please provide the bKash Transaction ID (TrxID)'],
      trim: true,
      uppercase: true,
    },
    amount: {
      type: Number,
      default: 10, // 10 Taka
    },
    paymentMethod: {
      type: String,
      enum: ['bKash', 'Nagad', 'Rocket', 'coupon'],
      default: 'bKash',
    },
    recipientNumber: {
      type: String,
      default: '01816550751',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    couponCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup by transaction ID and phone
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ phone: 1 });
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;

