import { DayEntryPoint } from "../../types/DayEntryPoint";

type Node = { name: string; left?: Node; right?: Node };

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");
  const instructions = lines[0].split("");
  const rawNodes = lines.slice(2);

  const nodeMap = new Map<string, Node>();
  const getOrCreateNode = (
    nodeName: string,
    values: Omit<Node, "name"> = {},
  ) => {
    let node = nodeMap.get(nodeName);
    if (!node) {
      node = { name: nodeName };
      nodeMap.set(nodeName, node);
    }
    return node;
  };
  for (const line of rawNodes) {
    const match = line.match(/(\w{3})/g);
    if (match) {
      const [name, left, right] = match;
      const node = getOrCreateNode(name);
      node.left = getOrCreateNode(left);
      node.right = getOrCreateNode(right);
    }
  }

  const startingPoint = nodeMap.get("AAA");
  if (!startingPoint) {
    return;
  }

  let i = 0;
  let nextNode = startingPoint;
  while (true) {
    if (nextNode.name === "ZZZ") {
      break;
    }
    const direction = instructions[i % instructions.length];
    if (direction === "L" && nextNode.left) {
      nextNode = nextNode.left;
    } else if (direction === "R" && nextNode.right) {
      nextNode = nextNode.right;
    }
    i++;
  }
  console.log("first", i);
};
