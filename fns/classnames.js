function classnames(...args) {
  const result = [];

  function process(item) {
    if (typeof item === "string") {
      result.push(item);
    } else if (typeof item === "number") {
      result.push(String(item));
    } else if (Array.isArray(item)) {
      item.forEach(process);
    } else if (item && typeof item === "object") {
      Object.entries(item).forEach(([key, value]) => {
        if (value) {
          result.push(key);
        }
      });
    }
  }

  args.forEach(process);

  return result.join(" ");
}

console.log(
  classnames(
    "p-2 mb-4",
    { "bg-gray": false, "bg-blue": true },
    ["mt-3", { "text-red": true }],
    0,
    1,
    false,
    true,
    undefined,
    [5, 3, true, false, { 11: true }],
  ),
);
