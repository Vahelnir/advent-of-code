import { DayEntryPoint } from "../../types/DayEntryPoint";

const DEBUG = false;
const DEBUG_GRID_OFFSET = { x: 11, y: 7 };
const DEBUG_GRID_SIZE = { x: 25, y: 22 };

const ALLOWED_DIRECTIONS = ["R", "U", "L", "D"] as const;
const DIRECTIONS: Record<Direction, number> = { R: 1, L: -1, U: 1, D: -1 };

type Direction = (typeof ALLOWED_DIRECTIONS)[number];
type Position = { x: number; y: number };
type Move = { direction: Direction; steps: number };

const isDirection = (direction: string): direction is Direction =>
  ALLOWED_DIRECTIONS.includes(direction as Direction);

const parseMove = (line: string): Move => {
  const [direction, steps] = line.split(" ");
  if (!isDirection(direction)) {
    throw new Error(`direction ${direction} is not a valid Direction`);
  }

  return { direction, steps: Number(steps) };
};

const isTouching = (headPosition: Position, tailPosition: Position) => {
  const verticalDistance = Math.abs(headPosition.y - tailPosition.y);
  const horizontalDistance = Math.abs(headPosition.x - tailPosition.x);
  return (
    (verticalDistance === 0 && horizontalDistance === 0) ||
    (verticalDistance === 1 && horizontalDistance === 0) ||
    (verticalDistance === 0 && horizontalDistance === 1) ||
    (verticalDistance === 1 && horizontalDistance === 1)
  );
};

const simulateMove = (rope: Position[], direction: Direction) => {
  switch (direction) {
    case "U":
    case "D":
      rope[0].y += DIRECTIONS[direction];
      break;
    case "L":
    case "R":
      rope[0].x += DIRECTIONS[direction];
      break;
  }

  for (let i = 1; i < rope.length; i++) {
    const parentPosition = rope[i - 1];
    const currentPosition = rope[i];
    if (isTouching(parentPosition, currentPosition)) {
      return;
    }

    if (currentPosition.x === parentPosition.x) {
      currentPosition.y += parentPosition.y < currentPosition.y ? -1 : 1;
    } else if (currentPosition.y === parentPosition.y) {
      currentPosition.x += parentPosition.x < currentPosition.x ? -1 : 1;
    } else {
      currentPosition.x += parentPosition.x < currentPosition.x ? -1 : 1;
      currentPosition.y += parentPosition.y < currentPosition.y ? -1 : 1;
    }
  }
};

const simulateRope = (ropeSize: number, moves: Move[]) => {
  const rope: Position[] = new Array(ropeSize)
    .fill(null)
    .map(() => ({ x: 0, y: 0 }));
  const visitedPositions: Position[] = [];

  const dimensions = { x: 0, y: 0, minX: 0, minY: 0 };
  for (const { steps, direction } of moves) {
    DEBUG && console.log("==", direction, "==\n");

    for (let i = 0; i < steps; i++) {
      simulateMove(rope, direction);
      if (rope[0].x > dimensions.x) {
        dimensions.x = rope[0].x;
      }
      if (rope[0].y > dimensions.y) {
        dimensions.y = rope[0].y;
      }
      if (rope[0].x < dimensions.x) {
        dimensions.minX = rope[0].x;
      }
      if (rope[0].y < dimensions.y) {
        dimensions.minY = rope[0].y;
      }
      visitedPositions.push({ ...rope[rope.length - 1] });
    }

    DEBUG && displayDebugGrid(DEBUG_GRID_SIZE, DEBUG_GRID_OFFSET, rope);
  }

  // USED TO CALCULATE DEBUG VALUES
  const start = {
    x: Math.abs(dimensions.minX),
    y: Math.abs(dimensions.minY),
  };
  const gridSize = {
    x: dimensions.x + start.x,
    y: dimensions.y + start.y,
  };
  console.log(start, gridSize);

  DEBUG && displayVisitedPositions(gridSize, visitedPositions, start);

  const uniqueVisitedPositions = new Set<string>(
    visitedPositions.map((pos) => `${pos.x};${pos.y}`)
  );
  return uniqueVisitedPositions.size;
};

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");
  const moves = lines.flatMap(parseMove);

  console.log("first", simulateRope(2, moves));

  console.log("second", simulateRope(10, moves));
};

const createGrid = (
  gridSize: Position,
  start: Position = { x: 0, y: 0 }
): string[][] => {
  const grid = new Array(gridSize.y + 1)
    .fill(null)
    .map(() => new Array(gridSize.x + 1).fill("."));
  grid[start.y][start.x] = "s";
  return grid;
};
const displayGrid = (grid: string[][]) => {
  console.log(
    grid
      .map((line) => line.join(""))
      .reverse()
      .join("\n")
  );
};

const displayVisitedPositions = (
  gridSize: Position,
  visitedPositions: Position[],
  start: Position
) => {
  const grid = createGrid(gridSize, start);
  visitedPositions.forEach(
    ({ x, y }) => (grid[start.y + y][start.x + x] = "#")
  );
  displayGrid(grid);
};

function displayDebugGrid(
  size: { x: number; y: number },
  offset: { x: number; y: number },
  rope: Position[]
) {
  const grid = createGrid(size, offset);
  rope
    .map(({ x, y }, index) => ({
      x,
      y,
      letter: index === 0 ? "H" : index.toString(),
    }))
    .reverse()
    .forEach(({ letter, x, y }) => (grid[offset.y + y][offset.x + x] = letter));
  displayGrid(grid);
  console.log("");
}
