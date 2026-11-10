import Payment from '../models/Payment.js';
import User from '../models/User.js';

const ADMIN_PASSKEY = '01816550751';

// Helper to verify admin access via auth token or passkey header
const isAuthorizedAdmin = (req) => {
  if (req.user && req.user.role === 'admin') return true;
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey || req.body.adminKey;
  if (adminKey && (adminKey === ADMIN_PASSKEY || adminKey === 'UDOY26')) return true;
  return false;
};

// 1. Submit bKash payment for 10 Tk
export const submitPayment = async (req, res, next) => {
  try {
    const { phone, transactionId, customerName, customerEmail } = req.body;

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your bKash sender phone number.',
      });
    }

    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the bKash Transaction ID (TrxID).',
      });
    }

    const cleanTrx = transactionId.trim().toUpperCase();
    const cleanPhone = phone.trim();

    // Check if TrxID was already submitted
    const existing = await Payment.findOne({ transactionId: cleanTrx });
    if (existing) {
      if (existing.status === 'approved') {
        return res.status(200).json({
          success: true,
          status: 'approved',
          unlocked: true,
          payment: existing,
          message: 'This Transaction ID has already been verified and approved! You can export now.',
        });
      }
      return res.status(200).json({
        success: true,
        status: 'pending',
        unlocked: false,
        payment: existing,
        message: 'Transaction ID is already submitted and pending admin verification.',
      });
    }

    const newPayment = await Payment.create({
      userId: req.user ? req.user.id : null,
      customerName: customerName ? customerName.trim() : (req.user?.name || 'Guest User'),
      customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : (req.user?.email || ''),
      phone: cleanPhone,
      transactionId: cleanTrx,
      amount: 10,
      paymentMethod: 'bKash',
      recipientNumber: ADMIN_PASSKEY,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      status: 'pending',
      unlocked: false,
      payment: newPayment,
      message: 'bKash payment submitted successfully! Waiting for admin approval.',
    });
  } catch (error) {
    next(error);
  }
};

// 2. Check status of a transaction or user
export const checkPaymentStatus = async (req, res, next) => {
  try {
    const { transactionId, phone, email } = req.query;

    const query = {};
    if (transactionId) query.transactionId = transactionId.trim().toUpperCase();
    else if (phone) query.phone = phone.trim();
    else if (email) query.customerEmail = email.trim().toLowerCase();
    else if (req.user?.id) query.userId = req.user.id;
    else {
      return res.status(400).json({
        success: false,
        message: 'Please provide a transactionId, phone, or email to check.',
      });
    }

    // Look for an approved payment first, or the newest payment
    let payment = await Payment.findOne({ ...query, status: 'approved' });
    if (!payment) {
      payment = await Payment.findOne(query).sort({ createdAt: -1 });
    }

    if (!payment) {
      return res.status(200).json({
        success: true,
        status: 'not_found',
        unlocked: false,
      });
    }

    res.status(200).json({
      success: true,
      status: payment.status,
      unlocked: payment.status === 'approved',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Apply Promo / Coupon Code (e.g. UDOY26)
export const applyCoupon = async (req, res, next) => {
  try {
    const { couponCode, customerName, customerEmail, phone } = req.body;

    if (!couponCode || typeof couponCode !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a coupon code.',
      });
    }

    const code = couponCode.trim().toUpperCase();
    if (code !== 'UDOY26') {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code. Try UDOY26 or send 10 Tk via bKash to 01816550751.',
      });
    }

    // Create an approved record for this coupon redemption
    const payment = await Payment.create({
      userId: req.user ? req.user.id : null,
      customerName: customerName ? customerName.trim() : (req.user?.name || 'Coupon User'),
      customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : (req.user?.email || ''),
      phone: phone ? phone.trim() : 'COUPON-USER',
      transactionId: `COUPON-UDOY26-${Date.now().toString(36).toUpperCase()}`,
      amount: 0,
      paymentMethod: 'coupon',
      couponCode: 'UDOY26',
      status: 'approved',
      approvedAt: new Date(),
      notes: 'Unlocked instantly with special promo coupon UDOY26',
    });

    // If user is logged in, upgrade user plan to pro
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, { plan: 'pro' });
    }

    res.status(200).json({
      success: true,
      unlocked: true,
      payment,
      message: 'Coupon UDOY26 applied successfully! Lifetime export access unlocked.',
    });
  } catch (error) {
    next(error);
  }
};

// 4. Admin: Get all payments and stats
export const adminGetPayments = async (req, res, next) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized admin access. Enter admin passkey or sign in as admin.',
      });
    }

    const payments = await Payment.find().sort({ createdAt: -1 });

    const stats = {
      total: payments.length,
      pending: payments.filter((p) => p.status === 'pending').length,
      approved: payments.filter((p) => p.status === 'approved').length,
      rejected: payments.filter((p) => p.status === 'rejected').length,
      totalRevenue: payments
        .filter((p) => p.status === 'approved')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    };

    res.status(200).json({
      success: true,
      stats,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Admin: Approve a payment
export const adminApprovePayment = async (req, res, next) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized admin access.',
      });
    }

    const { id } = req.params;
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    payment.status = 'approved';
    payment.approvedAt = new Date();
    await payment.save();

    // If linked to a registered user, upgrade their plan
    if (payment.userId) {
      await User.findByIdAndUpdate(payment.userId, { plan: 'pro' });
    }

    res.status(200).json({
      success: true,
      message: `Transaction ${payment.transactionId} approved! User is now unlocked for export.`,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Admin: Reject a payment
export const adminRejectPayment = async (req, res, next) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized admin access.',
      });
    }

    const { id } = req.params;
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    payment.status = 'rejected';
    await payment.save();

    res.status(200).json({
      success: true,
      message: `Transaction ${payment.transactionId} has been rejected.`,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Admin: Delete a payment record
export const adminDeletePayment = async (req, res, next) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized admin access.',
      });
    }

    const { id } = req.params;
    await Payment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Payment record removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// 8. Admin: Verify Passkey Login
export const adminVerifyPasskey = async (req, res, next) => {
  try {
    const { passkey } = req.body;
    if (passkey === ADMIN_PASSKEY || passkey === 'UDOY26') {
      return res.status(200).json({
        success: true,
        message: 'Admin passkey verified successfully.',
        adminKey: passkey,
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid Admin passkey. Enter your admin phone number.',
    });
  } catch (error) {
    next(error);
  }
};

