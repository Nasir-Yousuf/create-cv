// Holds a transient in-memory callback to resume after login/register (e.g. a pending CV export).
let pendingCallback = null;

export const setPendingAuthAction = (fn) => {
  pendingCallback = typeof fn === 'function' ? fn : null;
};

export const clearPendingAuthAction = () => {
  pendingCallback = null;
};

export const consumePendingAuthAction = () => {
  const fn = pendingCallback;
  pendingCallback = null;
  if (typeof fn === 'function') {
    setTimeout(() => {
      try {
        fn();
      } catch (err) {
        console.error('Failed to resume post-auth action:', err);
      }
    }, 120);
  }
};

