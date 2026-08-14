const user = {
  name: "Sam",
  age: 30,
};

function printUser() {
  console.log(`My name is ${this.name} and I'm ${this.age} years old.`);
}

Function.prototype.myCall = function (thisObj, ...args) {
  const callerKey = Symbol();
  const caller = this;
  thisObj[callerKey] = caller;
  const result = thisObj[callerKey](...args);
  delete thisObj[callerKey];

  return result;
};

printUser.myCall(user);
