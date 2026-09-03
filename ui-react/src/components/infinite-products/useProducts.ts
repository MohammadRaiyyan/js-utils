import { BASE_URL } from "../../constants";
import useInfiniteFetch from "../../hooks/useInfiniteFetch";
import type { PaginatedResponse, Product } from "./types";

interface UseProductsProps {
  filter: {
    q: string;
    limit: string;
  };
}

export default function useProducts(props: UseProductsProps) {
  const queryParams = new URLSearchParams(props.filter).toString();

  return useInfiniteFetch<PaginatedResponse, Product[]>({
    fetcher: async (page, signal) => {
      const skip = page * +props.filter.limit;
      const path = props.filter["q"]
        ? `${BASE_URL}/products/search?${queryParams}&skip=${skip}`
        : `${BASE_URL}/products?${queryParams}&skip=${skip}`;
      return fetch(path, { signal }).then((res) => res.json());
    },
    key: ["products", queryParams],
    hasMore: (lastPage: number, lastdata: PaginatedResponse) => {
      return Math.floor(lastdata.total / +props.filter.limit) >= lastPage;
    },
    initialPageParam: 0,
    select: (pages) => {
      return pages.flatMap((page) => page.products);
    },
  });
}
