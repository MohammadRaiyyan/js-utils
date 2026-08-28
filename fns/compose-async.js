function composeAsync(...fns) {
  return async function (...args) {
    let result = args;
    const functions = [...fns].reverse();
    for (let fn of functions) {
      result = await fn(...(Array.isArray(result) ? result : [result]));
    }
    return result;
  };
}

function a(x, y) {
  return new Promise((resolve) => setTimeout(() => resolve(x * y), 100));
}

function b(z) {
  return new Promise((resolve, reject) =>
    setTimeout(() => resolve(z + 5), 100),
  );
}

function c(r) {
  return new Promise((resolve) => setTimeout(() => resolve(r / 10), 100));
}

composeAsync(
  c,
  b,
  a,
)(5, 3)
  .then((result) => {
    console.log(result);
  })
  .catch(console.error);
