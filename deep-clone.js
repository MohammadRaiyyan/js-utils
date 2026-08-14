function deepClone(input, seen = new WeakMap()) {
  if (input === null || typeof input !== "object") {
    return input;
  }
  if (seen.has(input)) {
    return seen.get(input);
  }
  const clone = Array.isArray(input) ? [] : {};
  seen.set(input, clone);
  return Object.keys(input).reduce((acc, key) => {
    acc[key] = deepClone(input[key], seen);
    return acc;
  }, clone);
}

const obj = {
  name: "Sam",
  address: {
    city: "NYC",
  },
};
obj.selfRef = obj;
let user1 = deepClone(obj);

obj.address.zip = 5000;
console.log(user1);
