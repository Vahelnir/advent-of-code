import { DayEntryPoint } from "../../types/DayEntryPoint";

const ALLOWED_DIRECTIONS = ["R", "U", "L", "D"] as const;

const DIRECTIONS: Record<Direction, number> = { R: 1, L: -1, U: 1, D: -1 };

type Direction = (typeof ALLOWED_DIRECTIONS)[number];
type Position = { x: number; y: number };

const isDirection = (direction: string): direction is Direction =>
  ALLOWED_DIRECTIONS.includes(direction as Direction);

const parseMove = (line: string): Direction[] => {
  const [direction, steps] = line.split(" ");
  if (!isDirection(direction)) {
    throw new Error(`direction ${direction} is not a valid Direction`);
  }

  return new Array(Number(steps)).fill(direction);
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

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");
  const directions = lines.flatMap(parseMove);

  const headPosition: Position = { x: 0, y: 0 };
  const tailPosition: Position = { x: 0, y: 0 };
  const visitedPositions: Position[] = [];
  const simulate = (direction: Direction) => {
    switch (direction) {
      case "U":
      case "D":
        headPosition.y += DIRECTIONS[direction];
        break;
      case "L":
      case "R":
        headPosition.x += DIRECTIONS[direction];
        break;
    }

    if (isTouching(headPosition, tailPosition)) {
      // console.log("not moving, we are touching");
      return;
    }

    if (tailPosition.x === headPosition.x) {
      tailPosition.y += DIRECTIONS[direction];
    } else if (tailPosition.y === headPosition.y) {
      tailPosition.x += DIRECTIONS[direction];
    } else {
      tailPosition.x += headPosition.x < tailPosition.x ? -1 : 1;
      tailPosition.y += headPosition.y < tailPosition.y ? -1 : 1;
    }
  };

  let previousDirection: Direction | undefined = undefined;
  const gridSize = { x: 0, y: 0 };
  for (let direction of directions) {
    simulate(direction);
    if (headPosition.x > gridSize.x) {
      gridSize.x = headPosition.x;
    }
    if (headPosition.y > gridSize.y) {
      gridSize.y = headPosition.y;
    }

    // if (previousDirection !== direction) {
    //   console.log("==", direction, "==\n");
    //   previousDirection = direction;
    // }
    // console.log("");
    // const grid = createGrid({ x: 5, y: 4 });
    // grid[tailPosition.y][tailPosition.x] = "T";
    // grid[headPosition.y][headPosition.x] = "H";
    // displayGrid(grid);
    // console.log(direction, headPosition, tailPosition);
    visitedPositions.push({ ...tailPosition });
  }
  const uniqueVisitedPositions = new Set<string>(
    visitedPositions.map((pos) => `${pos.x};${pos.y}`)
  );
  console.log("first", gridSize, uniqueVisitedPositions.size);

  displayVisitedPositions(gridSize, visitedPositions);
};

const createGrid = (gridSize: Position): string[][] => {
  const grid = new Array(gridSize.y + 1)
    .fill(null)
    .map(() => new Array(gridSize.x + 1).fill("."));
  grid[0][0] = "s";
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
  visitedPositions: Position[]
) => {
  const grid = createGrid(gridSize);
  visitedPositions.forEach(({ x, y }) => (grid[y][x] = "#"));
  displayGrid(grid);
};
