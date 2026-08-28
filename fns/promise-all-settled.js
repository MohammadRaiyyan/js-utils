/*
Promise.allSettled returns the result of all the promises it does not rejects any
*/

Promise.myAllSettled = function (promises = []) {
  const result = new Array(promises.length);
  let processed = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((res) => {
          result[index] = {
            status: "Fullfilled",
            value: res,
          };
          processed++;
        })
        .catch((reason) => {
          result[index] = {
            status: "Rejected",
            reason,
          };
          processed++;
        })
        .finally(() => {
          if (processed === promises.length) {
            resolve(result);
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
Promise.myAllSettled([
  callAPI("Call API 1", 500),
  callAPI("Call API 2", 400),
  callAPI("Call API 3", 300, true),
])
  .then(console.log)
  .catch(console.error);
