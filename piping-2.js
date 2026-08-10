const val = { salary: 10000 };

const getSalary = (person) => person.salary;
const addBonus = (netSalary) => netSalary + 1000;
const deductTax = (grossSalary) => grossSalary - grossSalary * 0.3;

function pipe(...funcs) {
  return function (value) {
    return funcs.reduce((acc, fn) => {
      acc = fn(acc);
      return acc;
    }, value);
  };
}

const result = pipe(getSalary, addBonus, deductTax)(val);
console.log("Result:", result);
