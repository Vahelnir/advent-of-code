import { DayEntryPoint } from "../../types/DayEntryPoint";

type Cell = { letter: string; position: Position; energized: boolean };
type Position = { x: number; y: number };
type Direction = "right" | "left" | "up" | "down";

const move = ({ x, y }: Position, direction: Direction) => {
  if (direction === "left") {
    return { x: x - 1, y };
  }

  if (direction === "right") {
    return { x: x + 1, y };
  }

  if (direction === "up") {
    return { x, y: y - 1 };
  }

  return { x, y: y + 1 };
};

const VERTICAL_DIRECTIONS = ["up", "down"];
const HORIZONTAL_DIRECTIONS = ["left", "right"];

// if (currentCell === "|" && HORIZONTAL_DIRECTIONS.includes(direction)) {
//   return [
//     ...traverse(grid, move({ x, y }, "up"), "up").map((positions) => [
//       { x, y },
//       ...positions,
//     ]),
//     ...traverse(grid, move({ x, y }, "down"), "down").map((positions) => [
//       { x, y },
//       ...positions,
//     ]),
//   ];
// }
//
// if (currentCell === "-" && VERTICAL_DIRECTIONS.includes(direction)) {
//   return [
//     ...traverse(grid, move({ x, y }, "left"), "left").map((positions) => [
//       { x, y },
//       ...positions,
//     ]),
//     ...traverse(grid, move({ x, y }, "right"), "right").map((positions) => [
//       { x, y },
//       ...positions,
//     ]),
//   ];
// }

const SLASH_MIRROR_MAPPINGS: Record<Direction, Direction> = {
  up: "right",
  left: "down",
  down: "left",
  right: "up",
};

const BACKSLASH_MIRROR_MAPPINGS: Record<Direction, Direction> = {
  up: "left",
  left: "up",
  down: "right",
  right: "down",
};

const traverse = (originalGrid: Cell[][]) => {
  const grid = originalGrid.map((line) => line.map((cell) => ({ ...cell })));

  const visitedDirections = new Set<string>();
  const cellStack: { position: Position; direction: Direction }[] = [
    { position: { x: 0, y: 0 }, direction: "right" },
  ];
  while (cellStack.length > 0) {
    const poppedValue = cellStack.pop();
    if (!poppedValue) {
      break;
    }

    const { position, direction } = poppedValue;
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= grid[0].length ||
      position.y >= grid.length
    ) {
      continue;
    }
    const cell = grid[position.y][position.x];

    const visitedCellString = `${position.x};${position.y};${direction}`;
    if (visitedDirections.has(visitedCellString)) {
      continue;
    }
    visitedDirections.add(visitedCellString);

    if (
      cell.letter === "." ||
      (cell.letter === "|" && VERTICAL_DIRECTIONS.includes(direction)) ||
      (cell.letter === "-" && HORIZONTAL_DIRECTIONS.includes(direction))
    ) {
      cellStack.push({ position: move(cell.position, direction), direction });
      continue;
    }

    if (cell.letter === "|" && HORIZONTAL_DIRECTIONS.includes(direction)) {
      cellStack.push(
        { position: move(position, "up"), direction: "up" },
        { position: move(position, "down"), direction: "down" },
      );
      continue;
    }

    if (cell.letter === "-" && VERTICAL_DIRECTIONS.includes(direction)) {
      cellStack.push(
        { position: move(position, "left"), direction: "left" },
        { position: move(position, "right"), direction: "right" },
      );
      continue;
    }

    if (cell.letter === "/") {
      const newDirection = SLASH_MIRROR_MAPPINGS[direction];
      cellStack.push({
        position: move(position, newDirection),
        direction: newDirection,
      });
      continue;
    }

    if (cell.letter === "\\") {
      const newDirection = BACKSLASH_MIRROR_MAPPINGS[direction];
      cellStack.push({
        position: move(position, newDirection),
        direction: newDirection,
      });
      continue;
    }
  }

  return visitedDirections;
};

export const run: DayEntryPoint = (input) => {
  const grid = input
    .split("\n")
    .map((line, y) =>
      line
        .split("")
        .map(
          (letter, x) =>
            ({ letter, position: { x, y }, energized: false }) satisfies Cell,
        ),
    );

  const traversedPositions = traverse(grid);
  const energizedPositions = new Set(
    [...traversedPositions.values()]
      .map((value) => value.split(";"))
      .map(([x, y]) => `${x};${y}`),
  );
  console.log("first", energizedPositions.size);
};
