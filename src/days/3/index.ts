import type { DayEntryPoint } from "../../types/DayEntryPoint";

export function findHighestDigitInBank(
  bank: number[],
  remainingDigits: number,
) {
  const sortedBank = bank.toSorted((a, b) => b - a);
  for (let i = 0; i < sortedBank.length; i++) {
    let highest = sortedBank[i];
    if (!highest) {
      throw new Error(`no highest found in bank: ${bank}`);
    }

    const highestIndex = bank.indexOf(highest);
    const remainingLength = bank.length - (highestIndex + 1);
    if (remainingLength >= remainingDigits) {
      return { highest, highestIndex };
    }
  }

  throw new Error(`no highest found in bank: ${bank}`);
}

function findBankJoltage(banks: number[][], digitCount: number) {
  let outputs: number[] = [];
  for (const bank of banks) {
    const digits: number[] = [];
    let bankQueue = [...bank];
    for (let i = 0; i < digitCount; i++) {
      const { highest, highestIndex } = findHighestDigitInBank(
        bankQueue,
        digitCount - i - 1,
      );
      bankQueue = bankQueue.slice(highestIndex + 1);
      digits.push(highest);
    }

    const output = digits.reduce(
      (acc, digit, index) => acc + digit * 10 ** (digitCount - index - 1),
      0,
    );
    outputs.push(output);
  }

  return outputs.reduce((a, b) => a + b, 0);
}

export const run: DayEntryPoint = async (input) => {
  const banks = input.split("\n").map((line) => line.split("").map(Number));

  console.log("part 1:", findBankJoltage(banks, 2));
  console.log("part 2:", findBankJoltage(banks, 12));
};
