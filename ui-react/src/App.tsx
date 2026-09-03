import { ErrorBoundary } from "react-error-boundary";
import InfiniteProducts from "./components/infinite-products";
import ProductList from "./components/paginated-products/product-list";
import Products from "./components/paginated-products";

export default function App() {
  return (
    <main className="p-5">
      <ErrorBoundary
        onError={(e) => console.log("Error", e)}
        FallbackComponent={() => <div>Something went wrong</div>}
      >
        <InfiniteProducts />
      </ErrorBoundary>
    </main>
  );
}
