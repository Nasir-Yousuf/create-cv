// Holds a transient in-memory callback to resume after login/register (e.g. a pending CV export).
let pendingCallback = null;
let pendingDraft = null;

export const setPendingAuthAction = (fn) => {
  pendingCallback = typeof fn === 'function' ? fn : null;
};

export const setPendingDraftCV = (draft) => {
  pendingDraft = draft && typeof draft === 'object' ? draft : null;
};

export const getPendingDraftCV = () => {
  if (pendingDraft) return pendingDraft;
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('resumecraft_draft') : null;
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

export const clearPendingAuthAction = () => {
  pendingCallback = null;
  pendingDraft = null;
};

export const consumePendingAuthAction = () => {
  const fn = pendingCallback;
  pendingCallback = null;
  pendingDraft = null;
  if (typeof fn === 'function') {
    setTimeout(async () => {
      try {
        await fn();
      } catch (err) {
        console.error('Failed to resume post-auth action:', err);
      }
    }, 120);
  }
};

