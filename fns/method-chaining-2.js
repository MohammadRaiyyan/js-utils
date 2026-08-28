class Calculate {
  constructor() {
    this.total = 0;
  }
  crore(val) {
    this.total += val * 100_000_00;
    return this;
  }
  lacs(val) {
    this.total += val * 100_000;
    return this;
  }
  thousand(val) {
    this.total += val * 1000;
    return this;
  }
  hundred(val) {
    this.total += val * 100;
    return this;
  }
  ten(val) {
    this.total += val * 10;
    return this;
  }
  unit(val) {
    this.total += val;
    return this;
  }
  value() {
    return this.total;
  }
}

const calculate1 = new Calculate();
const calculate2 = new Calculate();
const amount = calculate1.lacs(9).lacs(1).thousand(10).ten(1).unit(1).value();
console.log(amount === 1010011);

const amount2 = calculate2
  .lacs(15)
  .crore(5)
  .crore(2)
  .lacs(20)
  .thousand(45)
  .crore(7)
  .value();
console.log(amount2 === 143545000);
