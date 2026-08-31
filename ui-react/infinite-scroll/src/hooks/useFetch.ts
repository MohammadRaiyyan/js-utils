import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../constants";

interface UseFetchReturn<T extends Record<string, unknown>> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
}

export default function useFetch<T extends Record<string, unknown>>(
  endpoint: string,
  params: Record<string, string>,
  infinite: boolean = false,
): UseFetchReturn<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    controller.current?.abort();
    controller.current = new AbortController();
    setIsLoading(true);
    setError(null);
    fetch(`${BASE_URL}${endpoint}?${new URLSearchParams(params)}`, {
      signal: controller.current.signal,
    })
      .then((res) => res.json())
      .then((result: T) => {
        if (infinite) {
          setData((prev) => ({ ...prev, result }));
        } else {
          setData(result);
        }
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") {
          return;
        }
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Something went wrong");
        }
      })
      .finally(() => setIsLoading(false));
    return () => {
      controller.current.abort();
    };
  }, [params, infinite]);

  return {
    isLoading,
    error,
    data,
  };
}
