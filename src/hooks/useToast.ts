import { useState, useCallback, useRef } from 'react';

export interface ToastState {
  show: boolean;
  message: string;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ show: false, message: '' });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, duration = 2400) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ show: true, message });
    timerRef.current = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, duration);
  }, []);

  return { toast, showToast };
}
