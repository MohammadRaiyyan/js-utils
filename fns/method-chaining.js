class Calculator {
  constructor() {
    this.total = 0;
  }
  add(val) {
    if (typeof val !== "number")
      throw TypeError("Provide correct value as a number");
    this.total += val;
    return this;
  }
  subtract(val) {
    if (typeof val !== "number")
      throw TypeError("Provide correct value as a number");
    this.total -= val;
    return this;
  }
  divide(val) {
    if (typeof val !== "number")
      throw TypeError("Provide correct value as a number");
    this.total /= val;
    return this;
  }
  multiply(val) {
    if (typeof val !== "number")
      throw TypeError("Provide correct value as a number");
    this.total *= val;
    return this;
  }

  get() {
    return this.total;
  }
}

const calculate = new Calculator();
console.log(calculate.add(10).add(20).subtract(5).multiply(2).divide(10).get());
