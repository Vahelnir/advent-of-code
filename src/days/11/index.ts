import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };
type Cell = {
  letter: string;
  position: Position;
};

const findEmptyRows = (universe: Cell[][]) => {
  const duplicateRows: number[] = [];
  column: for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[0].length; x++) {
      const cell = universe[y][x];
      if (cell.letter === "#") {
        continue column;
      }

      if (x === universe.length - 1) {
        duplicateRows.push(y);
      }
    }
  }
  return duplicateRows;
};

const findEmptyColumns = (universe: Cell[][]) => {
  const duplicateColumns: number[] = [];
  row: for (let x = 0; x < universe[0].length; x++) {
    for (let y = 0; y < universe.length; y++) {
      const cell = universe[y][x];
      if (cell.letter === "#") {
        continue row;
      }

      if (y === universe.length - 1) {
        duplicateColumns.push(x);
      }
    }
  }
  return duplicateColumns;
};

const isGalaxy = (cell: Cell) => cell.letter === "#";

const expandGalaxies = (universe: Cell[][], expandTimes: number) => {
  const duplicateColumns = findEmptyColumns(universe);
  const duplicateRows = findEmptyRows(universe);

  const starCells = universe.flat().filter(isGalaxy);
  for (const starCell of starCells) {
    starCell.position.x +=
      duplicateColumns.filter((column) => starCell.position.x > column).length *
      (expandTimes - 1);
    starCell.position.y +=
      duplicateRows.filter((row) => starCell.position.y > row).length *
      (expandTimes - 1);
  }
  return starCells;
};

const manhattanDistance = (a: Position, b: Position) =>
  Math.abs(b.x - a.x) + Math.abs(b.y - a.y);

const getDistances = (starCells: FlatArray<Cell[][], 1>[]) => {
  return starCells.reduce((map, { position }, index) => {
    starCells.forEach(({ position: pos }, secondIndex) => {
      if (index === secondIndex) {
        return;
      }
      const distance = manhattanDistance(position, pos);
      map.set(
        index < secondIndex
          ? `${index}:${secondIndex}`
          : `${secondIndex}:${index}`,
        distance,
      );
    });
    return map;
  }, new Map<string, number>());
};

const sum = (a: number, b: number) => a + b;

const solve = (universe: Cell[][], expand: number) => {
  const starCells = expandGalaxies(universe, expand);
  const distances = getDistances(starCells);
  return [...distances.values()].reduce(sum, 0);
};

export const run: DayEntryPoint = (input) => {
  const universe = input
    .split("\n")
    .map((line) => line.split(""))
    .map((line, y) =>
      line.map((rawCell, x): Cell => ({ position: { x, y }, letter: rawCell })),
    );

  console.log("first", solve(universe, 2));
  console.log("second", solve(universe, 1_000_000));
};
