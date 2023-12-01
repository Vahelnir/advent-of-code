import { DayEntryPoint } from "../../types/DayEntryPoint";

type ExtractedDigits = [string | undefined, string | undefined];

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

const STRING_DIGITS_REGEX = STRING_DIGITS.join("|");

const EXTRACT_DIGIT_FROM_START_REGEX = new RegExp(
  `([0-9]|${STRING_DIGITS_REGEX}).*`
);

const EXTRACT_DIGIT_FROM_END_REGEX = new RegExp(
  `.*([0-9]|${STRING_DIGITS_REGEX})`
);

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

const extractDigits = (line: string): ExtractedDigits => [
  line.match(EXTRACT_DIGIT_FROM_START_REGEX)?.[1],
  line.match(EXTRACT_DIGIT_FROM_END_REGEX)?.[1],
];

const digitsToNumber = ([firstDigit, lastDigit]: ExtractedDigits): string => {
  const first = getNumber(firstDigit);
  const last = getNumber(lastDigit);
  return first + last;
};

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line !== "");
  const firstResult = lines
    .map(extractDigits)
    .map(digitsToNumber)
    .reduce((acc, lineValue) => acc + Number(lineValue), 0);
  console.log("first", firstResult);
};
