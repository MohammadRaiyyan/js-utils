// Map

Array.prototype.myMap = function (callback) {
  if (typeof callback !== "function") {
    throw new TypeError(
      `Expected callback function as an argument but got ${typeof callback}`,
    );
  }
  const result = [];
  const arr = this;
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i, arr));
  }
  return result;
};

console.log(
  "Map result: ",
  [1, 2, 3].myMap((item, index, arr) => {
    return item * 2;
  }),
);

// Filter

Array.prototype.myFilter = function (callback) {
  if (typeof callback !== "function") {
    throw new TypeError(
      `Expected callback function as an argument but got ${typeof callback}`,
    );
  }
  const result = [];
  const arr = this;
  for (let i = 0; i < arr.length; i++) {
    const isTruthy = callback(arr[i], i, arr);
    if (isTruthy) {
      result.push(arr[i]);
    }
  }
  return result;
};

console.log(
  "Filter result: ",
  [1, 2, 3].myFilter((item, index, arr) => {
    return item % 2 === 0;
  }),
);
