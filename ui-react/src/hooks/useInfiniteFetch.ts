import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

type Mode = "INITIAL" | "NEXT";

interface UseInfiniteFetchOptions<TData, TSelected> {
  key: readonly unknown[];

  fetcher: (pageParam: number, signal: AbortSignal) => Promise<TData>;

  initialPageParam?: number;

  hasMore: (lastPage: number, lastData: TData) => boolean;

  select?: (pages: Map<number, TData>) => TSelected;
}

interface State<TData> {
  pages: Map<number, TData>;
  loading: boolean;
  error: string | null;
}

type Action<TData> =
  | {
      type: "FETCH_START";
    }
  | {
      type: "FETCH_SUCCESS";
      payload: {
        page: number;
        data: TData;
        mode: Mode;
      };
    }
  | {
      type: "FETCH_ERROR";
      payload: {
        error: string;
      };
    };

function reducer<TData>(
  state: State<TData>,
  action: Action<TData>,
): State<TData> {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_SUCCESS": {
      const { page, data, mode } = action.payload;

      const pages =
        mode === "INITIAL"
          ? new Map([[page, data]])
          : new Map(state.pages).set(page, data);

      return {
        pages,
        loading: false,
        error: null,
      };
    }

    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
}

interface UseInfiniteFetchReturn<TResponse> {
  data: TResponse;
  loading: boolean;
  error: string | null;
  fetchNext: () => void;
  refetch: () => void;
}

export default function useInfiniteFetch<TData, TSelected = Map<number, TData>>(
  options: UseInfiniteFetchOptions<TData, TSelected>,
): UseInfiniteFetchReturn<TSelected> {
  const { select, key, initialPageParam = 0, fetcher, hasMore } = options;

  const keyString = JSON.stringify(key);

  const [state, dispatch] = useReducer(reducer<TData>, {
    pages: new Map(),
    loading: false,
    error: null,
  });

  const pageRef = useRef(initialPageParam);

  const controllerRef = useRef<AbortController | null>(null);

  const isPendingRef = useRef(false);

  const fetcherRef = useRef(fetcher);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    fetcherRef.current = fetcher;
    hasMoreRef.current = hasMore;
  }, [fetcher, hasMore]);

  const loadData = useCallback(async (mode: Mode, initialPage?: number) => {
    controllerRef.current?.abort();

    const controller = new AbortController();

    controllerRef.current = controller;
    isPendingRef.current = true;

    dispatch({
      type: "FETCH_START",
    });

    const page = mode === "INITIAL" ? (initialPage ?? 0) : pageRef.current;

    try {
      const data = await fetcherRef.current(page, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      pageRef.current = page + 1;

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          page,
          data,
          mode,
        },
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      dispatch({
        type: "FETCH_ERROR",
        payload: {
          error:
            error instanceof Error ? error.message : "Something went wrong",
        },
      });
    } finally {
      if (controllerRef.current === controller) {
        isPendingRef.current = false;
      }
    }
  }, []);

  const fetchNext = useCallback(() => {
    if (isPendingRef.current) {
      return;
    }

    const lastPage = pageRef.current - 1;

    const lastData = state.pages.get(lastPage);

    if (!lastData) {
      return;
    }

    const hasMore = hasMoreRef.current(lastPage, lastData);

    if (!hasMore) {
      return;
    }

    void loadData("NEXT");
  }, [state.pages, loadData]);

  const refetch = useCallback(() => {
    pageRef.current = initialPageParam;

    void loadData("INITIAL", initialPageParam);
  }, [loadData, initialPageParam]);

  useEffect(() => {
    void refetch();

    return () => {
      controllerRef.current?.abort();
    };
  }, [keyString, refetch]);

  const data = useMemo(() => {
    if (select) {
      return select(state.pages);
    }

    return state.pages as unknown as TSelected;
  }, [state.pages, select]);

  return {
    data,
    loading: state.loading,
    error: state.error,
    fetchNext,
    refetch,
  };
}
