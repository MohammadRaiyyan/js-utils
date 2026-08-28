function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const STRATEGY = Object.freeze({
  FIXED: "FIXED",
  LINEAR_BACKOFF: "LINEAR_BACKOFF",
  EXPONENTIAL_BACKOFF: "EXPONENTIAL_BACKOFF",
});

function getDelay(strategy, baseDelay, attempt) {
  switch (strategy) {
    case STRATEGY.LINEAR_BACKOFF:
      return baseDelay * (attempt + 1);

    case STRATEGY.EXPONENTIAL_BACKOFF:
      return baseDelay * Math.pow(2, attempt);

    case STRATEGY.FIXED:
    default:
      return baseDelay;
  }
}

function retryPromiseWithDelay(
  operation,
  retries = 3,
  baseDelay = 500,
  error = "Retry error",
  strategy = STRATEGY.FIXED,
  attempt = 0,
) {
  return new Promise((resolve, reject) => {
    operation()
      .then(resolve)
      .catch(async () => {
        if (retries === 0) {
          reject(error);
          return;
        }

        const delay = getDelay(strategy, baseDelay, attempt);

        console.log(
          `Retry ${attempt + 1} after ${delay}ms (${retries} retries left)`,
        );

        await wait(delay);

        retryPromiseWithDelay(
          operation,
          retries - 1,
          baseDelay,
          error,
          strategy,
          attempt + 1,
        )
          .then(resolve)
          .catch(reject);
      });
  });
}

function callAPI() {
  console.log(new Date().toISOString(), "API CALL");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() < 0.2;

      console.log(success ? "✅ PASS" : "❌ FAIL");

      success ? resolve("Pass") : reject("Failed");
    }, 200);
  });
}

retryPromiseWithDelay(
  callAPI,
  3,
  500,
  "Retry limit exceeded",
  STRATEGY.EXPONENTIAL_BACKOFF,
)
  .then(console.log)
  .catch(console.error);
