import { DayEntryPoint } from "../../types/DayEntryPoint";

function getCharactersOnVector(
  grid: string[][],
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  const characters = [];
  const xDiff = to.x - from.x;
  const yDiff = to.y - from.y;
  const length = Math.max(Math.abs(xDiff), Math.abs(yDiff));
  for (let i = 0; i < length; i++) {
    const x = from.x + (xDiff * i) / length;
    const y = from.y + (yDiff * i) / length;
    if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) {
      break;
    }

    characters.push(grid[y][x]);
  }
  return characters.join("");
}

function hasWordAt(
  grid: string[][],
  word: string,
  position: { y: number; x: number },
  direction: "diagonal-down" | "diagonal-up" | "horizontal" | "vertical"
) {
  // horizontal position
  let endPosition = {
    ...position,
    x: position.x + word.length,
  };
  if (direction === "vertical") {
    endPosition = {
      ...position,
      y: position.y + word.length,
    };
  } else if (direction === "diagonal-down") {
    endPosition = {
      x: position.x + word.length,
      y: position.y + word.length,
    };
  } else if (direction === "diagonal-up") {
    endPosition = {
      x: position.x + word.length,
      y: position.y - word.length,
    };
  }
  const foundWord = getCharactersOnVector(grid, position, endPosition);
  return foundWord === word || foundWord === [...word].reverse().join("");
}

export const run: DayEntryPoint = (input) => {
  const grid = input.split("\n").map((row) => row.split(""));

  let count = 0;
  const foundLetters = new Set<string>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (hasWordAt(grid, "XMAS", { y: y, x: x }, "horizontal")) {
        foundLetters.add(`${y};${x}`);
        foundLetters.add(`${y};${x + 1}`);
        foundLetters.add(`${y};${x + 2}`);
        foundLetters.add(`${y};${x + 3}`);
        count++;
      }

      if (hasWordAt(grid, "XMAS", { y: y, x: x }, "vertical")) {
        foundLetters.add(`${y};${x}`);
        foundLetters.add(`${y + 1};${x}`);
        foundLetters.add(`${y + 2};${x}`);
        foundLetters.add(`${y + 3};${x}`);
        count++;
      }

      if (hasWordAt(grid, "XMAS", { y: y, x: x }, "diagonal-down")) {
        foundLetters.add(`${y};${x}`);
        foundLetters.add(`${y + 1};${x + 1}`);
        foundLetters.add(`${y + 2};${x + 2}`);
        foundLetters.add(`${y + 3};${x + 3}`);
        count++;
      }

      if (hasWordAt(grid, "XMAS", { y: y, x: x }, "diagonal-up")) {
        foundLetters.add(`${y};${x}`);
        foundLetters.add(`${y - 1};${x + 1}`);
        foundLetters.add(`${y - 2};${x + 2}`);
        foundLetters.add(`${y - 3};${x + 3}`);
        count++;
      }
    }
  }

  const emptyGrid = new Array(grid.length)
    .fill(null)
    .map(() => new Array(grid[0].length).fill("."));
  for (const coordinateString of foundLetters) {
    const [y, x] = coordinateString.split(";").map(Number);
    emptyGrid[y][x] = grid[y][x];
  }

  console.log(emptyGrid.map((row) => row.join("")).join("\n"));

  console.log("first part:", count);
};
