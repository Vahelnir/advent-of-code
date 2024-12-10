import { DayEntryPoint } from "../../types/DayEntryPoint";

type Node = {
  height: number;
  position: { x: number; y: number };
};

type PathNode = { node: Node; history: Node[] };

export const run: DayEntryPoint = (input) => {
  const grid = input
    .split("\n")
    .map((row, y) =>
      row
        .split("")
        .map((height, x) => ({ height: Number(height), position: { x, y } }))
    );
  const trailheads = grid.flat().filter((node) => node.height === 0);

  const trailheadPaths = new Map<string, Node[][]>();
  for (const trailhead of trailheads) {
    const queue: PathNode[] = [{ node: trailhead, history: [] }];

    const visited = new Set<string>();
    while (queue.length > 0) {
      const { node, history } = queue.shift()!;
      if (node.height === 9) {
        const trailheadString = nodeToString(history[0]);
        const existingPaths = trailheadPaths.get(trailheadString) || [];
        trailheadPaths.set(trailheadString, [
          ...existingPaths,
          [...history, node],
        ]);
        continue;
      }

      const { x, y } = node.position;
      visited.add(`${x},${y}`);
      const neighbouringNodes = [
        grid[y - 1]?.[x],
        grid[y + 1]?.[x],
        grid[y]?.[x - 1],
        grid[y]?.[x + 1],
      ]
        .filter((nextNode) => nextNode && nextNode.height === node.height + 1)
        .map((nextNode) => ({ node: nextNode, history: [...history, node] }));
      queue.push(...neighbouringNodes);
    }
  }
  console.log("trailheads", trailheads.length);
  console.log(
    [...trailheadPaths.entries()]
      .map(
        ([, paths]) => new Set(paths.map((path) => nodeToString(path[9]))).size
      )
      .reduce((acc, val) => acc + val, 0)
  );
};

function nodeToString(node: Node): string {
  return `${node.position.x},${node.position.y}`;
}
