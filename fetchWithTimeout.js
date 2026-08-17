// Version 1
async function fetchWithTimeoutv1(promise, timeoutMs = 10000) {
  return await Promise.race([
    promise, // This will eventually resolve but race function does not cares if timeout promise is resolved first
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject("Promise timeout");
      }, timeoutMs);
    }),
  ]);
}

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

fetchWithTimeoutv1(callAPI("Call API 1", 500), 300)
  .then(console.log)
  .catch(console.error);

//  Version 2 = Abort the actual promise call if timeout
// TODO:
