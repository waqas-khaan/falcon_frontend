/**
 * Toast notification utility
 * Usage:
 *   import { toast } from '@/utils/toast'
 *   toast.success('Message here')
 *   toast.error('Error message')
 *   toast.warning('Warning message')
 *   toast.info('Info message')
 */

export const toast = {
  success(message, duration = 5000) {
    this.show(message, "success", duration);
  },
  error(message, duration = 5000) {
    this.show(message, "error", duration);
  },
  warning(message, duration = 5000) {
    this.show(message, "warning", duration);
  },
  info(message, duration = 5000) {
    this.show(message, "info", duration);
  },
  show(message, type = "success", duration = 5000) {
    // Try to get toast instance from Vue root or window
    const toastInstance =
      window.$toast || (window.$vue && window.$vue.$root.$toast);

    if (toastInstance && toastInstance.addToast) {
      toastInstance.addToast(message, type, duration);
    } else {
      // Fallback to console if toast is not initialized
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  },
};

export default toast;
