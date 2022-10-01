import { DayEntryPoint } from "../../types/DayEntryPoint";

type Pattern = { pattern: string; append: string };

function step(patterns: Pattern[], input: string) {
  let offset = 0;
  let output = input;
  for (let i = 0; i < input.length; i++) {
    const pair = output.slice(i + offset, i + offset + 2);
    if (pair.length < 2) {
      break;
    }

    const pattern = patterns.find((pattern) => pattern.pattern === pair);
    if (!pattern) {
      continue;
    }

    const polymerTemplateArray = output.split("");
    polymerTemplateArray.splice(i + offset + 1, 0, pattern.append);
    output = polymerTemplateArray.join("");
    offset++;
  }

  return output;
}

function countElements(polymerTemplate: string) {
  const count: Record<string, number> = {};
  for (const element of polymerTemplate) {
    if (count[element] === undefined) {
      count[element] = 0;
    }
    count[element]++;
  }
  return count;
}

async function solveFirst(lines: string[]) {
  const polymerTemplate = lines[0];
  const patterns: Pattern[] = lines
    .slice(1)
    .map((entry) => entry.split(" -> "))
    .map(([pattern, append]) => ({ pattern, append }));
  let newPolymerTemplate: string = polymerTemplate;
  for (let i = 0; i < 10; i++) {
    newPolymerTemplate = step(patterns, newPolymerTemplate);
  }

  const sortedCount = Object.values(countElements(newPolymerTemplate)).sort(
    (a, b) => b - a
  );

  console.log("first:", sortedCount[0] - sortedCount[sortedCount.length - 1]);
}

async function solveSecond(lines: string[]) {
  const polymerTemplate = lines[0];
  const patterns: Pattern[] = lines
    .slice(1)
    .map((entry) => entry.split(" -> "))
    .map(([pattern, append]) => ({ pattern, append }));
  let newPolymerTemplate: string = polymerTemplate;
  for (let i = 0; i < 40; i++) {
    newPolymerTemplate = step(patterns, newPolymerTemplate);
    console.log("step", i);
  }

  const sortedCount = Object.values(countElements(newPolymerTemplate)).sort(
    (a, b) => b - a
  );

  console.log("second:", sortedCount[0] - sortedCount[sortedCount.length - 1]);
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
