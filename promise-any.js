/*
Promise.any tries to resolve any one of the promise if none of them resolves it then rejects whole
*/
Promise.myAny = function (promises = []) {
  if (!Array.isArray(promises)) throw TypeError();
  let failed = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch((reason) => {
          failed++;
          if (failed === promises.length) {
            reject(reason);
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
