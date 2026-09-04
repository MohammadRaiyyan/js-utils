import { ErrorBoundary } from "react-error-boundary";

import TypeHead from "./components/typehead";

export default function App() {
  return (
    <main className="p-5">
      <ErrorBoundary
        onError={(e) => console.log("Error", e)}
        FallbackComponent={() => <div>Something went wrong</div>}
      >
        <TypeHead />
      </ErrorBoundary>
    </main>
  );
}
