import { ErrorBoundary } from "react-error-boundary";

import ShoppingCart from "./components/shoppingCart";

export default function App() {
  return (
    <ErrorBoundary
      onError={(e) => console.log("Error", e)}
      FallbackComponent={() => <div>Something went wrong</div>}
    >
      <ShoppingCart />
    </ErrorBoundary>
  );
}
