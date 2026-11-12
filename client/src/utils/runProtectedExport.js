import authService from '../services/authService';
import cvService from '../services/cvService';
import exportService from '../services/exportService';
import paymentService from '../services/paymentService';
import { openAuthModal, syncUserProfile, logout } from '../store/authSlice';
import { markExportUnlocked, setCVSyncMeta } from '../store/cvSlice';
import { resolveTemplateId, resolveTemplateMeta } from '@shared/constants/cvDefaults.js';
import { isValidMongoObjectId, normalizeCvData } from '@shared/utils/cvNormalize.js';
import { optimizeCvPhotoForExport } from './imageOptimize';
import { setPendingAuthAction } from './authPendingAction';
import { notifyExportSuccess, notifyExportError } from './exportFeedback';

/**
 * Unified, auth + payment-gated export pipeline shared by Wizard, Gallery, Editor, and Dashboard.
 *
 * Guarantees:
 * - Unauthenticated users are prompted to register/sign in first, then resumed cleanly.
 * - Ensures the CV has a persistent MongoDB `_id` before exporting so credits unlock that exact CV permanently.
 * - Re-downloading or editing an already-unlocked CV never consumes a credit or triggers payment.
 * - Downloads immediately with a non-blocking Toast notification (never renders a post-download preview panel).
 */
