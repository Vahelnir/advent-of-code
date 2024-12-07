import { DayEntryPoint } from "../../types/DayEntryPoint";

type Equation = {
  test: number;
  numbers: number[];
};

function calculate(
  current: number,
  rest: number[],
  withConcatOperator: boolean
): number[] {
  if (rest.length === 0) {
    return [current];
  }

  const next = calculate(rest[0], rest.slice(1), withConcatOperator).flatMap(
    (value) =>
      withConcatOperator
        ? [current + value, current * value, Number(`${value}${current}`)]
        : [current + value, current * value]
  );

  return next;
}

function bruteForce({ test, numbers }: Equation, withConcatOperator = false) {
  // reversing to make sure we calculate from left to right
  const reversed = numbers.toReversed();
  const result = calculate(reversed[0], reversed.slice(1), withConcatOperator);
  return { test, valid: result.includes(test) };
}

export const run: DayEntryPoint = (input) => {
  const rawEquations = input.split("\n");
  const equations = rawEquations.map((equation) => {
    const [testValue, numbers] = equation.split(": ");
    return {
      test: Number(testValue),
      numbers: numbers.split(" ").map(Number),
    } satisfies Equation;
  });

  console.log(
    "part one:",
    equations
      .map((e) => bruteForce(e, false))
      .filter((e) => e.valid)
      .reduce((acc, e) => acc + e.test, 0)
  );
  console.log(
    "part two:",
    equations
      .map((e) => bruteForce(e, true))
      .filter((e) => e.valid)
      .reduce((acc, e) => acc + e.test, 0)
  );
};
