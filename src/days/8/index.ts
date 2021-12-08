import { DayEntryPoint } from "../../types/DayEntryPoint";

type MappedDigit = { digit: string; length: number; cables: string[] };

const digitLengthToNumber: Record<number, number | undefined> = {
  2: 1,
  3: 7,
  4: 4,
  7: 8,
};

const numberToDigit = [
  "abcefg",
  "cf",
  "acdeg",
  "acdfg",
  "bcdf",
  "abdfg",
  "abdefg",
  "acf",
  "abcdefg",
  "abcdfg",
];

function areArraysEqual(a: unknown[], b: unknown[]) {
  if (a.length !== b.length) return false;
  return !a.some((item) => !b.includes(item));
}
const isGuessableDigit = (digit: string) => [2, 3, 4, 7].includes(digit.length);
const stringToArray = (str: string) => [...str];

function getNumberFromDigitLength(digitLength: number) {
  return digitLengthToNumber[digitLength];
}

function solveFirst(lines: string[]) {
  let count = 0;
  for (const line of lines) {
    const [_, output] = line
      .split("|")
      .map((element) => element.trim().split(" "));

    const res = output.filter(isGuessableDigit);
    count += res.length;
  }
  console.log("first:", count);
}

function getMappingsFromInput(input: string) {
  const letterOccurences = stringToArray(input).reduce(
    (test, letter) =>
      letter === " " ? test : { ...test, [letter]: (test[letter] ?? 0) + 1 },
    {} as Record<string, number>
  );
  const [one, , four] = input
    .trim()
    .split(" ")
    .filter(isGuessableDigit)
    .sort((a, b) => a.length - b.length);
  return Object.entries(letterOccurences).reduce(
    (mapping: Record<string, string>, [letter, overlap]) => {
      if (overlap === 8) {
        if (one.includes(letter)) {
          mapping["c"] = letter;
        } else {
          mapping["a"] = letter;
        }
      } else if (overlap === 7) {
        if (four.includes(letter)) {
          mapping["d"] = letter;
        } else {
          mapping["g"] = letter;
        }
      } else if (overlap === 9) {
        mapping["f"] = letter;
      } else if (overlap === 6) {
        mapping["b"] = letter;
      } else {
        mapping["e"] = letter;
      }
      return mapping;
    },
    {}
  );
}

// solved thanks to this tip: https://www.reddit.com/r/adventofcode/comments/rbm0lz/comment/hnp0r46/?utm_source=share&utm_medium=web2x&context=3
function solveSecond(lines: string[]) {
  let finalNumber = 0;
  for (const line of lines) {
    const [input, output] = line.split("|");

    const mapping = getMappingsFromInput(input);
    const mappedDigits = numberToDigit.map((digit) =>
      [...digit].map((letter) => mapping[letter])
    );
    const numbers = output
      .trim()
      .split(" ")
      .map((outputDigit) =>
        mappedDigits.findIndex((mappedDigit) =>
          areArraysEqual([...outputDigit], mappedDigit)
        )
      );
    finalNumber += numbers
      .reverse()
      .reduce(
        (final, decimal, index) => final + decimal * Math.pow(10, index),
        0
      );
  }
  console.log("second:", finalNumber);
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
