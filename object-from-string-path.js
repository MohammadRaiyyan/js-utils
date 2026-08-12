function get(obj = {}, path = "") {
  path = path.replace("[", ".");
  path = path.replace("]", "");
  const keys = path.split(".");
  let val = obj;
  for (let key of keys) {
    val = val[key];
  }
  return val;
}

const obj = {
  a: {
    b: {
      c: [1, 2, 3],
    },
  },
};

console.log(get(obj, "a.b.c"));
console.log(get(obj, "a.b.c.0"));
console.log(get(obj, "a.b.c[1]"));
console.log(get(obj, "a.b.c[3]"));

// Output:
// [1,2,3]
// 1
// 2
// undefined
