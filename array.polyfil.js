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
