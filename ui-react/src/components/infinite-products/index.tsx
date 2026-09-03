import { useCallback, useRef, useState } from "react";
import Filter from "./filter";
import useProducts from "./useProducts";
import ProductList from "./product-list";
import useIntersectionObsever from "../../hooks/useIntersectionObserver";

export default function InfiniteProducts() {
  const infiniteScrollRootRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const {
    data = [],
    error,
    fetchNext,
    loading,
  } = useProducts({
    filter: { limit: "10", q: search },
  });

  const sentinel = useIntersectionObsever(fetchNext, {
    root: infiniteScrollRootRef as unknown as Element,
  });

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);
  return (
    <main className="flex flex-col gap-6 p-4">
      <h2>Products</h2>
      <Filter onChangeSearch={handleSearch} />
      <div ref={infiniteScrollRootRef} className="max-h-100 overflow-y-auto">
        <ProductList products={data} />
        {loading && <span>Loading...</span>}
        {error && <span>{error}</span>}
        <div ref={sentinel} className="h-1 w-full" />
      </div>
    </main>
  );
}
