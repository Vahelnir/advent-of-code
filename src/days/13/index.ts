import { DayEntryPoint } from "../../types/DayEntryPoint";

const reverse = (str: string) => [...str].reverse().join("");

const diff = (a: string, b: string) => {
  let differences = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      differences++;
    }
  }
  return differences;
};

const checkVerticalReflection = (pattern: string[], errorMargin: number) => {
  for (let i = 1; i < pattern[0].length; i++) {
    const right = pattern.map((line) => [...line.slice(i)].join(""));
    const left = pattern.map((line) => [...line.slice(0, i)].join(""));

    if (
      (right[0].length >= left[0].length &&
        right.reduce(
          (differences, line, index) =>
            differences +
            diff(line.slice(0, left[index].length), reverse(left[index])),
          0,
        ) === errorMargin) ||
      (left[0].length >= right[0].length &&
        left.reduce(
          (differences, line, index) =>
            differences +
            diff(
              line.slice(line.length - right[index].length),
              reverse(right[index]),
            ),
          0,
        ) === errorMargin)
    ) {
      return i;
    }
  }

  return 0;
};

const transpose = (lines: string[]) => {
  return [...lines[0]].map((col, i) => lines.map((row) => row[i]).join(""));
};

const getPatternReflections = (pattern: string[], errorMargin = 0) => {
  const vertical = checkVerticalReflection(pattern, errorMargin);
  const horizontal = checkVerticalReflection(transpose(pattern), errorMargin);

  return { vertical, horizontal };
};

export const run: DayEntryPoint = (input) => {
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));

  console.log(
    "first",
    patterns
      .map((pattern) => getPatternReflections(pattern, 0))
      .reduce(
        (acc, { vertical, horizontal }) => acc + vertical + horizontal * 100,
        0,
      ),
  );

  console.log(
    "second",
    patterns
      .map((pattern) => getPatternReflections(pattern, 1))
      .reduce(
        (acc, { vertical, horizontal }) => acc + vertical + horizontal * 100,
        0,
      ),
  );

  // const index = 12;
  // const pattern = patterns[index];
  // console.log(pattern.join("\n"));
  // console.log(getPatternReflections(pattern));
};
