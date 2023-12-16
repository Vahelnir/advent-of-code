import { DayEntryPoint } from "../../types/DayEntryPoint";

type Cell = { letter: string; position: Position; energized: boolean };
type Position = { x: number; y: number };
type Direction = "right" | "left" | "up" | "down";
type DirectedPosition = { position: Position; direction: Direction };

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

const getNextPositions = (
  position: Position,
  cell: Cell,
  direction: Direction,
): DirectedPosition[] => {
  if (
    cell.letter === "." ||
    (cell.letter === "|" && VERTICAL_DIRECTIONS.includes(direction)) ||
    (cell.letter === "-" && HORIZONTAL_DIRECTIONS.includes(direction))
  ) {
    return [{ position: move(position, direction), direction }];
  }

  if (cell.letter === "|" && HORIZONTAL_DIRECTIONS.includes(direction)) {
    return [
      { position: move(position, "up"), direction: "up" },
      { position: move(position, "down"), direction: "down" },
    ];
  }

  if (cell.letter === "-" && VERTICAL_DIRECTIONS.includes(direction)) {
    return [
      { position: move(position, "left"), direction: "left" },
      { position: move(position, "right"), direction: "right" },
    ];
  }

  if (cell.letter === "/") {
    const newDirection = SLASH_MIRROR_MAPPINGS[direction];
    return [
      {
        position: move(position, newDirection),
        direction: newDirection,
      },
    ];
  }

  if (cell.letter === "\\") {
    const newDirection = BACKSLASH_MIRROR_MAPPINGS[direction];
    return [
      {
        position: move(position, newDirection),
        direction: newDirection,
      },
    ];
  }

  return [];
};

const traverse = (
  originalGrid: Cell[][],
  initialPosition: Position,
  initialDirection: Direction,
) => {
  const grid = originalGrid.map((line) => line.map((cell) => ({ ...cell })));

  const visitedPositions = new Set<string>();
  const positionStack: DirectedPosition[] = [
    { position: initialPosition, direction: initialDirection },
  ];
  while (positionStack.length > 0) {
    const poppedValue = positionStack.pop();
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
    if (visitedPositions.has(visitedCellString)) {
      continue;
    }
    visitedPositions.add(visitedCellString);

    positionStack.push(...getNextPositions(position, cell, direction));
  }

  const energizedPositions = new Set(
    [...visitedPositions.values()]
      .map((value) => value.split(";"))
      .map(([x, y]) => `${x};${y}`),
  );
  return energizedPositions.size;
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

  console.log("first", traverse(grid, { x: 0, y: 0 }, "right"));

  let max = 0;
  for (let x = 0; x < grid[0].length; x++) {
    max = Math.max(max, traverse(grid, { x, y: 0 }, "down"));
    max = Math.max(max, traverse(grid, { x, y: grid.length - 1 }, "up"));

    if (x === 0 || x === grid[0].length - 1) {
      max = Math.max(
        max,
        traverse(grid, { x, y: 0 }, x === 0 ? "right" : "left"),
      );
      max = Math.max(
        max,
        traverse(grid, { x, y: grid.length - 1 }, x === 0 ? "right" : "left"),
      );
      for (let y = 1; y < grid.length - 1; y++) {
        max = Math.max(
          max,
          traverse(grid, { x, y }, x === 0 ? "left" : "right"),
        );
      }
    }
  }

  console.log("second", max);
};
