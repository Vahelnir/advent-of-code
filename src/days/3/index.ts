import { DayEntryPoint } from "../../types/DayEntryPoint";

const MATCH_REGEX = /mul\(\d+,\d+\)/g;

function solvePartOne(input: string) {
  const matches = input.match(MATCH_REGEX);
  console.log(
    "first part:",
    matches
      ?.map((match) => match.slice(4, -1).split(",").map(Number))
      .map(([a, b]) => a * b)
      .reduce((acc, curr) => acc + curr, 0)
  );
}

function solvePartTwo(input: string) {
  const matches = input.match(/(mul|don't|do)\(((\d+),(\d+))?\)/g);
  if (!matches) {
    return;
  }

  let sum = 0;
  let state: "do" | "dont" = "do";
  for (const match of matches) {
    if (match === "don't()") {
      state = "dont";
    } else if (match === "do()") {
      state = "do";
    } else if (match.startsWith("mul(") && state === "do") {
      const args = match
        .slice(4, -1)
        .split(",")
        .map(Number)
        .filter((s) => typeof s === "number" && !isNaN(s));
      if (args.length !== 2) {
        continue;
      }
      console.log(match);

      sum += args[0] * args[1];
    }
  }
  console.log("second part:", sum);
}

export const run: DayEntryPoint = (input) => {
  solvePartOne(input);
  solvePartTwo(input);
};
