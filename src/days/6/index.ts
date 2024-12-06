import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const GUARD_CHARACTERS = ["^", "v", "<", ">"];

function isGuard(character: string) {
  return GUARD_CHARACTERS.includes(character);
}

function getGuardDirection(character: string) {
  if (character === "^") return "up";
  if (character === "v") return "down";
  if (character === "<") return "left";
  if (character === ">") return "right";

  throw new Error(`Invalid guard character: ${character}`);
}

function getGuardDirectionCharacter(direction: Direction) {
  if (direction === "up") return "^";
  if (direction === "down") return "v";
  if (direction === "left") return "<";
  if (direction === "right") return ">";
  throw new Error(`Invalid direction: ${direction}`);
}

function rotateDirection(direction: Direction) {
  if (direction === "up") return "right";
  if (direction === "right") return "down";
  if (direction === "down") return "left";
  if (direction === "left") return "up";
  throw new Error(`Invalid direction: ${direction}`);
}

function isObstacle(character: string) {
  return character === "#";
}

function findGuard(grid: string[][]) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (isGuard(grid[y][x])) {
        return { x, y };
      }
    }
  }
}

function positionToString(position: Position) {
  return `${position.x},${position.y}`;
}

function getDeltaIncrement(x: number, targetX: number) {
  if (x === targetX) return 0;
  if (x < targetX) return 1;
  return -1;
}

function walkStraightInDirection(
  grid: string[][],
  position: Position,
  direction: Direction
) {
  // NOTE: "up" direction
  let target = { x: position.x, y: 0 };
  if (direction === "down") {
    target = { x: position.x, y: grid.length - 1 };
  } else if (direction === "left") {
    target = { x: 0, y: position.y };
  } else if (direction === "right") {
    target = { x: grid[0].length - 1, y: position.y };
  }

  const visitedNodes = new Set<string>();

  const nextPosition = { ...position };
  const deltaX = getDeltaIncrement(position.x, target.x);
  const deltaY = getDeltaIncrement(position.y, target.y);
  while (nextPosition.x !== target.x || nextPosition.y !== target.y) {
    nextPosition.x += deltaX;
    nextPosition.y += deltaY;

    if (isObstacle(grid[nextPosition.y][nextPosition.x])) {
      return {
        nextPosition: {
          x: nextPosition.x - deltaX,
          y: nextPosition.y - deltaY,
        },
        visitedNodes,
      };
    } else {
      visitedNodes.add(positionToString(nextPosition));
    }
  }
  return { visitedNodes };
}

export const run: DayEntryPoint = (input) => {
  const mapGrid = input.split("\n").map((row) => row.split(""));
  const guardPosition = findGuard(mapGrid);
  if (!guardPosition) {
    throw new Error("Guard not found");
  }

  let visitedNodes = new Set<string>();
  let nextPosition = guardPosition;
  while (nextPosition !== undefined) {
    console.log("nextPosition", nextPosition, guardPosition);
    const direction = getGuardDirection(
      mapGrid[nextPosition.y][nextPosition.x]
    );
    const result = walkStraightInDirection(mapGrid, nextPosition, direction);
    result.visitedNodes.forEach((node) => visitedNodes.add(node));
    if (!result.nextPosition) {
      break;
    }

    mapGrid[nextPosition.y][nextPosition.x] = ".";
    nextPosition = result.nextPosition;
    mapGrid[nextPosition.y][nextPosition.x] = getGuardDirectionCharacter(
      rotateDirection(direction)
    );
  }

  console.log(
    mapGrid
      .map((row, y) =>
        row.map((char, x) =>
          visitedNodes.has(positionToString({ x, y })) ? "X" : char
        )
      )
      .map((row) => row.join(""))
      .join("\n")
  );

  console.log("obstacle", visitedNodes.size);
};
