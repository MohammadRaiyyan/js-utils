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
// constructWord();
//
// Throttle
function throttle(callback, delay = 200) {
  let lastcalled = 0;
  return function throttledFn(...args) {
    const self = this;
    const now = Date.now();
    if (now - lastcalled >= delay) {
      callback.apply(self, args);
      lastcalled = now;
    }
  };
}

let executionCount = 0;
const fire = throttle(() => executionCount++, 100);

// Fire every 10ms for a brief moment
const interval = setInterval(fire, 10);

// Stop after 250ms and check results
setTimeout(() => {
  clearInterval(interval);

  // In 250ms, a 100ms throttle should only allow 3 executions (at 0ms, 100ms, and 200ms)
  if (executionCount === 3) {
    console.log("✅ Pass: Throttled correctly!");
  } else {
    console.log(`❌ Fail: Executed ${executionCount} times instead of 3.`);
  }
}, 250);
