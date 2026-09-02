import { useCallback, useEffect, useReducer, useRef } from "react";

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

interface State<TData = undefined> {
  data: TData;
  loading: boolean;
  error: string | null;
}

type Action<TData> =
  | {
      type: "SET_FETCH";
    }
  | {
      type: "SET_SUCCESS";
      payload: { data: TData };
    }
  | {
      type: "SET_ERROR";
      payload: { error: string | null };
    };

const initialState: State<undefined> = {
  data: undefined,
  error: null,
  loading: false,
};

function reducer<TData>(
  state: State = initialState,
  action: Action<TData>,
): State<TData> {
  switch (action.type) {
    case "SET_FETCH":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "SET_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload.data,
      };
    case "SET_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}

export default function useFetch<T>(
  options: UseFetchOption<T>,
): UseFetchReturn<T> {
  const [state, dispatch] = useReducer(reducer<T>, initialState);
  const controllerRef = useRef<AbortController | null>(null);
  const keyString = JSON.stringify(options.key);
  const fetcherRef = useRef(options.fetcher);

  useEffect(() => {
    fetcherRef.current = options.fetcher;
  }, [options.fetcher]);

  const loadData = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    dispatch({ type: "SET_FETCH" });
    fetcherRef
      .current(controller.signal)
      .then((result) => {
        dispatch({ type: "SET_SUCCESS", payload: { data: result } });
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        dispatch({
          type: "SET_ERROR",
          payload: {
            error:
              e instanceof Error
                ? e.message
                : "Something went wrong while loading the data",
          },
        });
      });
  }, []);

  useEffect(() => {
    void loadData();

    return () => {
      controllerRef.current.abort();
    };
  }, [loadData, keyString]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: loadData,
  };
}
