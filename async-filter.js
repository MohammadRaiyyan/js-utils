function iterateeFn(num, callback) {
  setTimeout(function () {
    if (num % 2 === 0) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }, 2000);
}

async function myFilter(inputs, iterateeFn) {
  return new Promise((resolve, reject) => {
    if (!inputs) {
      reject(new TypeError("Inputs must be provided"));
      return;
    }
    if (inputs.length === 0) {
      resolve([]);
      return;
    }
    const results = [];
    let completed = 0;
    let isSettled = false;
    for (let [index, input] of inputs.entries()) {
      iterateeFn(input, (error, passes) => {
        if (isSettled) return;
        if (error) {
          isSettled = true;
          reject(error);
        } else {
          if (passes) {
            results[index] = input;
          }

          completed++;

          if (completed === inputs.length) {
            isSettled = true;
            resolve(results.filter((res) => res));
          }
        }
      });
    }
  });
}

myFilter([2, 4, 6, 8, 10, 11], iterateeFn)
  .then((res) => console.log("result:", res))
  .catch((e) => console.error(e));
