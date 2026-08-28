function piping(obj) {
  return function (...args) {
    for (let key in obj) {
      const val = obj[key];
      if (typeof val === "function") {
        obj[key] = val(...args);
      } else if (typeof val === "object") {
        obj[key] = piping(val)(...args);
      }
    }
    return obj;
  };
}
const input = {
  a: {
    b: (a, b, c) => a + b + c,
    c: (a, b, c) => a + b - c,
  },
  d: (a, b, c) => a - b - c,
  e: 1,
  f: true,
};
console.log(piping(input)(1, 1, 1));
