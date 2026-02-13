import { useCallback, useRef } from "react";

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number
): (...args: Args) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const debounced = useCallback(
    (...args: Args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        (callbackRef.current as (...args: Args) => void)(...args);
        timeoutRef.current = null;
      }, wait);
    },
    [wait]
  );

  return debounced;
}
