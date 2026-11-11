import User from '../models/User.js';
import CV from '../models/CV.js';
import Payment from '../models/Payment.js';
import CVActivity from '../models/CVActivity.js';
import Template from '../models/Template.js';
import { sanitizeUser } from '../utils/adminBootstrap.js';

// @desc    Admin system analytics summary
// @route   GET /api/admin/analytics
// @access  Admin
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalCVs,
      trashedCVs,
      exportStats,
      paymentGroups,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', status: 'active' }),
      User.countDocuments({ role: 'user', status: 'suspended' }),
      CV.countDocuments({ isDeleted: { $ne: true } }),
      CV.countDocuments({ isDeleted: true }),
      CV.aggregate([
        {
          $group: {
            _id: null,
            totalPdfExports: { $sum: { $ifNull: ['$pdfExportCount', 0] } },
            totalDocxExports: { $sum: { $ifNull: ['$docxExportCount', 0] } },
            unlockedCVs: { $sum: { $cond: ['$isExportUnlocked', 1, 0] } },
          },
        },
      ]),
      Payment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            amountTotal: { $sum: '$amount' },
          },
        },
      ]),
      CVActivity.find()
        .sort({ createdAt: -1 })
        .limit(15)
        .populate('userId', 'name email'),
    ]);

    const exportTotals = exportStats[0] || {
      totalPdfExports: 0,
      totalDocxExports: 0,
      unlockedCVs: 0,
    };

    const paymentsMap = paymentGroups.reduce(
      (acc, g) => {
        acc[g._id] = { count: g.count, amountTotal: g.amountTotal };
        return acc;
      },
      {
        pending: { count: 0, amountTotal: 0 },
        approved: { count: 0, amountTotal: 0 },
        rejected: { count: 0, amountTotal: 0 },
      }
    );

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalCVs,
        trashedCVs,
        unlockedCVs: exportTotals.unlockedCVs,
        totalPdfExports: exportTotals.totalPdfExports,
        totalDocxExports: exportTotals.totalDocxExports,
        pendingPaymentsCount: paymentsMap.pending.count,
        approvedPaymentsCount: paymentsMap.approved.count,
        rejectedPaymentsCount: paymentsMap.rejected.count,
        totalCollectedRevenue: paymentsMap.approved.amountTotal,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    List users with search, filter, CV count, export count & payment metrics
