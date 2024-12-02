import { DayEntryPoint } from "../../types/DayEntryPoint";

function getReportsIncrementSign(
  previousReport: number,
  currentReport: number
) {
  return previousReport - currentReport > 0 ? 1 : -1;
}

function isReportIncrementValid(
  previousReport: number,
  currentReport: number,
  expectedSign: 1 | -1 | undefined
) {
  const incrementStep = previousReport - currentReport;

  if (
    (expectedSign === 1 && incrementStep < 0) ||
    (expectedSign === -1 && incrementStep > 0)
  ) {
    return false;
  }

  const absoluteStep = Math.abs(incrementStep);
  if (absoluteStep < 1 || absoluteStep > 3) {
    return false;
  }

  return true;
}

function areReportsValidWithAllowedErrors(
  reports: number[],
  allowedErrors: number
) {
  let remainingErrors = allowedErrors;
  let sign: 1 | -1 | undefined = undefined;
  for (let index = 1; index < reports.length; index++) {
    if (sign === undefined) {
      sign = getReportsIncrementSign(reports[index - 1], reports[index]);
    }

    const isValid = isReportIncrementValid(
      reports[index - 1],
      reports[index],
      sign
    );
    if (!isValid) {
      if (remainingErrors > 0) {
        remainingErrors--;
        continue;
      }

      return false;
    }
  }

  return true;
}

function solvePartOne(lines: string[]) {
  const reportsLists = lines
    .map((line) => line.split(" ").map(Number))
    .map((reports) => areReportsValidWithAllowedErrors(reports, 0));

  console.log(
    "first part:",
    reportsLists.reduce((acc, curr) => (curr ? acc + 1 : acc), 0)
  );
}

function solvePartTwo(lines: string[]) {
  const reportsLists = lines
    .map((line) => line.split(" ").map(Number))
    .map((reports) => areReportsValidWithAllowedErrors(reports, 1));

  console.log(
    "second part:",
    reportsLists.reduce((acc, curr) => (curr ? acc + 1 : acc), 0)
  );
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");
  solvePartOne(lines);
  solvePartTwo(lines);
};
