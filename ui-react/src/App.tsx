import { ErrorBoundary } from "react-error-boundary";

import ModalExample from "./components/modal";

export default function App() {
  return (
    <ErrorBoundary
      onError={(e) => console.log("Error", e)}
      FallbackComponent={() => <div>Something went wrong</div>}
    >
      <ModalExample />
    </ErrorBoundary>
  );
}
