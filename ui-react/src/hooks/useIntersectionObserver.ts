import { useCallback, useEffect, useRef, useState } from "react";

export default function useIntersectionObsever<E extends HTMLElement>(
  callback: VoidFunction,
  options: IntersectionObserverInit = {},
): (node: E | null) => void {
  const [target, setTarget] = useState<E | null>(null);
  const callbackRef = useRef(callback);
  const { root = null, rootMargin = "0px", threshold = 0 } = options;

  const ref = useCallback((node: E | null) => {
    setTarget(node);
  }, []);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      { root, rootMargin, threshold },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [target, root, rootMargin, threshold]);

  return ref;
}

// Demo
// function Posts() {
//   const { data, fetchNext } = useInfiniteFetch({});
//   const sentinel = useIntersectionObsever(fetchNext, {})
// return <div>
//  <Posts posts={data}/>
//  <div ref={sentinel}/>
// </div>
// }
