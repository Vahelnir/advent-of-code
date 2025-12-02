import type { DayEntryPoint } from "../../types/DayEntryPoint";
import expectedValues from "./compare_expected_values.json" assert { type: "json" };

const MAX_DIAL_VALUE = 100;
const START_DIAL_VALUE = 50;

function circularMod(value: number, add: number, max: number) {
  const result = (value + add + max) % max;
  if (result < 0 || result >= max) {
    return circularMod(result, 0, max);
  }
  return result;
}

export const run: DayEntryPoint = async (input) => {
  const values = input.split("\n").map((line) => {
    const result = /(L|R)(\d+)/.exec(line);
    if (!result) {
      throw new Error("Invalid instruction: " + line);
    }

    const isNegative = result[1] === "L";
    return Number(result[2]) * (isNegative ? -1 : 1);
  });

  let i = 0;
  let totalFoundZeros = 0;
  let position = START_DIAL_VALUE;
  for (const value of values) {
    const expectedValue = expectedValues[i++];
    const previousPosition = position;
    position = circularMod(position, value, MAX_DIAL_VALUE);

    let foundZeros = 0;
    const sum = value + previousPosition;
    if (value < 0 && sum < 0) {
      foundZeros += 1 + Math.floor(Math.abs(sum) / MAX_DIAL_VALUE);
    }
    if (value > 0 && sum - MAX_DIAL_VALUE >= 0) {
      const rest = sum - MAX_DIAL_VALUE;
      foundZeros += 1 + Math.floor(rest / MAX_DIAL_VALUE);
    }
    if (expectedValue !== foundZeros) {
      throw new Error(
        `Unexpected number of zeros found for move ${value} from position ${previousPosition}. Expected ${expectedValue}, got ${foundZeros}`,
      );
    }
    console.log(previousPosition, value, foundZeros, "-->", position, sum);
    totalFoundZeros += foundZeros;
  }

  console.log("Day 1 Part 1:", totalFoundZeros);
};
