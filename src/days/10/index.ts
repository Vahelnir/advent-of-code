import { DayEntryPoint } from "../../types/DayEntryPoint";

const PIPE_LETTERS = ["|", "-", "L", "J", "7", "F", "S"] as const;

type PipeLetter = (typeof PIPE_LETTERS)[number];

type Position = { x: number; y: number };
type Cell = {
  position: Position;
  letter: string;
  isLoop: boolean;
  isInLoop: boolean;
};

const isPipe = (pipe: Cell) => PIPE_LETTERS.includes(pipe.letter as PipeLetter);

const up = ({ x, y }: Position) => ({ x, y: y - 1 });
const down = ({ x, y }: Position) => ({ x, y: y + 1 });
const left = ({ x, y }: Position) => ({ x: x - 1, y });
const right = ({ x, y }: Position) => ({ x: x + 1, y });

const getPipeTips = ({ letter, position }: Cell) => {
  if (letter === "|") {
    return [up(position), down(position)];
  }

  if (letter === "-") {
    return [left(position), right(position)];
  }

  if (letter === "L") {
    return [up(position), right(position)];
  }

  if (letter === "J") {
    return [left(position), up(position)];
  }

  if (letter === "7") {
    return [left(position), down(position)];
  }

  if (letter === "F") {
    return [down(position), right(position)];
  }

  if (letter === "S") {
    return [up(position), down(position), left(position), right(position)];
  }

  return [];
};

const getAdjacentCells = (grid: Cell[][], pipe: Cell) => {
  return getPipeTips(pipe)
    .filter(
      ({ x, y }) => x >= 0 && y >= 0 && y < grid.length && x < grid[0].length,
    )
    .map(({ x, y }) => grid[y][x])
    .filter((cell) => isPipe(cell));
};

const findLoop = (grid: Cell[][], startingPoint: Cell) => {
  const recursive = (cell: Cell, path: Cell[]): Cell[] | undefined => {
    const adjacentCells = getAdjacentCells(grid, cell);

    const start = adjacentCells.find(({ letter }) => letter === "S");
    if (start && path.length > 1) {
      return [...path, cell];
    }

    for (const adjacent of adjacentCells.filter(
      (cell) => !path.some((c) => c === cell),
    )) {
      const newPath = recursive(adjacent, [...path, cell]);
      if (newPath) {
        return newPath;
      }
    }
  };

  return recursive(startingPoint, []);
};

// seems to be working for my input, but shouldn't (example 1 part 2 returns 6 but should be 7)
const solveSecond = (grid: Cell[][]) => {
  const horizontal: Cell[] = [];
  for (let y = 0; y < grid.length; y++) {
    let isInLoop = false;
    for (let x = 0; x < grid[0].length; x++) {
      const cell = grid[y][x];
      if (["|", "L", "J", "S"].includes(cell.letter) && cell.isLoop) {
        isInLoop = !isInLoop;
      } else if (isInLoop && !cell.isLoop) {
        horizontal.push(cell);
      }
    }
  }
  horizontal.forEach((c) => (c.isInLoop = true));

  return horizontal.length;
};

export const run: DayEntryPoint = (input) => {
  const grid = input.split("\n").map((line, y) =>
    line.split("").map(
      (cell, x): Cell => ({
        position: { x, y },
        letter: cell,
        isLoop: false,
        isInLoop: false,
      }),
    ),
  );

  const cellList = grid.flat(2);

  const startingCell = cellList.find(({ letter }) => letter === "S");
  if (!startingCell) {
    return;
  }

  const loop = findLoop(grid, startingCell);
  console.log("first", (loop?.length ?? 0) / 2);
  loop?.forEach((c) => (c.isLoop = true));
  console.log("second", solveSecond(grid));
  // display(grid);
};

const display = (grid: Cell[][]) => {
  console.log(
    grid
      .map((line) =>
        line
          .map((line) =>
            line.isInLoop ? "*" : line.isLoop ? "&" : line.letter,
          )
          .join(""),
      )
      .join("\n"),
  );
};
