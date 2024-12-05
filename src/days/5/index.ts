import { DayEntryPoint } from "../../types/DayEntryPoint";

type DependencyNode = { dependencies: number[]; allDependencies: Set<number> };

function getDependencyGraphFromRules(rules: string[]) {
  const graph = new Map<number, DependencyNode>();
  for (const rule of rules) {
    const [dependency, dependent] = rule.split("|").map(Number);
    if (!graph.has(dependent)) {
      graph.set(dependent, { dependencies: [], allDependencies: new Set() });
    }

    graph.get(dependent)?.dependencies.push(dependency);
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

    const missingDependency = node.dependencies.find(
      (dependency) => updates.includes(dependency) && !visited.has(dependency)
    );
    if (missingDependency) {
      // console.log("Visited:", visited, "Updates:", updates);
      // console.log(
      //   missingDependency,
      //   "is missing for",
      //   update,
      //   updates.includes(missingDependency),
      //   !visited.has(missingDependency)
      // );
      return false;
    }
  }

  return true;
}

export const run: DayEntryPoint = (input) => {
  const [rawRuleBlock, rawUpdateBlock] = input.split("\n\n");
  const rawRules = rawRuleBlock.split("\n");
  const rawUpdates = rawUpdateBlock.split("\n");

  const dependencyGraph = getDependencyGraphFromRules(rawRules);
  // for (const [nodeId, node] of dependencyGraph.entries()) {
  //   node.allDependencies
  // }
  const middlePages: number[] = [];
  for (const rawUpdate of rawUpdates) {
    const updates = rawUpdate.split(",").map(Number);
    if (areUpdatesValid(updates, dependencyGraph)) {
      console.log("Valid update:", updates);
      const middlePageIndex = Math.floor(updates.length / 2);
      middlePages.push(updates[middlePageIndex]);
    }
  }

  console.log(
    "first part:",
    middlePages.join(","),
    middlePages.reduce((acc, curr) => acc + curr, 0)
  );
};
