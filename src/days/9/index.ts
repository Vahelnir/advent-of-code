import { on } from "events";
import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };
type Cell = { position: Position; value: number; checked: boolean };

function createCell(position: Position, value: number): Cell {
  return { position, value, checked: false };
}

function getCellAt(grid: Cell[][], { x, y }: Position): Cell {
  const cell = grid?.[y]?.[x];

  return cell ?? { position: { x, y }, value: Infinity };
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

function cellIsLowestPoint(grid: Cell[][], { value, position }: Cell) {
  const adjacentCells = getAdjacentCells(grid, position);
  return !adjacentCells.some((cell) => {
    return cell.value <= value;
  });
}

function getLowestCells(grid: Cell[][]) {
  const lowestCells: Cell[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const currentCell = getCellAt(grid, { x, y });
      if (cellIsLowestPoint(grid, currentCell)) {
        lowestCells.push(currentCell);
      }
    }
  }
  return lowestCells;
}

function parseGrid(lines: string[]): Cell[][] {
  return lines.map((line, y) =>
    line
      .split("")
      .map((height) => +height)
      .map((height, x) => createCell({ x, y }, height))
  );
}

function solveFirst(lines: string[]) {
  const grid = parseGrid(lines);
  const lowestCells = getLowestCells(grid);
  console.log(
    "first:",
    lowestCells.reduce((sum, cell) => sum + cell.value + 1, 0)
  );
}

function getBassinSize(grid: Cell[][], cell: Cell): Cell[] {
  if (cell.checked || cell.value === 9) {
    return [];
  }
  cell.checked = true;
  const adjacentCells = getAdjacentCells(grid, cell.position);
  const bassinCells = adjacentCells
    .filter((adjacentCell) => adjacentCell.value < 9)
    .flatMap((cell) => getBassinSize(grid, cell));
  return [cell, ...bassinCells];
}

function solveSecond(lines: string[]) {
  const grid = parseGrid(lines);
  const lowestCells = getLowestCells(grid);

  const allSums: number[] = [];
  const bassins: Cell[][] = [];
  for (const lowestCell of lowestCells) {
    const bassin = getBassinSize(grid, lowestCell);
    bassins.push(bassin);
    allSums.push(bassin.length);
  }

  console.log(
    "second:",
    allSums
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((acc, sum) => acc * sum, 1)
  );
  console.log(allSums);

  // DEBUG: generates the grid with colors representing the bassins
  //   const finalGrid = grid.map((row) => row.map((cell) => cell.value));
  //
  //   for (const bassin of bassins) {
  //     const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  //     for (const cell of bassin) {
  //       const { x, y } = cell.position;
  //       finalGrid[y][x] =
  //         `<span style="color: #${randomColor};" >${finalGrid[y][x]}</span>` as unknown as number;
  //     }
  //   }
  // console.log(finalGrid.map((row) => row.join("")).join("<br>"));
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
