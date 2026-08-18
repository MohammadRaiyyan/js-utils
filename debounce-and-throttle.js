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
// Throttle: Default in trailing mode
function throttleTrailing(callback, delay = 200) {
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

// let executionCount = 0;
// const fire = throttleTrailing(() => executionCount++, 100);

// // Fire every 10ms for a brief moment
// const interval = setInterval(fire, 10);

// // Stop after 250ms and check results
// setTimeout(() => {
//   clearInterval(interval);

//   // In 250ms, a 100ms throttle should only allow 3 executions (at 0ms, 100ms, and 200ms)
//   if (executionCount === 3) {
//     console.log("✅ Pass: Throttled correctly!");
//   } else {
//     console.log(`❌ Fail: Executed ${executionCount} times instead of 3.`);
//   }
// }, 250);
// With leading and trailing configuration
function throttle(
  callback,
  delay = 200,
  option = { leading: true, trailing: true },
) {
  let lastcalled = 0;
  let timerId;
  return function throttledFn(...args) {
    const self = this;
    const now = Date.now();
    if (!option.leading && lastcalled === 0) {
      lastcalled = now;
    }

    if (now - lastcalled >= delay) {
      callback.apply(self, args);
      lastcalled = now;
      clearTimeout(timerId);
    } else if (option.trailing && !timerId) {
      timerId = setTimeout(() => {
        callback.apply(self, args);
        clearTimeout(timerId);
        lastcalled = option.leading ? now : 0;
      }, delay);
    }
  };
}
let executionCount = 0;
const fire = throttle(() => executionCount++, 100, {
  leading: false,
  trailing: true,
});

// Fire every 10ms
const interval = setInterval(fire, 10);

// Stop after 250ms and check results
setTimeout(() => {
  clearInterval(interval);

  // EXPLANATION OF THE MATH:
  // - 0ms to 100ms window: Spammed with calls. Fires trailing edge at 100ms. (Count: 1)
  // - 100ms to 200ms window: Spammed with calls. Fires trailing edge at 200ms. (Count: 2)
  // - 200ms to 250ms window: Spammed with calls. Trailing edge would fire at 300ms, but test ends at 250ms!

  const expectedCount = 2;

  if (executionCount === expectedCount) {
    console.log(
      `✅ Pass: Trailing throttle worked! Executed exactly ${executionCount} times.`,
    );
  } else {
    console.log(
      `❌ Fail: Expected ${expectedCount} executions, but got ${executionCount}.`,
    );
  }
}, 250);
