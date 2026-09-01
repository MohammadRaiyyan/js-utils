import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchReturn<T> {
  data: T | undefined;
  error: string | null;
  loading: boolean;
  refetch: VoidFunction;
}

interface UseFetchOption<T> {
  key: readonly unknown[];
  fetcher: (signal: AbortSignal) => Promise<T>;
}

export default function useFetch<T>(
  options: UseFetchOption<T>,
): UseFetchReturn<T> {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const keyString = JSON.stringify(options.key);
  const fetcherRef = useRef(options.fetcher);
  fetcherRef.current = options.fetcher;

  const loadData = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    fetcherRef
      .current(controller.signal)
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
  }, [keyString]);

  useEffect(() => {
    void loadData();

    return () => {
      controllerRef.current.abort();
    };
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}
