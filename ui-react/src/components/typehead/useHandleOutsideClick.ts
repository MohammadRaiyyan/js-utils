import { useCallback, useEffect, useRef, useState } from "react";

export default function useHandleOutsideClick<E extends Element = HTMLElement>(
  callback: VoidFunction,
) {
  const [target, setTarget] = useState<E | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loadTarget = useCallback((node: E | null) => {
    setTarget(node);
  }, []);

  useEffect(() => {
    if (!target) return;

    const handleClick = (event: MouseEvent) => {
      if (!target.contains(event.target as Node)) {
        callbackRef.current();
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [target]);

  return loadTarget;
}
