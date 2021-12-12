import { DayEntryPoint } from "../../types/DayEntryPoint";

// TODO: this is pretty bad, slow and messy. 
// Refactor everything, research how to properly graph + traverse the graph

type Cave = {
  name: string;
  small: boolean;
  visit: number;
  next: string[];
  end: boolean;
};

type Caves = Map<string, Cave>;

function isSmallCave(name: string) {
  return name === name.toLocaleLowerCase();
}

function getOrCreateNode(nodes: Caves, name: string) {
  let node = nodes.get(name);
  if (!node) {
    node = {
      name: name,
      small: isSmallCave(name),
      visit: 0,
      next: [],
      end: name === "end",
    };
    nodes.set(name, node);
  }
  return node;
}

function copyNodes(nodes: Caves): Caves {
  return new Map(
    [...nodes.entries()].map(([name, node]) => [name, { ...node }])
  );
}

function traverse(
  nodes: Caves,
  name: string,
  canVisitTwice: boolean
): Cave[][] {
  const from = nodes.get(name);
  if (!from) {
    return [];
  }

  if (from.end) {
    return [[from]];
  }

  from.visit++;
  if (from.small && from.visit > 1) {
    canVisitTwice = false;
  }

  const traversed = from.next
    .map((name) => nodes.get(name))
    .filter((cave): cave is Cave => cave !== undefined)
    .filter(
      (cave) =>
        !cave.small ||
        (canVisitTwice && cave.name !== "start") ||
        (cave.small && cave.visit === 0)
    )
    .map((cave) => traverse(copyNodes(nodes), cave.name, canVisitTwice));

  if (traversed.length === 0) {
    return [[from]];
  }
  return traversed.flatMap((paths) => paths.map((path) => [from, ...path]));
}

function getEveryPathToEnd(nodes: Caves, canVisitTwice: boolean = false) {
  return traverse(copyNodes(nodes), "start", canVisitTwice)
    .filter((path) => path[path.length - 1].name === "end")
    .map((nodes) => nodes.map((node) => node.name).join(","));
}

async function solveFirst(lines: string[]) {
  const nodes: Caves = new Map();
  const thing = lines.map((line) => line.split("-"));
  for (const [a, b] of thing) {
    let nodeA = getOrCreateNode(nodes, a);
    let nodeB = getOrCreateNode(nodes, b);
    nodeA.next.push(b);
    nodeB.next.push(a);
  }

  const paths = getEveryPathToEnd(nodes);

  console.log("first:", paths.length);
}

async function solveSecond(lines: string[]) {
  const nodes: Caves = new Map();
  const thing = lines.map((line) => line.split("-"));
  for (const [a, b] of thing) {
    let nodeA = getOrCreateNode(nodes, a);
    let nodeB = getOrCreateNode(nodes, b);
    nodeA.next.push(b);
    nodeB.next.push(a);
  }

  const paths = getEveryPathToEnd(nodes, true);

  console.log("second:", paths.length);
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
