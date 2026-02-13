import { useCallback, useRef } from "react";

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  wait: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, wait);
    },
    [wait]
  );

  return debounced;
}
