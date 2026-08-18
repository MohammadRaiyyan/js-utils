// Debounce
function debounce(callback, delay = 200) {
  let timerId;
  const chars = [];
  return function debouncedFn(...args) {
    chars.push(...args);
    const self = this;
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.call(self, chars.join(""));
      clearTimeout(timerId);
    }, delay);
  };
}

const debouncedFn = debounce((word) => {
  console.log("Printing final word at once:", word);
}, 500);

function constructWord() {
  const chars = ["r", "e", "a", "c", "t"];
  for (let ch of chars) {
    console.log("Printing each char:", ch);
    debouncedFn(ch);
  }
}
constructWord();
