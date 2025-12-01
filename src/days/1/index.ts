import type { DayEntryPoint } from "../../types/DayEntryPoint";

const MAX_DIAL_VALUE = 100;
const START_DIAL_VALUE = 50;

function circularMod(value: number, add: number, max: number) {
  const result = (value + add + max) % max;
  if (result < 0 || result >= max) {
    return circularMod(result, 0, max);
  }
  return result;
}

export const run: DayEntryPoint = (input) => {
  const values = input.split("\n").map((line) => {
    const result = /(L|R)(\d+)/.exec(line);
    if (!result) {
      throw new Error("Invalid instruction: " + line);
    }

    const [, direction, value] = result;
    const isNegative = direction === "L";
    return Number(value) * (isNegative ? -1 : 1);
  });

  let foundZeros = 0;
  let position = START_DIAL_VALUE;
  for (const value of values) {
    position = circularMod(position, value, MAX_DIAL_VALUE);
    console.log(position);
    if (position === 0) {
      foundZeros++;
    }
  }

  console.log("Day 1 Part 1:", foundZeros);
};
