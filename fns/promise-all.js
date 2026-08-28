/*
Javascript Promises  does not have built in mechnaism to cancel promises, if any promise fails the Promise.myAll
does not waits for other inflight promises hence it does not returns any result.
It retruns result only when all promises are resolved.
*/
Promise.myAll = function (promises = []) {
  const result = new Array(promises.length);
  let processed = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((res) => {
          result[index] = res;
          processed++;
          if (processed === promises.length) {
            resolve(result);
          }
        })
        .catch(reject);
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
      console.log("Resolving Promise with message:", message);
      resolve(message);
    }, delay);
  });
}

Promise.myAll([
  callAPI("Call API 1", 200),
  callAPI("Call API 2", 100),
  callAPI("Call API 3", 300),
])
  .then(console.log)
  .catch(console.error);
