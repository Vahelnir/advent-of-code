import { DayEntryPoint } from "../../types/DayEntryPoint";

const STRING_DIGITS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const getNumber = (str: string | undefined) => {
  if (!str) {
    return "";
  }

  if (str.length === 1) {
    return str;
  }

  const foundStringNumber =
    STRING_DIGITS.findIndex((strNum) => strNum === str) + 1;
  return foundStringNumber.toString();
};

const extractDigits = (line: string): RegExpMatchArray | null => {
  const stringDigits = STRING_DIGITS.join("|");
  return line.match(
    new RegExp(`([0-9]|${stringDigits})((.*)([0-9]|${stringDigits}))*`)
  );
};

const digitsToNumber = (match: RegExpMatchArray | null): string => {
  if (!match) {
    return "0";
  }

  const first = getNumber(match[1]);
  const last = getNumber(match[4]);
  return first + (last || first);
};

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line !== "");
  const firstResult = lines
    .map(extractDigits)
    .map(digitsToNumber)
    .reduce((acc, lineValue) => acc + Number(lineValue), 0);
  console.log("first", firstResult);
};
