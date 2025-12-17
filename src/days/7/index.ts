import type { DayEntryPoint } from "../../types/DayEntryPoint";

export type NodeType = "." | "S" | "^";

export const run: DayEntryPoint = async (input) => {
  const grid = input.split("\n").map((line) => line.trim().split(""));
  const gridMap = new Map<string, NodeType>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      gridMap.set(`${x},${y}`, grid[y]![x]! as NodeType);
    }
  }

  const rawStart = gridMap.entries().find(([, value]) => value === "S");
  if (!rawStart) {
    throw new Error("Start position not found");
  }

  const [startX, startY] = rawStart[0].split(",").map(Number);
  if (startX === undefined || startY === undefined) {
    throw new Error("Invalid start position");
  }

  type State = { x: number; y: number };

  const stack: State[] = [{ x: startX, y: startY }];
  const visited = new Set<string>();

  let timelines = 0;
  let splitCount = 0;
  while (stack.length > 0) {
    const { x, y } = stack.pop()!;
    const key = `${x},${y}`;
    if (visited.has(key)) {
      continue;
    }
    // visited.add(key);

    if (y === grid.length - 1) {
      timelines++;
      continue;
    }

    const currentValue = gridMap.get(`${x},${y}`);
    if (currentValue === undefined) {
      continue;
    }

    if (currentValue === "." || currentValue === "S") {
      stack.push({ x, y: y + 1 });
    } else if (currentValue === "^") {
      splitCount++;
      stack.push({ x: x - 1, y });
      stack.push({ x: x + 1, y });
    }
  }

  for (const visitedPos of visited) {
    const [xStr, yStr] = visitedPos.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    if (Number.isFinite(x) && Number.isFinite(y) && y >= 0 && y < grid.length) {
      const row = grid[y];
      if (row && x >= 0 && x < row.length && row[x] === ".") {
        row[x] = "|";
      }
    }
  }

  console.log(grid.map((line) => line.join("")).join("\n"));
  console.log("part 1:", splitCount);
  console.log("part 2:", timelines);
};
