import { useCallback, useMemo, useReducer } from "react";
import { initialState, reducer } from "./state";

import Pagination from "./pagination";
import ProductList from "./product-list";
import Search from "./search";
import useProducts from "./useProducts";

export default function Products() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    data = { products: [], total: 0 },
    loading,
    error,
  } = useProducts({
    filter: {
      limit: state.limit.toString(),
      skip: (state.page * state.limit).toString(),
      q: state.search,
    },
  });

  const hasMore = useMemo(
    () => Math.floor(data.total / state.limit) > state.page,
    [data?.total, state.limit, state.page],
  );

  const handlePageChange = useCallback(
    (newPage: number) =>
      dispatch({ type: "SET_PAGE", payload: { page: newPage } }),
    [dispatch],
  );
  const handleLimitChange = useCallback(
    (newLimit: number) =>
      dispatch({ type: "SET_LIMIT", payload: { limit: newLimit } }),
    [dispatch],
  );
  const handleSearchChange = useCallback(
    (value: string) =>
      dispatch({ type: "SET_SEARCH", payload: { search: value } }),
    [dispatch],
  );

  return (
    <div className="flex flex-col gap-4">
      <h2>Post List</h2>
      <Search onSearchChange={handleSearchChange} />
      {loading ? (
        <span>Loading...</span>
      ) : error ? (
        <span>${error}</span>
      ) : data?.products.length ? (
        <ProductList products={data?.products ?? []} />
      ) : (
        <span>No Products found</span>
      )}
      <Pagination
        onPageChange={handlePageChange}
        currentPage={state.page}
        currentLimit={state.limit}
        hasMore={hasMore}
        disabled={!data || data?.total === 0}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
