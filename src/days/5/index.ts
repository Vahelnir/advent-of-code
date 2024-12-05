import { DayEntryPoint } from "../../types/DayEntryPoint";

type DependencyNode = number[];

function getDependencyGraphFromRules(rules: string[]) {
  const graph = new Map<number, DependencyNode>();
  for (const rule of rules) {
    const [dependency, dependent] = rule.split("|").map(Number);
    if (!graph.has(dependent)) {
      graph.set(dependent, []);
    }

    graph.get(dependent)?.push(dependency);
  }

  return graph;
}

function areUpdatesValid(
  updates: number[],
  dependencyGraph: Map<number, DependencyNode>
) {
  const visited = new Set<number>();
  for (const update of updates) {
    const node = dependencyGraph.get(update);
    visited.add(update);
    if (!node) {
      continue;
    }

    const missingDependency = node.find(
      (dependency) => updates.includes(dependency) && !visited.has(dependency)
    );
    if (missingDependency) {
      return false;
    }
  }

  return true;
}

function getMiddlePage(updates: number[]) {
  const middlePageIndex = Math.floor(updates.length / 2);
  return updates[middlePageIndex];
}

function solvePartOne(
  rawUpdates: string[],
  dependencyGraph: Map<number, DependencyNode>
) {
  const validUpdatesList = rawUpdates
    .map((raw) => raw.split(",").map(Number))
    .filter((updates) => areUpdatesValid(updates, dependencyGraph));
  const middlePages = validUpdatesList.map(getMiddlePage);

  console.log(
    "first part:",
    middlePages.reduce((acc, curr) => acc + curr, 0)
  );
}

function solvePartTwo(
  rawUpdates: string[],
  dependencyGraph: Map<number, DependencyNode>
) {
  const invalidUpdatesList = rawUpdates
    .map((raw) => raw.split(",").map(Number))
    .filter((updates) => !areUpdatesValid(updates, dependencyGraph));

  const sortedUpdatesList = invalidUpdatesList.map((updates) =>
    updates.toSorted((a, b) => {
      if (dependencyGraph.get(a)?.includes(b)) {
        return 1;
      }
      if (dependencyGraph.get(b)?.includes(a)) {
        return -1;
      }
      return 0;
    })
  );
  const middlePages = sortedUpdatesList.map(getMiddlePage);
  console.log(
    "second part:",
    middlePages.reduce((acc, curr) => acc + curr, 0)
  );
}

export const run: DayEntryPoint = (input) => {
  const [rawRuleBlock, rawUpdateBlock] = input.split("\n\n");
  const rawRules = rawRuleBlock.split("\n");
  const rawUpdates = rawUpdateBlock.split("\n");

  const dependencyGraph = getDependencyGraphFromRules(rawRules);

  solvePartOne(rawUpdates, dependencyGraph);
  solvePartTwo(rawUpdates, dependencyGraph);
};
