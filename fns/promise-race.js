/*
  Promise.race resolves or rejects directly when anything happens first
*/

Promise.myRace = function (promises = []) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise).then(resolve).catch(reject);
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
Promise.myRace([
  callAPI("Call API 1", 500),
  callAPI("Call API 2", 400),
  callAPI("Call API 3", 300),
])
  .then(console.log)
  .catch(console.error);
