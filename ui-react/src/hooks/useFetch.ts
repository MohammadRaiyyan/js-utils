import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchReturn<T> {
  data: T | undefined;
  error: string;
  loading: boolean;
  refetch: VoidFunction;
}

export default function useFetch<T>(url: string): UseFetchReturn<T> {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setLoading(null);
    fetch(url, { signal: controller.signal })
      .then((res) => res.json() as T)
      .then((result) => {
        setData(result);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(
          e instanceof Error
            ? e.message
            : "Something went wrong while loading the data",
        );
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });
  }, [url]);

  useEffect(() => {
    void loadData();
    return () => controllerRef.current.abort();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}
