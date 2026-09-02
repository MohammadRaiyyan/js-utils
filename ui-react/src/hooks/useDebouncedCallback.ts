import { useCallback, useEffect, useRef } from "react";

export default function useDebouncedCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  delay = 500,
) {
  const timerRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  const debouncedCallback = useCallback(
    (...args: T) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        callbackRef.current(...args);
        timerRef.current = null;
      }, delay);
    },
    [delay],
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
