/*
Fixed length currying
*/
function curry(fn) {
  return function inner(...args) {
    if (args.length < fn.length) {
      return (...nextArgs) => {
        return inner(...args, ...nextArgs);
      };
    } else {
      return fn(...args);
    }
  };
}
function sum(a, b, c) {
  return a + b + c;
}
console.log(curry(sum)(1)(2, 3));

/*
Variable size
*/