export async function runProtectedExport({
  dispatch,
  getState,
  cvData,
  cvId: explicitCvId = null,
  format = 'pdf',
  elementId = null,
  customHtml = '',
  openPaymentModal = null,
  onSyncCV = null,
  onExportSuccess = null,
  isActiveEditorCV = false,
}) {
  const state = typeof getState === 'function' ? getState() : {};
  const authState = state.auth || {};
  const cvState = state.cv || {};
  const formatLabel = format === 'docx' ? 'Word (DOCX)' : 'PDF';

  const resumeArgs = {
    dispatch,
    getState,
    cvData,
    cvId: explicitCvId,
    format,
    elementId,
    customHtml,
    openPaymentModal,
    onSyncCV,
    onExportSuccess,
    isActiveEditorCV,
  };

  // 1. Authentication Check
  if (!authState.isAuthenticated || !authState.token) {
    setPendingAuthAction(() => runProtectedExport(resumeArgs));
    dispatch(
      openAuthModal({
        mode: 'register',
        promptMessage: 'Create a free account or sign in to export your CV. Your first CV export is completely free.',
      })
    );
    return { status: 'auth_required' };
  }

  const canonicalTemplateId = resolveTemplateId(cvData?.templateId);
  const templateMeta = resolveTemplateMeta(canonicalTemplateId);
  const normalizedBaseCV = normalizeCvData({
    ...cvData,
    templateId: canonicalTemplateId,
  });

  const candidateId =
    explicitCvId || cvData?._id || (isActiveEditorCV ? cvState.cvId : null) || null;
  let activeCvId = isValidMongoObjectId(candidateId) ? String(candidateId).trim() : null;
  let activeCvDoc = activeCvId
    ? {
        _id: activeCvId,
        isExportUnlocked: Boolean(cvData?.isExportUnlocked ?? (isActiveEditorCV ? cvState.isExportUnlocked : false)),
        unlockType: cvData?.unlockType ?? (isActiveEditorCV ? cvState.unlockType : null),
        version: cvData?.version ?? (isActiveEditorCV ? cvState.version : 1),
      }
    : null;

  let normalizedCV = normalizedBaseCV;

  try {
    // Compress oversized photo uploads/WebP images before API requests (Vercel 4.5MB limit)
    normalizedCV = await optimizeCvPhotoForExport(normalizedBaseCV);

    // 2. Refresh user entitlements from server so cross-device/admin approvals are always fresh
    let currentUser = authState.user;
    try {
      const meRes = await authService.getMe();
      if (meRes?.user) {
        currentUser = meRes.user;
        dispatch(syncUserProfile(meRes.user));
      }
    } catch (meErr) {
      if (meErr?.status === 401 || meErr?.status === 403) {
        dispatch(logout());
        setPendingAuthAction(() => runProtectedExport(resumeArgs));
        dispatch(
          openAuthModal({
            mode: 'login',
            promptMessage: meErr.message || 'Your session expired. Please sign in again to export.',
          })
        );
        return { status: 'auth_required' };
      }
    }

    const persistNewCV = async () => {
      const payloadToCreate = {
        ...normalizedCV,
        title: normalizedCV.title || `${normalizedCV.personalInfo?.fullName || 'Untitled'} - CV`,
      };
      delete payloadToCreate._id;
      const createRes = await cvService.createCV(payloadToCreate);
      if (createRes?.data?._id) {
        activeCvDoc = createRes.data;
        activeCvId = createRes.data._id;
        if (isActiveEditorCV) {
          dispatch(
            setCVSyncMeta({
              cvId: activeCvId,
              version: createRes.data.version || 1,
              isExportUnlocked: Boolean(createRes.data.isExportUnlocked),
              unlockType: createRes.data.unlockType || null,
            })
          );
        }
        if (typeof onSyncCV === 'function') {
          onSyncCV(createRes.data);
        }
      }
    };

    const handleStaleOrMissingCv = async () => {
      activeCvId = null;
      activeCvDoc = null;
      if (isActiveEditorCV) {
        dispatch(
          setCVSyncMeta({
            cvId: null,
            version: 1,
            isExportUnlocked: false,
            unlockType: null,
          })
        );
      }
      await persistNewCV();
    };

    // 3. Ensure CV is persisted in MongoDB so entitlement locks permanently to its persistent `_id`
    if (!activeCvId) {
      await persistNewCV();
    } else if (isActiveEditorCV && cvState.isDirty) {
      try {
        const updateRes = await cvService.updateCV(activeCvId, {
          ...normalizedCV,
          expectedVersion: cvState.version,
        });
        if (updateRes?.data) {
          activeCvDoc = updateRes.data;
          dispatch(
            setCVSyncMeta({
              cvId: updateRes.data._id,
              version: updateRes.data.version,
              isExportUnlocked: Boolean(updateRes.data.isExportUnlocked),
              unlockType: updateRes.data.unlockType || null,
            })
          );
        }
      } catch (saveErr) {
        if (saveErr?.status === 404) {
          await handleStaleOrMissingCv();
        } else if (saveErr?.status === 409) {
          // Resolve background autosave version race cleanly before exporting
          try {
            const forcedRes = await cvService.updateCV(activeCvId, {
              ...normalizedCV,
              forceOverwrite: true,
            });
            if (forcedRes?.data) {
              activeCvDoc = forcedRes.data;
              dispatch(
                setCVSyncMeta({
                  cvId: forcedRes.data._id,
                  version: forcedRes.data.version,
                  isExportUnlocked: Boolean(forcedRes.data.isExportUnlocked),
                  unlockType: forcedRes.data.unlockType || null,
                })
              );
            }
          } catch (forcedErr) {
            if (forcedErr?.status === 404) {
              await handleStaleOrMissingCv();
            } else {
              throw forcedErr;
            }
          }
        }
      }
    } else if (activeCvId && activeCvDoc && activeCvDoc.isExportUnlocked === false) {
      // Confirm unlock state from DB (and recover transparently if old CV ID was deleted)
      try {
        const fetched = await cvService.getCVById(activeCvId);
        if (fetched?.data) {
          activeCvDoc = fetched.data;
          if (isActiveEditorCV) {
            dispatch(
              setCVSyncMeta({
                cvId: fetched.data._id,
                version: fetched.data.version,
                isExportUnlocked: Boolean(fetched.data.isExportUnlocked),
                unlockType: fetched.data.unlockType || null,
              })
            );
          }
        }
      } catch (fetchErr) {
        if (fetchErr?.status === 404) {
          await handleStaleOrMissingCv();
        }
      }
    }

    // 4. Pre-flight entitlement check to immediately show bKash ৳10 modal when credits = 0
    if (!paymentService.canExportWithoutPayment(currentUser, activeCvDoc)) {
      if (typeof openPaymentModal === 'function') {
        openPaymentModal({
          cvId: activeCvId,
          cvTitle: normalizedCV.title || normalizedCV.personalInfo?.fullName || 'Resume',
          format,
          retryExport: () =>
            runProtectedExport({
              ...resumeArgs,
              cvId: activeCvId,
            }),
        });
      }
      return { status: 'payment_required', cvId: activeCvId };
    }

    // 5. Perform Export (Server enforces auth & atomic credit deduction as source of truth)
    let exportedMeta = null;
    const captureMeta = (meta) => {
      if (meta) exportedMeta = meta;
    };

    if (format === 'docx') {
      await exportService.exportDOCX(normalizedCV, null, {
        cvId: activeCvId,
        onServerMeta: captureMeta,
      });
    } else {
      await exportService.exportPDF(normalizedCV, customHtml, elementId, null, {
        cvId: activeCvId,
        skipCache: true,
        onServerMeta: captureMeta,
      });
    }

    // 6. Sync post-export state & refresh user credits in background
    const finalCvId = exportedMeta?.cvId || activeCvId;
    const finalUnlockType = exportedMeta?.unlockType || activeCvDoc?.unlockType || 'unlocked';

    if (finalCvId && typeof onSyncCV === 'function' && finalCvId !== activeCvId) {
      onSyncCV({ _id: finalCvId, isExportUnlocked: true, unlockType: finalUnlockType });
    }
    if (isActiveEditorCV) {
      if (finalCvId && !cvState.cvId) {
        dispatch(
          setCVSyncMeta({
            cvId: finalCvId,
            version: activeCvDoc?.version || 1,
            isExportUnlocked: true,
            unlockType: finalUnlockType,
          })
        );
      } else {
        dispatch(markExportUnlocked(finalUnlockType));
      }
    }

    authService
      .getMe()
      .then((meRes) => {
        if (meRes?.user) dispatch(syncUserProfile(meRes.user));
      })
      .catch(() => {});

    notifyExportSuccess(dispatch, formatLabel, templateMeta?.name);

    if (typeof onExportSuccess === 'function') {
      onExportSuccess({ cvId: finalCvId, format });
    }

    return { status: 'success', cvId: finalCvId };
  } catch (err) {
    if (err?.status === 401) {
      dispatch(logout());
      setPendingAuthAction(() => runProtectedExport({ ...resumeArgs, cvId: activeCvId }));
      dispatch(
        openAuthModal({
          mode: 'login',
          promptMessage: err.message || 'Please sign in to export your CV.',
        })
      );
      return { status: 'auth_required', cvId: activeCvId };
    }

    if (err?.status === 402 || err?.code === 'PAYMENT_REQUIRED') {
      if (typeof openPaymentModal === 'function') {
        openPaymentModal({
          cvId: activeCvId,
          cvTitle: normalizedCV.title || normalizedCV.personalInfo?.fullName || 'Resume',
          format,
          entitlements: err.entitlements,
          retryExport: () =>
            runProtectedExport({
              ...resumeArgs,
              cvId: activeCvId,
            }),
        });
      }
      return { status: 'payment_required', cvId: activeCvId };
    }

    notifyExportError(dispatch, formatLabel, err, () =>
      runProtectedExport({ ...resumeArgs, cvId: activeCvId })
    );
    return { status: 'error', error: err, cvId: activeCvId };
  }
}

export default runProtectedExport;

