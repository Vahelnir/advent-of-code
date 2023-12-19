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

const isStatementKey = (str: string): str is PartKey =>
  ALLOWED_STATEMENT_KEYS.includes(str as PartKey);

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
        ({ ...part, [key]: Number(value) } satisfies Part),
      {} as Part
    );
};

const evaluateCondition = (
  condition: NonNullable<ConditionStatement["condition"]>,
  part: Part
) => {
  if (condition.operator === ">") {
    return part[condition.key] > condition.value;
  }
  return part[condition.key] < condition.value;
};

export const run: DayEntryPoint = (input) => {
  const [rawWorkflows, rawParts] = input
    .split("\n\n")
    .map((fragment) => fragment.split("\n"));
  const workflows = rawWorkflows.map(parseWorkflow);
  const parts = rawParts.map(parsePart);
  const ﬁrstWorkflow = workflows[0];
  const workflowMap = workflows.reduce((map, workflow) => {
    map.set(workflow.name, workflow);
    return map;
  }, new Map<string, Workflow>());

  for (const part of parts) {
    let currentWorkflow: Workflow | undefined = ﬁrstWorkflow;
    while (currentWorkflow) {
      for (const condition of currentWorkflow.conditions) {
        if (
          !condition.condition ||
          (condition.condition && evaluateCondition(condition.condition, part))
        ) {
          currentWorkflow = workflowMap.get(condition.next);
        }
      }
    }
  }
};
