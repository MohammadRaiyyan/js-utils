/* METHOD 1 */
/*function getElementByStyles(root, property, value) {
  const result = [];

  if (window.getComputedStyle(root)[property] === value) {
    result.push(root);
  }
  const elements = Array.from(root.querySelectorAll("*"));

  elements.forEach((element) => {
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle[property] === value) {
      result.push(element);
    }
  });

  return result;
}*/

/* METHOD 2 */

function getComputedValue(property, value) {
  const element = document.createElement("div");
  element.style[property] = value;
  const computedStyle = window.getComputedStyle(
    document.body.appendChild(element),
  );
  const computedValue = computedStyle[property];
  document.body.removeChild(element);
  return computedValue;
}
function getElementByStyles(root, property, value) {
  const result = [];
  /* Get computed value since each browser handles computing differently hence value will not be same */
  const computedValue = getComputedValue(property, value);

  function search(element) {
    const computedPropVal = window.getComputedStyle(element)[property];
    if (computedPropVal === computedValue) {
      result.push(element);
    }
    for (let child of element.children) {
      search(child);
    }
  }

  search(root);

  return result;
}

console.log(
  getElementByStyles(document.getElementById("root"), "background", "green"),
);