// @route   GET /api/admin/users
// @access  Admin
export const getAdminUsers = async (req, res, next) => {
  try {
    const search = String(req.query.q || '').trim();
    const statusFilter = String(req.query.status || 'all');

    const query = {};
    if (statusFilter === 'active' || statusFilter === 'suspended') {
      query.status = statusFilter;
    }
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ name: rx }, { email: rx }];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    const userIds = users.map((u) => u._id);

    const [cvCounts, paymentStats] = await Promise.all([
      CV.aggregate([
        { $match: { userId: { $in: userIds }, isDeleted: { $ne: true } } },
        {
          $group: {
            _id: '$userId',
            cvCount: { $sum: 1 },
            pdfExports: { $sum: { $ifNull: ['$pdfExportCount', 0] } },
            docxExports: { $sum: { $ifNull: ['$docxExportCount', 0] } },
          },
        },
      ]),
      Payment.aggregate([
        { $match: { userId: { $in: userIds } } },
        {
          $group: {
            _id: '$userId',
            paymentCount: { $sum: 1 },
            totalPaidBdt: {
              $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] },
            },
          },
        },
      ]),
    ]);

    const cvMap = new Map(cvCounts.map((c) => [String(c._id), c]));
    const payMap = new Map(paymentStats.map((p) => [String(p._id), p]));

    const enriched = users.map((u) => {
      const uid = String(u._id);
      const cvMeta = cvMap.get(uid) || { cvCount: 0, pdfExports: 0, docxExports: 0 };
      const payMeta = payMap.get(uid) || { paymentCount: 0, totalPaidBdt: 0 };
      return {
        ...sanitizeUser(u),
        cvCount: cvMeta.cvCount,
        pdfExports: cvMeta.pdfExports,
        docxExports: cvMeta.docxExports,
        paymentCount: payMeta.paymentCount,
        totalPaidBdt: payMeta.totalPaidBdt,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user detailed overview (CVs, payment history, activity)
// @route   GET /api/admin/users/:id
// @access  Admin
export const getAdminUserDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [cvs, payments, activity] = await Promise.all([
      CV.find({ userId: user._id })
        .sort({ updatedAt: -1 })
        .select('title templateId category isOnePage isExportUnlocked unlockType pdfExportCount docxExportCount isDeleted updatedAt createdAt'),
      Payment.find({ userId: user._id }).sort({ createdAt: -1 }),
      CVActivity.find({ userId: user._id }).sort({ createdAt: -1 }).limit(30),
    ]);

    res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        cvs,
        payments,
        activity,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Suspend or reactivate a regular user account
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (status !== 'active' && status !== 'suspended') {
      return res.status(400).json({
        success: false,
        message: 'Status must be "active" or "suspended".',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin' || String(user._id) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Administrator accounts cannot be suspended.',
      });
    }

    user.status = status;
    await user.save();

    await CVActivity.create({
      userId: user._id,
      action: 'account_status_changed',
      details: `Account status changed to "${status}" by Admin (${req.user.email})`,
      actorRole: 'admin',
      actorId: req.user.id,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
      message: `User account is now ${status}.`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Grant paid export credits or adjust entitlements manually by Admin
// @route   PATCH /api/admin/users/:id/entitlements
// @access  Admin
export const grantUserEntitlement = async (req, res, next) => {
  try {
    const addCredits = Number(req.body?.addPaidCredits ?? 1);
    if (!Number.isInteger(addCredits) || addCredits < -10 || addCredits > 50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit delta (must be integer between -10 and 50).',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.paidExportCredits = Math.max(0, (user.paidExportCredits || 0) + addCredits);
    await user.save();

    await CVActivity.create({
      userId: user._id,
      action: 'entitlement_granted',
      details: `Admin (${req.user.email}) adjusted paid CV credits by ${addCredits >= 0 ? `+${addCredits}` : addCredits}`,
      actorRole: 'admin',
      actorId: req.user.id,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
      message: `Updated paid CV credits (${user.paidExportCredits} available).`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    List manual bKash payments with filtering and search
// @route   GET /api/admin/payments
// @access  Admin
export const getAdminPayments = async (req, res, next) => {
  try {
    const statusFilter = String(req.query.status || 'all');
    const search = String(req.query.q || '').trim();

    const query = {};
    if (['pending', 'approved', 'rejected'].includes(statusFilter)) {
      query.status = statusFilter;
    }
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { transactionId: rx },
        { phone: rx },
        { customerEmail: rx },
        { customerName: rx },
      ];
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email status freeExportsRemaining paidExportCredits')
      .populate('reviewedBy', 'name email');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atomically approve a pending payment & grant 1 additional CV export credit
// @route   POST /api/admin/payments/:id/approve
// @access  Admin
export const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      {
        $set: {
          status: 'approved',
          reviewedBy: req.user.id,
          reviewedAt: new Date(),
          approvedAt: new Date(),
          rejectionReason: '',
          entitlementsGranted: 1,
        },
      },
      { new: true }
    );

    if (!payment) {
      const existing = await Payment.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Payment request not found.' });
      }
      return res.status(409).json({
        success: false,
        code: 'ALREADY_REVIEWED',
        message: `Payment is already "${existing.status}" and cannot be approved twice.`,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      payment.userId,
      { $inc: { paidExportCredits: 1 } },
      { new: true }
    );

    await CVActivity.create({
      userId: payment.userId,
      cvId: payment.cvId || null,
      action: 'payment_approved',
      details: `Approved bKash TrxID ${payment.transactionId} (৳${payment.amount}). Granted +1 CV credit.`,
      actorRole: 'admin',
      actorId: req.user.id,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Payment approved and 1 additional CV export entitlement granted.',
      data: payment,
      user: sanitizeUser(updatedUser),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject a pending payment with optional reason
// @route   POST /api/admin/payments/:id/reject
// @access  Admin
export const rejectPayment = async (req, res, next) => {
  try {
    const reason = String(req.body?.reason || '').trim().slice(0, 300);

    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      {
        $set: {
          status: 'rejected',
          rejectionReason: reason || 'Transaction ID could not be verified.',
          reviewedBy: req.user.id,
          reviewedAt: new Date(),
          entitlementsGranted: 0,
        },
      },
      { new: true }
    );

    if (!payment) {
      const existing = await Payment.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Payment request not found.' });
      }
      return res.status(409).json({
        success: false,
        code: 'ALREADY_REVIEWED',
        message: `Payment is already "${existing.status}".`,
      });
    }

    await CVActivity.create({
      userId: payment.userId,
      cvId: payment.cvId || null,
      action: 'payment_rejected',
      details: `Rejected bKash TrxID ${payment.transactionId}${reason ? `: ${reason}` : ''}`,
      actorRole: 'admin',
      actorId: req.user.id,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Payment marked as rejected.',
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get global platform activity logs
// @route   GET /api/admin/activity
// @access  Admin
export const getAdminActivity = async (req, res, next) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
    const logs = await CVActivity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .populate('actorId', 'name email role');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all managed templates for Admin catalog controls
// @route   GET /api/admin/templates
// @access  Admin
export const getAdminTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find().sort({ sortOrder: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update template visibility, primary category, multi-categories, badge or one-page flag
// @route   PATCH /api/admin/templates/:templateId
// @access  Admin
export const updateAdminTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOne({ templateId: req.params.templateId });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    const { isPublished, category, categories, isOnePage, badge, isFeatured } = req.body || {};
    if (typeof isPublished === 'boolean') template.isPublished = isPublished;
    if (typeof isOnePage === 'boolean') template.isOnePage = isOnePage;
    if (typeof isFeatured === 'boolean') template.isFeatured = isFeatured;
    if (typeof category === 'string' && category.trim()) template.category = category.trim();
    if (Array.isArray(categories)) template.categories = categories.map((c) => String(c).trim()).filter(Boolean);
    if (typeof badge === 'string') template.badge = badge.trim();

    await template.save();

    res.status(200).json({
      success: true,
      data: template,
      message: `Updated template "${template.name}".`,
    });
  } catch (err) {
    next(err);
  }
};

