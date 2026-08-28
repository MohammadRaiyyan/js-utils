function executeInBatch(promises = [], batchSize = 2) {
  return new Promise((resolve, reject) => {
    let results = [];
    let currentIndex = 0;
    function process() {
      const batch = promises.slice(currentIndex, batchSize + currentIndex);
      currentIndex = batchSize + currentIndex;
      Promise.all(batch)
        .then((res) => {
          results = [...results, ...res];
          if (currentIndex >= promises.length) {
            resolve(results);
          } else {
            process();
          }
        })
        .catch(reject)
        .finally(() => {
          console.log("Executed:", batch);
        });
    }
    process();
  });
}

function callAPI(message, delay, doReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (doReject) {
        reject(`Rejected Promise with message: ${message}`);
        return;
      }
      console.log("Resolving Promise with message:", message);
      resolve(message);
    }, delay);
  });
}

executeInBatch(
  [
    callAPI("Call API 1", 200),
    callAPI("Call API 2", 100),
    callAPI("Call API 3", 300),
    callAPI("Call API 4", 250),
    callAPI("Call API 5", 200),
  ],
  2,
)
  .then(console.log)
  .catch(console.error);
