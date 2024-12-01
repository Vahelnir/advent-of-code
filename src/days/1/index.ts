import { DayEntryPoint } from "../../types/DayEntryPoint";

function parseInput(input: string): { left: number[]; right: number[] } {
  const lines = input.split("\n");

  const lists: { left: number[]; right: number[] } = { left: [], right: [] };
  for (const line of lines) {
    if (line.trim() === "") {
      continue;
    }

    const [left, right] = line.split("   ");
    lists.left.push(Number(left));
    lists.right.push(Number(right));
  }
  return lists;
}

function solvePartOne(input: string) {
  const lists = parseInput(input);

  lists.left.sort((a, b) => a - b);
  lists.right.sort((a, b) => a - b);

  const differences: number[] = [];
  for (let i = 0; i < lists.left.length; i++) {
    differences.push(Math.abs(lists.right[i] - lists.left[i]));
  }

  console.log(
    "part one:",
    differences.reduce((acc, curr) => acc + curr, 0)
  );
}

function solvePartTwo(input: string) {
  const lists = parseInput(input);

  const occurences = lists.right.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: acc[curr] ? acc[curr] + 1 : 1,
    }),
    {} as Record<number, number | undefined>
  );

  console.log(
    "part two:",
    lists.left
      .map((num) => num * (occurences[num] ?? 0))
      .reduce((acc, curr) => acc + curr)
  );
}

export const run: DayEntryPoint = (input) => {
  const lists = parseInput(input);

  solvePartOne(input);
  solvePartTwo(input);
};
