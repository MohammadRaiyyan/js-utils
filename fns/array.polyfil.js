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

// Reduce

Array.prototype.myReduce = function (callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError(
      `Expected callback function as an argument but got ${typeof callback}`,
    );
  }
  const arr = this;
  let acc = initialValue ?? this[0];
  let startIndex = initialValue != undefined ? 0 : 1;
  for (let i = startIndex; i < arr.length; i++) {
    acc = callback(acc, arr[i], i, arr);
  }
  return acc;
};

console.log(
  "Reduce sum result: ",
  [1, 2, 3].myReduce((acc, item, index, arr) => {
    return acc + item;
  }, 0),
);
console.log(
  "Reduce sum without initial result: ",
  [1, 2, 3].myReduce((acc, item, index, arr) => {
    return acc + item;
  }),
);
console.log(
  "Reduce group result: ",
  [1, 2, 3].myReduce((acc, item, index, arr) => {
    const isEven = item % 2 === 0;
    if (isEven) {
      acc.isEven = acc.isEven ? [...acc.isEven, item] : [item];
    } else {
      acc.isOdd = acc.isOdd ? [...acc.isOdd, item] : [item];
    }
    return acc;
  }, {}),
);
