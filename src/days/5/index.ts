import type { DayEntryPoint } from "../../types/DayEntryPoint";

type ValueInterval = {
  start: number;
  end: number;
};

export const run: DayEntryPoint = async (input) => {
  const [rawIntervals, rawValues] = input.split("\n\n");
  if (!rawIntervals || !rawValues) {
    throw new Error("Invalid input format");
  }

  const intervals: ValueInterval[] = rawIntervals.split("\n").map((line) => {
    const [start, end] = line.split("-").map(Number);
    if (start === undefined || end === undefined) {
      throw new Error(`Invalid interval: ${line}`);
    }
    return { start, end } satisfies ValueInterval;
  });
  const values = rawValues.split("\n").map(Number);

  const optimizedIntervals: ValueInterval[] = [];
  let last: ValueInterval | null = null;
  const sortedIntervals = intervals.toSorted(
    (a, b) => a.start - b.start || a.end - b.end,
  );
  for (const interval of sortedIntervals) {
    if (last === null) {
      optimizedIntervals.push(interval);
      last = interval;
      continue;
    }

    if (last.end < interval.start) {
      optimizedIntervals.push(interval);
      last = interval;
    } else {
      last.end = Math.max(last.end, interval.end);
    }
  }

  console.log(optimizedIntervals.length, intervals.length);

  console.log(
    "part 1:",
    values.filter((value) =>
      intervals.some(({ start, end }) => value >= start && value <= end),
    ).length,
  );

  console.log(
    "part 2:",
    optimizedIntervals
      .map(({ start, end }) => end - start + 1)
      .reduce((a, b) => a + b, 0),
  );
};
