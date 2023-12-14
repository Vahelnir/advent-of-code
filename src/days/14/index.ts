import { DayEntryPoint } from "../../types/DayEntryPoint";

type Direction = "up" | "down" | "left" | "right";
type Position = { x: number; y: number };

function memoize<T extends (...args: any[]) => unknown>(
  func: T,
  getKey: (...args: Parameters<T>) => string,
): T;
function memoize(
  func: (...args: unknown[]) => unknown,
  getKey: (...args: unknown[]) => string,
): (...args: unknown[]) => unknown {
  const cache = {} as Record<string, unknown>;
  return (...args: any[]) => {
    const key = getKey(...args);
    const inCache = cache[key];
    if (inCache) {
      return inCache;
    }
    const value = func(...args);
    cache[key] = func(...args);
    return value;
  };
}
const move =
  // memoize(
  (previousGrid: string[][], direction: Direction) => {
    const grid = previousGrid.map((line) => line.slice());
    if (direction === "up") {
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
          const cell = grid[y][x];
          if (cell !== "O") {
            continue;
          }

          let newPosition: Position = { x, y: 0 };
          for (let aboveY = y - 1; aboveY >= 0; aboveY--) {
            if ("O#".includes(grid[aboveY][x])) {
              newPosition = { x, y: aboveY + 1 };
              break;
            }
          }

          grid[y][x] = ".";
          grid[newPosition.y][newPosition.x] = "O";
        }
      }
    } else if (direction === "down") {
      for (let y = grid.length - 1; y >= 0; y--) {
        for (let x = 0; x < grid[0].length; x++) {
          const cell = grid[y][x];
          if (cell !== "O") {
            continue;
          }

          let newPosition: Position = { x, y: grid.length - 1 };
          for (let underY = y + 1; underY < grid.length; underY++) {
            if ("O#".includes(grid[underY][x])) {
              newPosition = { x, y: underY - 1 };
              break;
            }
          }

          grid[y][x] = ".";
          grid[newPosition.y][newPosition.x] = "O";
        }
      }
    } else if (direction === "right") {
      for (let y = 0; y < grid.length; y++) {
        for (let x = grid[0].length - 1; x >= 0; x--) {
          const cell = grid[y][x];
          if (cell !== "O") {
            continue;
          }

          let newPosition: Position = { x: grid[0].length - 1, y };
          for (let rightX = x + 1; rightX < grid[0].length; rightX++) {
            if ("O#".includes(grid[y][rightX])) {
              newPosition = { x: rightX - 1, y };
              break;
            }
          }

          grid[y][x] = ".";
          grid[newPosition.y][newPosition.x] = "O";
        }
      }
    } else {
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
          const cell = grid[y][x];
          if (cell !== "O") {
            continue;
          }

          let newPosition: Position = { x: 0, y };
          for (let leftX = x - 1; leftX >= 0; leftX--) {
            if ("O#".includes(grid[y][leftX])) {
              newPosition = { x: leftX + 1, y };
              break;
            }
          }

          grid[y][x] = ".";
          grid[newPosition.y][newPosition.x] = "O";
        }
      }
    }
    return grid;
  };
//   (grid, direction) => direction + "-" + gridToString(grid),
// );

const gridToString = (grid: string[][]) =>
  grid.map((line) => line.join("")).join("\n");

const solveFirst = (original_grid: string[][]) => {
  let grid = original_grid.map((line) => line.slice());
  grid = move(grid, "up");

  const sum = grid.reduce(
    (sum, line, index) =>
      sum + line.filter((cell) => cell === "O").length * (grid.length - index),
    0,
  );

  console.log("first", sum);
};

const cycle = memoize(
  (grid: string[][]) => {
    grid = move(grid, "up");
    grid = move(grid, "left");
    grid = move(grid, "down");
    grid = move(grid, "right");

    return grid;
  },
  (grid) => gridToString(grid),
);

const solveSecond = (originalGrid: string[][]) => {
  let grid = originalGrid.map((line) => line.slice());

  // const getMovingRocksPositions = () =>
  //   grid
  //     .flatMap((line, y) =>
  //       line.map((cell, x) => (cell === "O" ? { x, y } : undefined)),
  //     )
  //     .filter((pos): pos is Position => pos !== undefined);
  //
  // const previousMovingRocksPositions = getMovingRocksPositions().reduce(
  //   (acc, pos) => {
  //     acc.set(JSON.stringify(pos), 0);
  //     return acc;
  //   },
  //   new Map<string, number>(),
  // );
  for (let i = 0; i < 1_000_000_000; i++) {
    if (i % 100_000_000 === 0) {
      console.log(i + 1, "/", 1_000_000_000);
    }
    grid = cycle(grid);
  }

  console.log(gridToString(grid));

  const sum = grid.reduce(
    (sum, line, index) =>
      sum + line.filter((cell) => cell === "O").length * (grid.length - index),
    0,
  );

  console.log("second", sum);
};

export const run: DayEntryPoint = (input) => {
  const grid = input.split("\n").map((line) => line.split(""));

  solveFirst(grid);
  solveSecond(grid);
  // console.log(gridToString(grid));
};
