import { useCallback, useRef, useState } from "react";

interface UseMutationReturn<TData, TVariables extends Record<string, unknown>> {
  data: TData | undefined;
  loading: boolean;
  error: string | null;
  mutate: (variables: TVariables) => Promise<void>;
}

type MutationFn<TData, TVariables> = (
  payload: TVariables,
  signal: AbortSignal,
) => Promise<TData>;

export default function useMutation<
  TData,
  TVariables extends Record<string, unknown>,
>(
  mutationFn: MutationFn<TData, TVariables>,
): UseMutationReturn<TData, TVariables> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const mutationFnRef = useRef(mutationFn);
  mutationFnRef.current = mutationFn;

  const mutate = useCallback(async (variables: TVariables) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setError(null);
    setLoading(true);
    try {
      const result = await mutationFnRef.current(variables, controller.signal);
      if (controller.signal.aborted) return;
      setData(result);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(
        e instanceof Error ? e.message : "Something went wrong while updating",
      );
    } finally {
      if (controller.signal.aborted) return;
      setLoading(false);
    }
  }, []);

  return {
    data,
    error,
    loading,
    mutate,
  };
}
