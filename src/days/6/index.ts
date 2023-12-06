import { DayEntryPoint } from "../../types/DayEntryPoint";

const NUMBER_EXTRACTION_REGEX = /\d+/g;

const toNumber = (value: string) => Number(value);

const solveFirst = (times: number[], distances: number[]) => {
  let possibilities = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    let localPossibilities = 0;

    for (let j = 0; j < time; j++) {
      if (j * (time - j) > distance) {
        localPossibilities++;
      }
    }

    possibilities *= localPossibilities;
  }

  return possibilities;
};

const solveSecond = (rawTimes: string, rawDistances: string) => {
  const time = toNumber(rawTimes.replace("Time:", "").replaceAll(" ", ""));
  const distance = toNumber(
    rawDistances.replace("Distance:", "").replaceAll(" ", "")
  );

  let possibilities = 0;
  for (let j = 0; j < time; j++) {
    if (j * (time - j) > distance) {
      possibilities++;
    }
  }
  return possibilities;
};

export const run: DayEntryPoint = (input) => {
  const [rawTimes, rawDistances] = input.split("\n");
  const times =
    rawTimes
      .replace("Time:", "")
      .match(NUMBER_EXTRACTION_REGEX)
      ?.map(toNumber) ?? [];
  const distances =
    rawDistances
      .replace("Distance:", "")
      .match(NUMBER_EXTRACTION_REGEX)
      ?.map(toNumber) ?? [];

  console.log("first", solveFirst(times, distances));
  console.log("second", solveSecond(rawTimes, rawDistances));
};
