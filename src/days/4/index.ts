import type { DayEntryPoint } from "../../types/DayEntryPoint";

function positionToKey(position: { x: number; y: number }): string {
  return `${position.x},${position.y}`;
}

function keyToPosition(key: string): { x: number; y: number } {
  const [x, y] = key.split(",").map(Number);
  if (x === undefined || y === undefined) {
    throw new Error(`invalid key: ${key}`);
  }

  return { x, y };
}

function findMovableRolls(origGridMap: Map<string, string>) {
  const gridMap = new Map(origGridMap);

  const possiblePositions: { x: number; y: number }[] = [];
  for (const [key, value] of gridMap) {
    if (value !== "@") {
      continue;
    }

    const position = keyToPosition(key);
    // 8 adjacent positions
    const adjacentRollsCount = [
      { x: position.x - 1, y: position.y - 1 },
      { x: position.x, y: position.y - 1 },
      { x: position.x + 1, y: position.y - 1 },
      { x: position.x - 1, y: position.y },
      { x: position.x + 1, y: position.y },
      { x: position.x - 1, y: position.y + 1 },
      { x: position.x, y: position.y + 1 },
      { x: position.x + 1, y: position.y + 1 },
    ]
      .map((position) => origGridMap.get(positionToKey(position)))
      .filter((value) => value === "@").length;
    if (adjacentRollsCount < 4) {
      possiblePositions.push(position);
      gridMap.set(key, "x");
    }
  }

  return { newGridMap: gridMap, possiblePositions };
}

function secondPart(gridMap: Map<string, string>) {
  let currentGridMap = new Map(gridMap);

  let movedRollsCount = 0;
  while (true) {
    const { newGridMap, possiblePositions } = findMovableRolls(currentGridMap);
    currentGridMap = newGridMap;
    if (possiblePositions.length === 0) {
      break;
    }

    movedRollsCount += possiblePositions.length;
  }

  return movedRollsCount;
}

export const run: DayEntryPoint = async (input) => {
  const grid = input.split("\n").map((line) => line.split(""));
  const gridMap = new Map<string, string>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      const value = grid[y]![x]!;
      gridMap.set(positionToKey({ x, y }), value);
    }
  }

  const { possiblePositions } = findMovableRolls(gridMap);
  console.log("part 1:", possiblePositions.length);
  // console.log(
  //   grid
  //     .map((line, y) =>
  //       line
  //         .map((value, x) => {
  //           const key = positionToKey({ x, y });
  //           if (possiblePositions.some((pos) => positionToKey(pos) === key)) {
  //             return "x";
  //           }
  //           return value;
  //         })
  //         .join(""),
  //     )
  //     .join("\n"),
  // );
  console.log("part 2:", secondPart(gridMap));
};
