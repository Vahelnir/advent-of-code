import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };
type Cell = {
  position: Position;
  risk: number;
  visited: boolean;
  parent: Cell | null;
  riskSum: number;
};

function createCell(position: Position, risk: number): Cell {
  return {
    position,
    risk,
    visited: false,
    parent: null,
    riskSum: risk,
  };
}

function getCellAt(grid: Cell[][], { x, y }: Position): Cell {
  const cell: Cell | undefined = grid?.[y]?.[x];

  return (
    cell ?? {
      position: { x, y },
      risk: Infinity,
      visited: true,
    }
  );
}

function getAdjacentCells(
  grid: Cell[][],
  { x: currentX, y: currentY }: Position
) {
  return [
    getCellAt(grid, { x: currentX - 1, y: currentY }),
    getCellAt(grid, { x: currentX, y: currentY + 1 }),
    getCellAt(grid, { x: currentX + 1, y: currentY }),
    getCellAt(grid, { x: currentX, y: currentY - 1 }),
  ];
}

function parseGrid(lines: string[]): Cell[][] {
  return lines.map((line, y) =>
    line
      .split("")
      .map((height) => +height)
      .map((height, x) => createCell({ x, y }, height))
  );
}

async function solveFirst(lines: string[]) {
  const grid = parseGrid(lines);
  const start = grid[0][0];
  const end = grid[grid.length - 1][grid[0].length - 1];
  const queue = [start];
  while (queue.length > 0) {
    const cell = queue.shift();
    if (!cell) {
      continue;
    }
    if (
      cell.position.x === grid[0].length - 1 &&
      cell.position.y === grid.length - 1
    ) {
      break;
    }
    cell.visited = true;
    const adjacentCells = getAdjacentCells(grid, cell.position)
      .filter((adjacent) => !adjacent.visited)
      .map((adjacent) => {
        if (
          !adjacent.parent ||
          adjacent.risk + cell.riskSum < adjacent.riskSum
        ) {
          adjacent.parent = cell;
          adjacent.riskSum = cell.riskSum + adjacent.risk;
        }
        return adjacent;
      });
    queue.push(...adjacentCells);
  }

  let parent = end.parent;
  let sum = end.risk;
  while (parent !== null) {
    if (parent.parent) {
      sum += parent.risk;
    }
    parent = parent.parent;
  }
  console.log("first:", sum);
}

async function solveSecond(lines: string[]) {}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
