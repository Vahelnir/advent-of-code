import type { DayEntryPoint } from "../../types/DayEntryPoint";

export const run: DayEntryPoint = async (input) => {
  const banks = input.split("\n").map((line) => line.split("").map(Number));

  let outputs: number[] = [];
  for (const bank of banks) {
    const sortedBank = bank.toSorted((a, b) => b - a);
    let highest = sortedBank[0];
    if (!highest) {
      throw new Error(`no highest found in bank: ${bank}`);
    }

    let highestIndex = bank.indexOf(highest);
    if (highestIndex + 1 === bank.length) {
      highest = sortedBank[1];
      if (!highest) {
        throw new Error(`no highest found in bank: ${bank}`);
      }

      highestIndex = bank.indexOf(highest);
    }

    console.log(highestIndex, bank.length);
    const [secondHighest] = bank
      .slice(highestIndex + 1)
      .toSorted((a, b) => b - a);
    if (!secondHighest) {
      throw new Error(`no second highest found in bank: ${bank}`);
    }

    outputs.push(highest * 10 + secondHighest);
  }

  console.log(
    "part 1:",
    outputs,
    outputs.reduce((a, b) => a + b, 0),
  );
};
