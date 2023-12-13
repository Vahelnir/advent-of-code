import { DayEntryPoint } from "../../types/DayEntryPoint";

const reverse = (str: string) => [...str].reverse().join("");

const checkVerticalReflection = (pattern: string[]) => {
  for (let i = 1; i < pattern[0].length; i++) {
    const right = pattern.map((line) => [...line.slice(i)].join(""));
    const left = pattern.map((line) => [...line.slice(0, i)].join(""));

    if (
      (right[0].length >= left[0].length &&
        right.every((line, index) => line.startsWith(reverse(left[index])))) ||
      (left[0].length >= right[0].length &&
        left.every((line, index) => line.endsWith(reverse(right[index]))))
    ) {
      return i;
    }
  }

  return 0;
};

const transpose = (lines: string[]) => {
  return [...lines[0]].map((col, i) => lines.map((row) => row[i]).join(""));
};

const getPatternReflections = (pattern: string[]) => {
  const vertical = checkVerticalReflection(pattern);
  const horizontal = checkVerticalReflection(transpose(pattern));

  return { vertical, horizontal };
};

export const run: DayEntryPoint = (input) => {
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));
  const res = patterns.map(getPatternReflections);

  console.log(
    "first",
    res.reduce(
      (acc, { vertical, horizontal }) => acc + vertical + horizontal * 100,
      0,
    ),
  );

  // const index = 12;
  // const pattern = patterns[index];
  // console.log(pattern.join("\n"));
  // console.log(getPatternReflections(pattern));
};
