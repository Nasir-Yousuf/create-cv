/**
 * Lightweight callback registry so Redux Toast state remains serializable
 * while supporting interactive error-retry actions cleanly across components.
 */
const actionCallbacks = new Map();

export const registerToastAction = (callback) => {
  if (typeof callback !== 'function') return null;
  const actionKey = `toast-action-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  actionCallbacks.set(actionKey, callback);
  return actionKey;
};

export const triggerToastAction = (actionKey) => {
  const fn = actionCallbacks.get(actionKey);
  if (typeof fn === 'function') {
    actionCallbacks.delete(actionKey);
    fn();
  }
};

export const clearToastAction = (actionKey) => {
  if (actionKey) actionCallbacks.delete(actionKey);
};

