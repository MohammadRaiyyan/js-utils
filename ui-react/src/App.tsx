import { ErrorBoundary } from "react-error-boundary";

import AdvanceTodo from "./components/AdvanceTodo";

export default function App() {
  return (
    <main className="p-5">
      <ErrorBoundary
        onError={(e) => console.log("Error", e)}
        FallbackComponent={() => <div>Something went wrong</div>}
      >
        <AdvanceTodo />
      </ErrorBoundary>
    </main>
  );
}
