import type { DayEntryPoint } from "../../types/DayEntryPoint";

type Range = { start: number; end: number };

function firstPart(ranges: Range[]) {
  let sum = 0;
  for (const range of ranges) {
    for (let i = range.start; i <= range.end; i++) {
      const numberAsString = i.toString();
      const patternLength = numberAsString.length / 2;
      if (patternLength % 1 !== 0) {
        continue;
      }

      const firstPart = numberAsString.slice(0, numberAsString.length / 2);
      const secondPart = numberAsString.slice(numberAsString.length / 2);
      if (firstPart === secondPart) {
        sum += i;
      }
    }
  }
  console.log("Total sum:", sum);
}

function secondPart(ranges: Range[]) {
  let sum = 0;
  for (const range of ranges) {
    for (let value = range.start; value <= range.end; value++) {
      const numberAsString = value.toString();
      const numberLength = numberAsString.length;
      for (
        let patternLength = 1;
        patternLength <= numberLength / 2;
        patternLength++
      ) {
        const repeating = numberLength / patternLength;
        if (repeating % 1 !== 0) {
          continue;
        }

        const pattern = numberAsString.slice(0, patternLength);
        const repeatedPattern = pattern.repeat(repeating);
        if (repeatedPattern === numberAsString) {
          console.log(
            `Found repeating pattern ${pattern} in number ${numberAsString}`,
          );
          sum += value;
          break;
        }
      }
    }
  }
  console.log("Total sum:", sum);
}

export const run: DayEntryPoint = async (input) => {
  const ranges: Range[] = input.split(",").map((part) => {
    const [start, end] = part.split("-").map(Number);
    if (!start || !end || start > end) {
      throw new Error(`Invalid range: ${part}`);
    }
    return { start, end };
  });

  firstPart(ranges);
  secondPart(ranges);
};
