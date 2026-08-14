const user = {
  name: "Sam",
  age: 30,
};

function printUser() {
  console.log(`My name is ${this.name} and I'm ${this.age} years old.`);
}

Function.prototype.myCall = function (thisObj, ...args) {
  const self = thisObj || globalThis;
  const callerKey = Symbol();
  const caller = this;
  self[callerKey] = caller;
  const result = self[callerKey](...args);
  delete self[callerKey];

  return result;
};

printUser.myCall(user);

Function.prototype.myApply = function (thisObj, args = []) {
  if (!Array.isArray(args)) {
    throw new TypeError(`Expected argument type Array but got ${typeof args}`);
  }
  const callerKey = Symbol();
  const caller = this;
  thisObj[callerKey] = caller;
  const result = thisObj[callerKey](...args);
  delete thisObj[callerKey];

  return result;
};

printUser.myApply(user);
