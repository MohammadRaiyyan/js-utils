/*
Input:
{
  A: "12",
  B: 23,
  C: {
    P: 23,
    O: {
       L: 56
    },
    Q: [1, 2]
   }
}

Output:
{
  "A": "12"
  "B": 23,
  "C.O.L": 56,
  "C.P": 23,
  "C.Q.0": 1,
  "C.Q.1": 2,
}

*/

function deepFlat(obj) {
  function process(o, parent = "") {
    const result = {};
    for (let key in o) {
      const val = o[key];
      const newKey = parent ? `${parent}.${key}` : key;
      if (val != null && typeof val === "object") {
        let nextResult = process(val, newKey);
        Object.assign(result, nextResult);
      } else {
        result[newKey] = val;
      }
    }
    return result;
  }

  return process(obj);
}

console.log(
  deepFlat({
    A: "12",
    B: 23,
    C: {
      P: 23,
      O: {
        L: 56,
      },
      Q: [1, 2],
    },
  }),
);
