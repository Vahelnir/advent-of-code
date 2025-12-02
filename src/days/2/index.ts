import type { DayEntryPoint } from "../../types/DayEntryPoint";

export const run: DayEntryPoint = async (input) => {
  const ranges = input.split(",").map((part) => {
    const [start, end] = part.split("-").map(Number);
    if (!start || !end || start > end) {
      throw new Error(`Invalid range: ${part}`);
    }
    return { start, end };
  });

  let sum = 0;
  for (const range of ranges) {
    console.log(`Range from ${range.start} to ${range.end}`);
    for (let i = range.start; i <= range.end; i++) {
      const numberAsString = i.toString();
      const firstPart = numberAsString.slice(0, numberAsString.length / 2);
      const secondPart = numberAsString.slice(numberAsString.length / 2);
      if (firstPart === secondPart) {
        sum += i;
      }
    }
  }
  console.log("Total sum:", sum);
};
