/*
Promise.any tries to resolve any one of the promise if none of them resolves it then rejects whole with aggregated error
*/
Promise.myAny = function (promises = []) {
  if (!Array.isArray(promises)) throw TypeError();
  let failed = 0;
  const failedResults = new Array(promises.length);
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch((reason) => {
          failedResults[index] = {
            status: "Rejected",
            reason,
          };
          failed++;
          if (failed === promises.length) {
            reject(new AggregateError(failedResults));
          }
        });
    });
  });
};

function callAPI(message, delay, doReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (doReject) {
        reject(`Rejected Promise with message: ${message}`);
        return;
      }
      resolve(message);
    }, delay);
  });
}
Promise.myAny([
  callAPI("Call API 1", 500, true),
  callAPI("Call API 2", 400, true),
  callAPI("Call API 3", 300, true),
])
  .then(console.log)
  .catch(console.error);
