import { ErrorBoundary } from "react-error-boundary";

import OTP from "./components/otp";

export default function App() {
  return (
    <ErrorBoundary
      onError={(e) => console.log("Error", e)}
      FallbackComponent={() => <div>Something went wrong</div>}
    >
      <OTP />
    </ErrorBoundary>
  );
}
