import { DayEntryPoint } from "../../types/DayEntryPoint";

class Pattern {
  private pattern: string[][];
  private wildcardChar: string;

  constructor(pattern: string[] | string[][], wildcardChar = ".") {
    this.pattern = pattern.map((row) =>
      typeof row === "string" ? row.split("") : row
    );
    this.wildcardChar = wildcardChar;
  }

  match(grid: string[][], from: { x: number; y: number }) {
    const debugCoordinates = new Set<string>();
    for (let y = 0; y < this.pattern.length; y++) {
      for (let x = 0; x < this.pattern[y].length; x++) {
        if (this.pattern[y][x] === this.wildcardChar) {
          continue;
        }

        if (grid?.[from.y + y]?.[from.x + x] !== this.pattern[y][x]) {
          return false;
        }

        debugCoordinates.add(`${from.y + y};${from.x + x}`);
      }
    }

    return { debugCoordinates };
  }

  mirror(direction: "horizontal" | "vertical") {
    if (direction === "horizontal") {
      return new Pattern(this.pattern.reverse(), this.wildcardChar);
    }

    return new Pattern(
      this.pattern.map((row) => [...row].reverse().join("")),
      this.wildcardChar
    );
  }

  toString() {
    return this.pattern.map((row) => row.join("")).join("\n");
  }
}

const VERTICAL_XMAS = new Pattern(["X", "M", "A", "S"]);
const HORIZONTAL_XMAS = new Pattern(["XMAS"]);
const DIAGONAL_DOWN_XMAS = new Pattern(["X...", ".M..", "..A.", "...S"]);
const DIAGONAL_UP_XMAS = new Pattern(["...S", "..A.", ".M..", "X..."]);

export const run: DayEntryPoint = (input) => {
  const grid = input.split("\n").map((row) => row.split(""));

  let count = 0;
  const patterns = [
    VERTICAL_XMAS,
    VERTICAL_XMAS.mirror("horizontal"),
    HORIZONTAL_XMAS,
    HORIZONTAL_XMAS.mirror("vertical"),
    DIAGONAL_DOWN_XMAS,
    DIAGONAL_UP_XMAS.mirror("horizontal").mirror("vertical"),
    DIAGONAL_UP_XMAS,
    DIAGONAL_DOWN_XMAS.mirror("horizontal").mirror("vertical"),
  ];
  console.log(patterns.map((pattern) => pattern.toString()).join("\n\n"));

  const debugCoordinates = new Set<string>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      for (const pattern of patterns) {
        const found = pattern.match(grid, { x, y });
        if (found) {
          found.debugCoordinates.forEach((coord) =>
            debugCoordinates.add(coord)
          );
          count++;
        }
      }
    }
  }

  const emptyGrid = new Array(grid.length)
    .fill(null)
    .map(() => new Array(grid[0].length).fill("."));
  for (const coordinateString of debugCoordinates) {
    const [y, x] = coordinateString.split(";").map(Number);
    emptyGrid[y][x] = grid[y][x];
  }

  console.log();
  console.log(emptyGrid.map((row) => row.join("")).join("\n"));

  console.log("first part:", count);
};
