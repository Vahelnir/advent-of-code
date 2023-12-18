import { DayEntryPoint } from "../../types/DayEntryPoint";

type Direction = (typeof ALLOWED_DIRECTIONS)[number];
type Position = { x: number; y: number };
type Dig = { direction: Direction; length: number; color: string };

const ALLOWED_DIRECTIONS = ["R", "L", "U", "D"] as const;

const line = (from: Position, to: Position) => {
  if (from.x === to.x) {
    return [..."#".repeat(to.y - from.y + 1)].map((cell, index) => ({
      cell,
      position: { ...from, y: from.y + index },
    }));
  }

  if (from.y === to.y) {
    return [..."#".repeat(to.x - from.x + 1)].map((cell, index) => ({
      cell,
      position: { ...from, x: from.x + index },
    }));
  }

  throw new Error("not implemented");
};

const parseGrid = (digPlan: Dig[]) => {
  const min = { x: 0, y: 0 };
  const max = { x: 0, y: 0 };

  const currentPosition = { x: 0, y: 0 };
  const digMap: Record<string, string> = {};
  for (const { length, direction } of digPlan) {
    let cells: { cell: string; position: Position }[] | undefined;
    if (direction === "L") {
      cells = line(
        { ...currentPosition, x: currentPosition.x - length },
        currentPosition,
      );
      currentPosition.x -= length;
      min.x = Math.min(min.x, currentPosition.x);
    }

    if (direction === "R") {
      cells = line(currentPosition, {
        ...currentPosition,
        x: currentPosition.x + length,
      });
      currentPosition.x += length;
      max.x = Math.max(max.x, currentPosition.x);
    }

    if (direction === "U") {
      cells = line(
        { ...currentPosition, y: currentPosition.y - length },
        currentPosition,
      );
      currentPosition.y -= length;
      min.y = Math.min(min.y, currentPosition.y);
    }

    if (direction === "D") {
      cells = line(currentPosition, {
        ...currentPosition,
        y: currentPosition.y + length,
      });
      currentPosition.y += length;
      max.y = Math.max(max.y, currentPosition.y);
    }

    cells?.forEach(
      ({ cell, position }) => (digMap[JSON.stringify(position)] = cell),
    );
  }

  const gridSize: Position = {
    x: max.x + Math.abs(min.x) + 1,
    y: max.y + Math.abs(min.y) + 1,
  };

  const grid: string[][] = [];
  const lineAround = 1;
  const offset: Position = {
    x: min.x - lineAround,
    y: min.y - lineAround,
  };
  for (let y = 0; y < gridSize.y + lineAround + 1; y++) {
    const line = [];
    for (let x = 0; x < gridSize.x + lineAround + 1; x++) {
      line.push(
        digMap[
          JSON.stringify({
            x: x + offset.x,
            y: y + offset.y,
          })
        ] ?? ".",
      );
    }

    grid.push(line);
  }

  return grid;
};

const fillOutside = (grid: string[][], position: Position) => {
  const toFill: Position[] = [position];
  while (toFill.length > 0) {
    const position = toFill.pop();
    if (!position) {
      break;
    }

    grid[position.y][position.x] = "*";
    const adjacent = [
      { ...position, y: position.y + 1 },
      { ...position, x: position.x + 1 },
      { ...position, y: position.y - 1 },
      { ...position, x: position.x - 1 },
    ]
      .filter(
        (position) =>
          position.x >= 0 &&
          position.y >= 0 &&
          position.x < grid[0].length &&
          position.y < grid.length,
      )
      .filter(({ x, y }) => grid[y][x] === ".");
    toFill.push(...adjacent);
  }
};

export const run: DayEntryPoint = (input) => {
  const digPlan: Dig[] = input
    .split("\n")
    .map((line) => line.split(" "))
    .map(([direction, length, color]) => ({
      direction: direction as Direction,
      length: Number(length),
      color: color.replace("(", "").replace(")", ""),
    }));

  const grid = parseGrid(digPlan);
  const topLeftCorner = { x: 0, y: 0 };
  const bottomRightCorner = { x: grid[0].length - 1, y: grid.length - 1 };
  fillOutside(grid, topLeftCorner);
  fillOutside(grid, { ...bottomRightCorner, y: 0 });
  fillOutside(grid, bottomRightCorner);
  fillOutside(grid, { ...bottomRightCorner, x: 0 });

  console.log(
    "first",
    grid.flat().filter((letter) => "#.".includes(letter)).length,
  );
};
