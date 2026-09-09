import { ErrorBoundary } from "react-error-boundary";

import MultiStepForm from "./components/multi-step-form";

export default function App() {
  return (
    <ErrorBoundary
      onError={(e) => console.log("Error", e)}
      FallbackComponent={() => <div>Something went wrong</div>}
    >
      <MultiStepForm />
    </ErrorBoundary>
  );
}
