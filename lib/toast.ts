export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

let toastListeners: ((toast: Toast) => void)[] = [];
let toastId = 0;

export const toast = {
  success: (title: string, message?: string, duration = 3000) => {
    const id = `toast-${++toastId}`;
    const toastObj: Toast = {
      id,
      type: 'success',
      title,
      message: message || '',
      duration,
    };
    notifyListeners(toastObj);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  },

  error: (title: string, message?: string, duration = 4000) => {
    const id = `toast-${++toastId}`;
    const toastObj: Toast = {
      id,
      type: 'error',
      title,
      message: message || '',
      duration,
    };
    notifyListeners(toastObj);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  },

  warning: (title: string, message?: string, duration = 3500) => {
    const id = `toast-${++toastId}`;
    const toastObj: Toast = {
      id,
      type: 'warning',
      title,
      message: message || '',
      duration,
    };
    notifyListeners(toastObj);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  },

  info: (title: string, message?: string, duration = 3000) => {
    const id = `toast-${++toastId}`;
    const toastObj: Toast = {
      id,
      type: 'info',
      title,
      message: message || '',
      duration,
    };
    notifyListeners(toastObj);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  },

  subscribe: (listener: (toast: Toast) => void) => {
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  },
};

const notifyListeners = (toast: Toast) => {
  toastListeners.forEach(listener => listener(toast));
};

const removeToast = (id: string) => {
  notifyListeners({ id, type: 'info', title: '', message: '' });
};
