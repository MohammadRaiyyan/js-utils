import { ErrorBoundary } from "react-error-boundary";

import AutoComplete from "./components/typehead/autocomplete";

export default function App() {
  return (
    <main className="p-5">
      <ErrorBoundary
        onError={(e) => console.log("Error", e)}
        FallbackComponent={() => <div>Something went wrong</div>}
      >
        <AutoComplete />
      </ErrorBoundary>
    </main>
  );
}
