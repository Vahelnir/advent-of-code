import { DayEntryPoint } from "../../types/DayEntryPoint";

const ALLOWED_STATEMENT_KEYS = ["x", "m", "a", "s"] as const;

type PartKey = (typeof ALLOWED_STATEMENT_KEYS)[number];
type Part = Record<PartKey, number>;
type ConditionOperator = "<" | ">";
type ConditionStatement = {
  next: string;
  condition?: { key: PartKey; operator: ConditionOperator; value: number };
};
type Workflow = {
  name: string;
  conditions: ConditionStatement[];
};
type Boundary = { min: number; max: number };
type StackElement = {
  boundaries: Record<PartKey, Boundary>;
  workflow: Workflow;
  visitedWorkflows: Set<string>;
};

// a<2006:qkq
const parseCondition = (rawStatement: string): ConditionStatement => {
  const splitCondition = rawStatement.split(":");
  if (splitCondition.length === 1) {
    return { next: splitCondition[0] };
  }

  const next = splitCondition[1];
  const match = splitCondition[0].match(/(\w+)([<>])(\d+)/);
  if (!match) {
    console.error(splitCondition);
    throw new Error("an error occured");
  }

  return {
    next,
    condition: {
      key: match[1] as PartKey,
      operator: match[2] as ConditionOperator,
      value: Number(match[3]),
    },
  };
};

const parseWorkflow = (rawWorkflow: string) => {
  const [name, rawConditions] = rawWorkflow
    .split("{")
    .map((el) => el.replace("}", ""));
  const conditions = rawConditions.split(",").map(parseCondition);
  return { name, conditions } satisfies Workflow;
};

const parsePart = (rawPart: string) => {
  return rawPart
    .replace("{", "")
    .replace("}", "")
    .split(",")
    .map((entry) => entry.split("="))
    .reduce(
      (part, [key, value]) =>
        ({ ...part, [key]: Number(value) }) satisfies Part,
      {} as Part,
    );
};

const evaluateCondition = (
  condition: NonNullable<ConditionStatement["condition"]>,
  part: Part,
) => {
  if (condition.operator === ">") {
    return part[condition.key] > condition.value;
  }
  return part[condition.key] < condition.value;
};

function validatePart(
  workflowMap: Map<string, Workflow>,
  part: {
    [p: string]: number;
    a: number;
    s: number;
    x: number;
    m: number;
  },
) {
  let currentWorkflowName: string | undefined = "in";
  while (currentWorkflowName) {
    if ("AR".includes(currentWorkflowName)) {
      return currentWorkflowName;
    }

    const currentWorkflow = workflowMap.get(currentWorkflowName);
    if (!currentWorkflow) {
      throw new Error("no workflow with that name");
    }

    for (const condition of currentWorkflow.conditions) {
      if (
        condition.condition &&
        !evaluateCondition(condition.condition, part)
      ) {
        continue;
      }

      currentWorkflowName = condition.next;
      break;
    }
  }
}

const isOverlapping = (a: Boundary, b: Boundary) => {
  return (
    (a.min >= b.min && a.min <= b.max) || (a.max <= b.max && a.max >= b.min)
  );
};
const isSubset = (a: Boundary, b: Boundary) => {
  return a.min >= b.min && a.min <= b.max && a.max <= b.max && a.max >= b.min;
};

const tryUnion = (a: Boundary, b: Boundary) => {
  if (!isOverlapping(a, b) && !isOverlapping(b, a)) {
    return undefined;
  }

  // console.log("a", a.min, a.max, b.min, b.max);
  // console.log("b", Math.max(a.max, b.max), Math.min(a.min, b.min));
  return { max: Math.max(a.max, b.max), min: Math.min(a.min, b.min) };
};

