import { DayEntryPoint } from "../../types/DayEntryPoint";

type Node = { name: string; left?: Node; right?: Node };

const gcd2 = (a: number, b: number): number => {
  if (!b) {
    return b === 0 ? a : NaN;
  }
  return gcd2(b, a % b);
};

const gcd = (numbers: number[]) => {
  return numbers.reduce((acc, number) => gcd2(number, acc), 0);
};

const lcm2 = (a: number, b: number) => {
  return (a * b) / gcd2(a, b);
};

const lcm = (numbers: number[]) => {
  return numbers.reduce((acc, number) => lcm2(number, acc), 1);
};

const walkThrough = (
  instructions: string[],
  from: Node,
  endCondition: (node: Node) => boolean,
) => {
  let i = 0;
  let nextNode = from;
  while (true) {
    if (endCondition(nextNode)) {
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

  return i;
};

const solveFirst = (instructions: string[], nodeMap: Map<string, Node>) => {
  const startingPoint = nodeMap.get("AAA");
  if (!startingPoint) {
    return;
  }

  return walkThrough(
    instructions,
    startingPoint,
    (node) => node.name === "ZZZ",
  );
};

const solveSecond = (instructions: string[], nodeMap: Map<string, Node>) => {
  const startingPoints = [...nodeMap.values()].filter((node) =>
    node.name.endsWith("A"),
  );

  const iterations = startingPoints.map((node) =>
    walkThrough(instructions, node, (node) => node.name.endsWith("Z")),
  );

  return lcm(iterations);
};

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
  console.log("first", solveFirst(instructions, nodeMap));
  console.log("second", solveSecond(instructions, nodeMap));
};
