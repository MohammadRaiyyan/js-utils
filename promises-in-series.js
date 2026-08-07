async function executePromiseInSeries(promises = []) {
  if (!Array.isArray(promises)) throw TypeError();
  const result = [];
  for (let promise of promises) {
    try {
      const res = await Promise.resolve(promise);
      result.push(res);
    } catch (error) {
      // Depends on req.
    }
  }
  return result;
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

executePromiseInSeries([
  callAPI("Call API 1", 500),
  callAPI("Call API 2", 400),
  callAPI("Call API 3", 300),
])
  .then(console.log)
  .catch(console.error);
