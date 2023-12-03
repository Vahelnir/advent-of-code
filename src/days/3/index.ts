import { DayEntryPoint } from "../../types/DayEntryPoint";

type Size = { width: number; height: number };
type Position = { x: number; y: number };
type SymbolCell = {
  letter: string;
  position: Position;
  index: number;
};
type FoundNumber = {
  number: number;
  symbol: SymbolCell | undefined;
};

const indexToPosition = ({ width, height }: Size, index: number) => ({
  x: index % width,
  y: Math.floor(index / height),
});

const positionToIndex = ({ width, height }: Size, { x, y }: Position) =>
  height * y + x;

const isNumberCell = (cell: string) =>
  cell.charCodeAt(0) >= 48 && cell.charCodeAt(0) <= 57;

const isSymbolCell = (cell: string) => cell !== "." && !isNumberCell(cell);

const ignoreOutOfBound =
  (size: Size) =>
  ({ x, y }: Position) =>
    x >= 0 && y >= 0 && x < size.width && y < size.height;

const getAllAdjacentPositions = ({ x, y }: Position): Position[] => {
  return [
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x - 1, y },
    { x, y: y - 1 },
    { x: x + 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y + 1 },
    { x: x - 1, y: y - 1 },
  ];
};

const solveFirst = (grid: string[], gridSize: Size) => {
  const numbers: FoundNumber[] = [];
  for (let i = 0; i < grid.length; i++) {
    let currentNumber = "";
    let cell = grid[i];
    let symbol: SymbolCell | undefined;

    const firstPosition = indexToPosition(gridSize, i);
    let currentPosition = firstPosition;
    while (isNumberCell(cell) && firstPosition.y === currentPosition.y) {
      currentPosition = indexToPosition(gridSize, i);
      currentNumber += cell;
      if (symbol === undefined) {
        symbol = getAllAdjacentPositions(indexToPosition(gridSize, i))
          .filter(ignoreOutOfBound(gridSize))
          .map((position) => {
            const index = positionToIndex(gridSize, position);
            return { position, index, letter: grid[index] };
          })
          .find((symbol) => isSymbolCell(symbol.letter));
      }
      cell = grid[++i];
      if (firstPosition.y !== indexToPosition(gridSize, i).y) {
        --i;
        break;
      }
    }

    if (currentNumber.length > 0) {
      numbers.push({
        number: Number(currentNumber),
        symbol,
      });
    }
  }

  return numbers.filter((number) => number.symbol !== undefined);
};

const solveSecond = (
  grid: string[],
  gridSize: Size,
  numbers: FoundNumber[]
) => {
  const grouppedBySymbolIndex = numbers.reduce((acc, number) => {
    if (!number.symbol || number.symbol.letter !== "*") {
      return acc;
    }

    if (!acc[number.symbol.index]) {
      acc[number.symbol.index] = [];
    }

    acc[number.symbol.index].push(number.number);
    return acc;
  }, {} as Record<string, number[]>);

  return Object.values(grouppedBySymbolIndex)
    .filter((pair) => pair.length === 2)
    .map(([left, right]) => left * right)
    .reduce((acc, ratio) => acc + ratio);
};

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");
  const gridSize = { width: lines[0].length, height: lines.length };
  const grid = lines.flatMap((line) => line.split(""));

  const numbers = solveFirst(grid, gridSize);

  console.log(
    "first",
    numbers.reduce((acc, number) => acc + number.number, 0)
  );
  console.log("second", solveSecond(grid, gridSize, numbers));
};
