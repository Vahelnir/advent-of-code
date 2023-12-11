import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };

const expand = (universe: string[][]) => {
  const duplicateColumns: number[] = [];
  row: for (let x = 0; x < universe[0].length; x++) {
    for (let y = 0; y < universe.length; y++) {
      const cell = universe[y][x];
      if (cell === "#") {
        continue row;
      }

      if (y === universe.length - 1) {
        duplicateColumns.push(x);
      }
    }
  }

  const duplicateRows: number[] = [];
  column: for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[0].length; x++) {
      const cell = universe[y][x];
      if (cell === "#") {
        continue column;
      }

      if (x === universe.length - 1) {
        duplicateRows.push(y);
      }
    }
  }

  const newUniverse = universe.map((line) => line.slice());

  console.log(duplicateColumns, duplicateRows);
  newUniverse.forEach((line) => {
    duplicateColumns.forEach((c, index) => line.splice(c + index + 1, 0, "."));
  });

  const emptyRow = new Array(newUniverse[0].length).fill(".");
  duplicateRows.forEach((r, index) => {
    newUniverse.splice(r + index + 1, 0, emptyRow.slice());
  });

  return newUniverse;
};

const manhattanDistance = (a: Position, b: Position) =>
  Math.abs(b.x - a.x) + Math.abs(b.y - a.y);

export const run: DayEntryPoint = (input) => {
  const universe = input.split("\n").map((line) => line.split(""));
  const expandedUniverse = expand(universe);
  const starPositions = expandedUniverse
    .map((c, y) => c.map((v, x): [Position, string] => [{ x, y }, v]))
    .flat()
    .filter((v) => v[1] === "#");

  const s = starPositions.reduce((map, [position], index) => {
    starPositions.forEach(([pos], secondIndex) => {
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
  // console.log(
  //   s,
  //   expandedUniverse[0].length,
  //   expandedUniverse.length,
  //   universe[0].length,
  //   universe.length,
  // );
  console.log(
    "first",
    [...s.values()].reduce((acc, v) => acc + v, 0),
  );

  // display(expandedUniverse);
};

const display = (universe: string[][]) => {
  console.log(
    universe.map((cell) => cell.map((line) => line).join("")).join("\n"),
  );
};
