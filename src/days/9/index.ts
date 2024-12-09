import { DayEntryPoint } from "../../types/DayEntryPoint";

export const run: DayEntryPoint = (input) => {
  const numbers = input
    .split("")
    .map(Number)
    .flatMap((n, index) =>
      index % 2 === 0 ? new Array(n).fill(index / 2) : new Array(n).fill(".")
    );

  for (let index = numbers.length - 1; index >= 0; index--) {
    const n = numbers[index];
    if (n === ".") {
      continue;
    }

    const nearestEmptySpace = numbers.indexOf(".");
    if (nearestEmptySpace === -1 || nearestEmptySpace > index) {
      break;
    }

    numbers[index] = ".";
    numbers[nearestEmptySpace] = n;
  }

  console.log(
    "first part:",
    numbers.reduce((acc, n, index) => (n === "." ? acc : acc + n * index), 0)
  );
};
