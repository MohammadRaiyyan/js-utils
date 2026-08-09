function flat(arr, depth = 1) {
  if (!Array.isArray(arr)) throw TypeError("Provide correct argument");
  const result = [];
  function process(items, d) {
    for (let item of items) {
      if (Array.isArray(item)) {
        if (depth === d) {
          return;
        }
        process(item, d + 1);
      } else {
        result.push(item);
      }
    }
  }
  process(arr, 0);
  return result;
}

console.log(flat([1, 2, [3, 4], [[5, [6]]]], 3));
