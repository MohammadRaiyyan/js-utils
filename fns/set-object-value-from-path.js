function set(obj, path, value) {
  const keys = Array.isArray(path)
    ? path
    : path.replaceAll("[", ".").replaceAll("]", "").split(".");

  let current = obj;

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;

    if (isLast) {
      current[key] = value;
      return;
    }

    if (current[key] == null) {
      current[key] = Number.isNaN(Number(keys[index + 1])) ? [] : {};
    }

    current = current[key];
  });

  return obj;
}

const object = { a: [{ b: { c: 3 } }] };

set(object, "a[0].b.c", 4);
console.log(object.a[0].b.c);
// 4

set(object, ["x", "0", "y", "z"], 5);
console.log(object.x[0].y.z);
// 5
