import { BASE_URL } from "../../constants";
import useFetch from "../../hooks/useFetch";
import type { PaginatedResponse } from "./types";
interface UsePostsProps {
  filter: {
    q: string;
    skip: string;
    limit: string;
  };
}

export default function useProducts(props: UsePostsProps) {
  const queryParams = new URLSearchParams(props.filter).toString();
  const { data, error, loading } = useFetch<PaginatedResponse>({
    fetcher: async (signal) => {
      const path = props.filter["q"]
        ? `${BASE_URL}/products/search?${queryParams}`
        : `${BASE_URL}/products?${queryParams}`;
      return fetch(path, {
        signal,
      }).then((res) => res.json());
    },
    key: ["products", queryParams],
  });
  return {
    data,
    error,
    loading,
  };
}
