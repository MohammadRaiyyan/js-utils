import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

interface IProduct {
  id: number;
  title: string;
}

function Product(props: { product: IProduct }) {
  return (
    <li className="px-3 py-2 hover:bg-gray-200 w-full">
      {props.product.title}
    </li>
  );
}
function Products(props: { products: IProduct[] }) {
  return (
    <ul className="flex items-start flex-col gap-2 w-full">
      {props.products.map((product) => {
        return <Product key={product.id} product={product} />;
      })}
    </ul>
  );
}
interface UsefetchProps<T> {
  key: readonly unknown[];
  fetcher: (signal: AbortSignal) => Promise<T[]>;
}
interface UseFetchReturn<T> {
  data: T[] | undefined;
  loading: boolean;
  error: string | null;
}
interface FetchState<T> {
  loading: boolean;
  data: T[] | undefined;
  error: null | string;
}
const initialState: FetchState<undefined> = {
  data: undefined,
  loading: false,
  error: null,
};
type Action<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { data: T[] } }
  | { type: "FETCH_ERROR"; payload: { error: string | null } };

function reducer<T>(
  state: FetchState<T> = initialState,
  action: Action<T>,
): FetchState<T> {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload.data,
      };
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
function useFetch<T>(props: UsefetchProps<T>): UseFetchReturn<T> {
  const { fetcher, key } = props;
  const [state, dispatch] = useReducer(reducer<T>, initialState);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    dispatch({ type: "FETCH_START" });
    try {
      const response = await fetcher(controller.signal);

      if (controllerRef.current !== controller) return;

      dispatch({ type: "FETCH_SUCCESS", payload: { data: response } });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      if (controllerRef.current !== controller) return;
      dispatch({ type: "FETCH_ERROR", payload: { error: e } });
    }
  }, [fetcher]);

  useEffect(() => {
    void fetchData();
    return () => {
      controllerRef.current?.abort();
    };
  }, [fetchData, key]);

  return state;
}

function useDebouncedValue(value = "", delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState("");
  const timeRef = useRef<number | null>(null);
  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, [value, delay]);
  return debouncedValue;
}
export default function AutoComplete() {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebouncedValue(search);

  const key = useMemo(() => {
    return ["products", debouncedValue];
  }, [debouncedValue]);

  const fetcher = useCallback(
    async (signal: AbortSignal) => {
      return fetch(
        `https://dummyjson.com/products/search?q=${debouncedValue}`,
        {
          signal,
        },
      ).then((res) => {
        const response = res.json() as unknown as { products: IProduct[] };
        const { products = [] } = response;
        return products;
      });
    },
    [debouncedValue],
  );

  const { loading, data, error } = useFetch({ key, fetcher });

  return (
    <div className="relative flex items-center justify-center">
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 h-9 w-56 p-2"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <div className="absolute z-40 top-10 border border-gray-300 shadow-2xl w-56 p-2">
        {loading ? (
          <span>Loading....</span>
        ) : error ? (
          <span>{error}</span>
        ) : data.length > 0 ? (
          <Products products={data} />
        ) : (
          <span>No Products</span>
        )}
      </div>
    </div>
  );
}
