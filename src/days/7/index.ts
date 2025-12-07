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

  let splitCount = 0;

  const nodes: { x: number; y: number; type: NodeType }[] = [
    { x: startX, y: startY, type: "S" },
  ];
  const visited = new Set<string>();
  while (nodes.length > 0) {
    const node = nodes.pop()!;
    const currentValue = gridMap.get(`${node.x},${node.y}`);
    if (currentValue === undefined || visited.has(`${node.x},${node.y}`)) {
      continue;
    }

    visited.add(`${node.x},${node.y}`);

    if ([".", "S"].includes(currentValue)) {
      const newPos = { x: node.x, y: node.y + 1 };
      const type = gridMap.get(`${newPos.x},${newPos.y}`);
      if (type === undefined) {
        continue;
      }

      nodes.push({
        x: newPos.x,
        y: newPos.y,
        type: type,
      });
    } else if (currentValue === "^") {
      splitCount++;
      const positions = [
        { x: node.x - 1, y: node.y },
        { x: node.x + 1, y: node.y },
      ]
        .map((p) => {
          const type = gridMap.get(`${p.x},${p.y}`);
          if (type === undefined) {
            return undefined;
          }

          return { ...p, type };
        })
        .filter(
          (b): b is { x: number; y: number; type: NodeType } => b !== undefined,
        );

      nodes.push(...positions);
    }
  }

  console.log("part 1:", splitCount);
};
