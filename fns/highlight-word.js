function highlightWord(str, keywords) {
  const matches = [];
  for (const keyword of keywords) {
    let start = str.indexOf(keyword);

    while (start !== -1) {
      matches.push({
        start,
        end: start + keyword.length - 1,
      });
      start = str.indexOf(keyword, start + 1);
    }
  }
  matches.sort((a, b) => a.start - b.start);
  const merged = [];
  if (matches.length === 0) return str;

  merged.push(matches[0]);
  for (let i = 1; i < matches.length; i++) {
    let current = matches[i];
    let lastmerged = merged[merged.length - 1];

    if (lastmerged.end + 1 >= current.start) {
      lastmerged.end = Math.max(lastmerged.end, current.end);
    } else {
      merged.push(current);
    }
  }
  let result = "";
  let lastIndex = 0;
  for (const interval of merged) {
    result += str.slice(lastIndex, interval.start);
    result += `<mark>${str.slice(interval.start, interval.end + 1)}</mark>`;
    lastIndex = interval.end + 1;
  }
  result += str.slice(lastIndex);
  return result;
}

const str = "Ultimate JavaScript / FrontEnd Guide JavaScript Guide";
const words = ["Front", "End", "JavaScript"];

console.log(highlightWord(str, words));