export const run: DayEntryPoint = (input) => {
  const [rawWorkflows, rawParts] = input
    .split("\n\n")
    .map((fragment) => fragment.split("\n"));
  const workflowMap = rawWorkflows
    .map(parseWorkflow)
    .reduce((map, workflow) => {
      map.set(workflow.name, workflow);
      return map;
    }, new Map<string, Workflow>());
  const parts = rawParts.map(parsePart);

  const res = parts
    .filter((part) => validatePart(workflowMap, part) === "A")
    .reduce((acc, { a, m, s, x }) => acc + a + m + s + x, 0);
  console.log("first", res);

  const initialWorkflow = workflowMap.get("in");
  if (!initialWorkflow) {
    throw new Error("no initial workflow");
  }

  const boundariesList: StackElement["boundaries"][] = [];

  const defaultBoundary = { min: 1, max: 4000 };
  const stack: StackElement[] = [
    {
      boundaries: {
        x: { ...defaultBoundary },
        m: { ...defaultBoundary },
        a: { ...defaultBoundary },
        s: { ...defaultBoundary },
      },
      workflow: initialWorkflow,
      visitedWorkflows: new Set<string>(),
    },
  ];
  while (stack.length > 0) {
    const element = stack.pop();
    if (!element || element.visitedWorkflows.has(element.workflow.name)) {
      continue;
    }

    const { visitedWorkflows, boundaries, workflow } = element;

    const newVisitedWorkflow = new Set([...visitedWorkflows, workflow.name]);
    const nextWorkflows = workflow.conditions.map((condition) => {
      if (condition.next === "A") {
        boundariesList.push(boundaries);
        return undefined;
      }
      if (condition.next === "R") {
        return undefined;
      }
      const nextWorkflow = workflowMap.get(condition.next);
      if (!nextWorkflow) {
        throw new Error(`no workflow with this name "${condition.next}"`);
      }

      if (condition.condition) {
        const cond = condition.condition;
        const operator = cond.operator;
        if (operator === ">") {
          return {
            boundaries: {
              ...boundaries,
              [cond.key]: {
                ...boundaries[cond.key],
                min: Math.max(cond.value, boundaries[cond.key].min),
              },
            },
            workflow: nextWorkflow,
            visitedWorkflows: newVisitedWorkflow,
          };
        }

        return {
          boundaries: {
            ...boundaries,
            [cond.key]: {
              ...boundaries[cond.key],
              max: Math.min(cond.value, boundaries[cond.key].max),
            },
          },
          workflow: nextWorkflow,
          visitedWorkflows: newVisitedWorkflow,
        };
      }

      return {
        boundaries,
        workflow: nextWorkflow, // because yolo
        visitedWorkflows: new Set([...visitedWorkflows, workflow.name]),
      } satisfies StackElement;
    });

    stack.push(
      ...nextWorkflows.filter((el): el is StackElement => el !== null),
    );
  }

  const testBoundaries: StackElement["boundaries"][] = [];
  for (const boundaries of boundariesList.filter(
    // remove duplicates
    (boundaries1, index) =>
      index ===
      boundariesList.findIndex((boundaries2) =>
        Bun.deepEquals(boundaries1, boundaries2, true),
      ),
  )) {
    const unions = boundariesList.map((boundaries2) => ({
      x: tryUnion(boundaries.x, boundaries2.x) ?? boundaries.x,
      m: tryUnion(boundaries.m, boundaries2.m) ?? boundaries.m,
      a: tryUnion(boundaries.a, boundaries2.a) ?? boundaries.a,
      s: tryUnion(boundaries.s, boundaries2.s) ?? boundaries.s,
    }));
    testBoundaries.push(...unions);
  }
  console.log(
    boundariesList.filter(
      // remove duplicates
      (boundaries1, index) =>
        index ===
        boundariesList.findIndex((boundaries2) =>
          Bun.deepEquals(boundaries1, boundaries2, true),
        ),
    ),
  );
  console.log(
    "second",
    testBoundaries
      .filter(
        // remove duplicates
        (boundaries1, index) =>
          index ===
          boundariesList.findIndex((boundaries2) =>
            Bun.deepEquals(boundaries1, boundaries2, true),
          ),
      )
      .reduce((acc, { x, m, a, s }) => {
        return (
          acc +
          (x.max - x.min - 1) *
            (m.max - m.min - 1) *
            (a.max - a.min - 1) *
            (s.max - s.min - 1)
        );
      }, 0),
  );
};
