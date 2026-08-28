// To be done
function promisePriority(promises = []) {
  if (!Array.isArray(promises)) throw TypeError();
  let highest = 0;
  return new Promise((resolve, reject) => {
    promises.forEach(({ promise, priority }, index) => {
      Promise.resolve(promise)
        .then((res) => {
          if (highest == priority && index == promises.length) {
            resolve(res);
          }
        })
        .catch(reject);
      highest = priority > highest ? priority : highest;
    });
  });
}
