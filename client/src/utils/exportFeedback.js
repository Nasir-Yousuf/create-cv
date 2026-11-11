import { showToast } from '../store/uiSlice';
import { registerToastAction } from './toastActions';

export const notifyExportSuccess = (dispatch, formatLabel = 'PDF', templateName = '') => {
  dispatch(
    showToast({
      type: 'success',
      message: `${formatLabel} downloaded successfully${templateName ? ` (${templateName})` : ''}.`,
    })
  );
};

export const notifyExportError = (dispatch, formatLabel = 'PDF', err = null, retryCallback = null) => {
  const actionKey = typeof retryCallback === 'function' ? registerToastAction(retryCallback) : null;
  const detail = err?.message && err.message.length < 120 ? err.message : `Failed to export ${formatLabel}. Please try again.`;
  dispatch(
    showToast({
      type: 'error',
      message: detail,
      actionLabel: actionKey ? 'Retry' : '',
      actionKey,
    })
  );
};

