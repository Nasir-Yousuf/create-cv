import CV from '../models/CV.js';
import { INITIAL_CV_DATA } from '../../../shared/constants/cvDefaults.js';

export const getCVs = async (req, res, next) => {
  try {
    const cvs = await CV.find({ userId: req.user.id })
      .select('title templateId personalInfo.fullName personalInfo.jobTitle design updatedAt createdAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: cvs.length,
      data: cvs,
    });
  } catch (error) {
    next(error);
  }
};

export const getCVById = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Verify authenticated ownership
    if (cv.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this resume.',
      });
    }

    res.status(200).json({
      success: true,
      data: cv,
    });
  } catch (error) {
    next(error);
  }
};

export const createCV = async (req, res, next) => {
  try {
    const incomingData = req.body || {};

    const cv = await CV.create({
      ...INITIAL_CV_DATA,
      ...incomingData,
      userId: req.user.id,
      title: incomingData.title || 'My Professional Resume',
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: cv,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCV = async (req, res, next) => {
  try {
    let cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Verify authenticated ownership
    if (cv.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this resume.',
      });
    }

    cv = await CV.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        userId: req.user.id, // Prevent overriding ownership
        $inc: { version: 1 },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume saved successfully',
      data: cv,
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateCV = async (req, res, next) => {
  try {
    const originalCV = await CV.findById(req.params.id);

    if (!originalCV) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    if (originalCV.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to duplicate this resume.',
      });
    }

    const clonedObj = originalCV.toObject();
    delete clonedObj._id;
    delete clonedObj.createdAt;
    delete clonedObj.updatedAt;

    clonedObj.title = `${originalCV.title} (Copy)`;
    clonedObj.userId = req.user.id;

    const newCV = await CV.create(clonedObj);

    res.status(201).json({
      success: true,
      message: 'Resume duplicated successfully',
      data: newCV,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCV = async (req, res, next) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    if (cv.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this resume.',
      });
    }

    await cv.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

