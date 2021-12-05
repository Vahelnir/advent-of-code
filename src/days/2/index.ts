import { DayEntryPoint } from "../../types/DayEntryPoint";

const linesToInstructions: (lines: string[]) => [string, number][] = (lines) =>
  lines
    .map((line) => line.split(" "))
    .map(([direction, amountString]) => [direction, +amountString]);

async function solveFirst(lines: string[]) {
  const instructions: [string, number][] = linesToInstructions(lines);

  let depth = 0;
  let horizontal = 0;
  const actions: Record<string, (amount: number) => void> = {
    forward: (amount) => (horizontal += amount),
    up: (amount) => (depth -= amount),
    down: (amount) => (depth += amount),
  };
  for (const [direction, amount] of instructions) {
    actions[direction]?.(amount);
  }
  console.log("first:", horizontal, depth, horizontal * depth);
}

async function solveSecond(lines: string[]) {
  const instructions: [string, number][] = linesToInstructions(lines);

  let aim = 0;
  let depth = 0;
  let horizontal = 0;
  const actions: Record<string, (amount: number) => void> = {
    forward: (amount) => {
      horizontal += amount;
      depth += aim * amount;
    },
    up: (amount) => (aim -= amount),
    down: (amount) => (aim += amount),
  };
  for (const [direction, amount] of instructions) {
    actions[direction]?.(amount);
  }
  console.log("second:", horizontal, depth, aim, horizontal * depth);
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");
  solveFirst([...lines]);
  solveSecond([...lines]);
};
