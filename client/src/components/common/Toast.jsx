import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { hideToast } from '../../store/uiSlice';
import { triggerToastAction, clearToastAction } from '../../utils/toastActions';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, RotateCcw } from 'lucide-react';

export const Toast = () => {
  const dispatch = useDispatch();
  const { show, message, type, actionLabel, actionKey } = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (show) {
      const duration = type === 'error' && actionKey ? 7000 : 4000;
      const timer = setTimeout(() => {
        clearToastAction(actionKey);
        dispatch(hideToast());
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, type, actionKey, message, dispatch]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200',
    error: 'border-rose-500/20 bg-rose-50/90 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200',
    warning: 'border-amber-500/20 bg-amber-50/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200',
    info: 'border-indigo-500/20 bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-6 right-6 z-50 max-w-md w-full shadow-lg rounded-2xl border backdrop-blur-md p-4 flex items-center justify-between gap-3"
          style={{ pointerEvents: 'auto' }}
        >
          <div className={`flex items-center gap-3 w-full p-2.5 rounded-xl border ${borders[type] || borders.info}`}>
            {icons[type] || icons.info}
            <p className="text-xs sm:text-sm font-medium leading-snug flex-1">{message}</p>
            {actionLabel && actionKey && (
              <button
                type="button"
                onClick={() => {
                  const key = actionKey;
                  dispatch(hideToast());
                  triggerToastAction(key);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-rose-300/60 dark:border-rose-700/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 hover:bg-white transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{actionLabel}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                clearToastAction(actionKey);
                dispatch(hideToast());
              }}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

