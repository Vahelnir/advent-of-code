import { DayEntryPoint } from "../../types/DayEntryPoint";

const PIPE_LETTERS = ["|", "-", "L", "J", "7", "F", "S"] as const;

type PipeLetter = (typeof PIPE_LETTERS)[number];

type Position = { x: number; y: number };
type Cell = {
  position: Position;
  letter: string;
  previousNode?: Cell;
  distance: number;
  visited: boolean;
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
      path;
    }
  };

  return recursive(startingPoint, []);
};

const depthFirstSearch = (grid: Cell[][], startingPoint: Cell) => {
  const stack = [startingPoint];
  while (stack.length > 0) {
    const pipe = stack.pop();
    if (!pipe || !isPipe(pipe)) {
      continue;
    }

    const adjacentCells = getAdjacentCells(grid, pipe);
    const start = adjacentCells.find(({ letter }) => letter === "S");
    if (start) {
      start.previousNode = pipe;
    }
    adjacentCells
      .filter(({ visited }) => !visited)
      .forEach((cell) => {
        const newDistance = pipe.distance + 1;
        if (cell.distance > newDistance) {
          return;
        }

        cell.distance = newDistance;
        cell.previousNode = pipe;
        stack.unshift(cell);
      });
    pipe.visited = true;
  }
};

export const run: DayEntryPoint = (input) => {
  const grid = input.split("\n").map((line, y) =>
    line.split("").map(
      (cell, x): Cell => ({
        position: { x, y },
        letter: cell,
        previousNode: undefined,
        distance: 0,
        visited: false,
      }),
    ),
  );

  const cellList = grid.flat(2);

  const startingCell = cellList.find(({ letter }) => letter === "S");
  if (!startingCell) {
    return;
  }

  // console.log(findLoop(grid, startingCell)?.length);
  // depthFirstSearch(grid, startingCell);
  // display(grid);
  console.log("first", (findLoop(grid, startingCell)?.length ?? 0) / 2);
};

const display = (grid: Cell[][]) => {
  console.log(
    grid.map((line) => line.map((line) => line.distance).join("")).join("\n"),
  );
};
