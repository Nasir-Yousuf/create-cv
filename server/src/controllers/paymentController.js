import { z } from 'zod';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import CV from '../models/CV.js';
import CVActivity from '../models/CVActivity.js';

export const getPaymentConfigValues = () => ({
  bkashNumber: process.env.BKASH_NUMBER || '01816550751',
  amountBdt: Number(process.env.CV_EXPORT_PRICE_BDT) || 10,
  currency: 'BDT',
  paymentMethod: 'bKash',
  provider: 'bkash_manual',
});

const submitPaymentSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^(\+?880|0)1[3-9]\d{8}$/, 'Please enter a valid Bangladeshi bKash mobile number (e.g. 017XXXXXXXX).'),
  transactionId: z
    .string()
    .trim()
    .min(6, 'bKash Transaction ID (TrxID) must be at least 6 characters.')
    .max(32, 'Transaction ID is too long.')
    .regex(/^[A-Za-z0-9_-]+$/, 'Transaction ID may contain only letters and numbers.'),
  cvId: z.string().optional().nullable(),
  notes: z.string().max(250).optional(),
});

export const computeUserEntitlements = async (userId) => {
  const [user, unlockedCvsCount, pendingPaymentsCount, recentPayments] = await Promise.all([
    User.findById(userId).select('role freeExportsRemaining paidExportCredits totalExports status'),
    CV.countDocuments({ userId, isExportUnlocked: true, isDeleted: { $ne: true } }),
    Payment.countDocuments({ userId, status: 'pending' }),
    Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('amount currency phone transactionId status rejectionReason paymentMethod createdAt reviewedAt'),
  ]);

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const freeExportsRemaining = isAdmin ? 999999 : Math.max(0, user.freeExportsRemaining || 0);
  const paidExportCredits = isAdmin ? 999999 : Math.max(0, user.paidExportCredits || 0);

  return {
    isAdmin,
    freeExportsRemaining,
    paidExportCredits,
    availableNewCvExports: freeExportsRemaining + paidExportCredits,
    unlockedCvsCount,
    totalExports: user.totalExports || 0,
    pendingPaymentsCount,
    recentPayments,
  };
};

// @desc    Get public non-sensitive bKash payment instructions & pricing
// @route   GET /api/payment/config
// @access  Public
export const getPaymentConfig = (req, res) => {
  const cfg = getPaymentConfigValues();
  res.status(200).json({
    success: true,
    data: {
      bkashNumber: cfg.bkashNumber,
      amountBdt: cfg.amountBdt,
      currency: cfg.currency,
      paymentMethod: cfg.paymentMethod,
      provider: cfg.provider,
      pricingPolicy: 'First CV export is free. Additional CV creation/export costs ৳10 per new CV.',
    },
  });
};

// @desc    Get authenticated user's export entitlements & payment summary
// @route   GET /api/payment/entitlements
// @access  Private
export const getMyEntitlements = async (req, res, next) => {
  try {
    const entitlements = await computeUserEntitlements(req.user.id);
    if (!entitlements) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: entitlements,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit manual bKash TrxID payment verification request (৳10 = 1 additional CV credit)
// @route   POST /api/payment/submit
// @access  Private
export const submitPayment = async (req, res, next) => {
  try {
    const parsed = submitPaymentSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid payment submission details.',
      });
    }

    const cleanTrxId = parsed.data.transactionId.toUpperCase();
    const cfg = getPaymentConfigValues();

    const duplicate = await Payment.findOne({ transactionId: cleanTrxId });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        code: 'DUPLICATE_TRX_ID',
        message: `Transaction ID "${cleanTrxId}" has already been submitted (${duplicate.status}). Duplicate Transaction IDs cannot be reused.`,
      });
    }

    let validCvId = null;
    if (parsed.data.cvId) {
      const ownedCv = await CV.findOne({ _id: parsed.data.cvId, userId: req.user.id }).select('_id');
      if (ownedCv) validCvId = ownedCv._id;
    }

    const payment = await Payment.create({
      userId: req.user.id,
      cvId: validCvId,
      customerName: req.user.name,
      customerEmail: req.user.email,
      phone: parsed.data.phoneNumber,
      transactionId: cleanTrxId,
      amount: cfg.amountBdt,
      currency: cfg.currency,
      paymentMethod: 'bKash',
      paymentProvider: 'bkash_manual',
      recipientNumber: cfg.bkashNumber,
      status: 'pending',
      notes: parsed.data.notes || '',
    });

    await CVActivity.create({
      userId: req.user.id,
      cvId: validCvId,
      action: 'payment_submitted',
      details: `Submitted bKash payment ৳${cfg.amountBdt} (TrxID: ${cleanTrxId})`,
      actorRole: 'user',
      actorId: req.user.id,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Payment request submitted. An administrator will verify your bKash TrxID shortly.',
      data: {
        _id: payment._id,
        transactionId: payment.transactionId,
        phone: payment.phone,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt,
      },
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        code: 'DUPLICATE_TRX_ID',
        message: 'This Transaction ID has already been recorded.',
      });
    }
    next(err);
  }
};

// @desc    List authenticated user's own payment requests and statuses
// @route   GET /api/payment/my-payments
// @access  Private
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('amount currency phone transactionId recipientNumber paymentMethod status rejectionReason entitlementsGranted createdAt reviewedAt');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};
