import { DayEntryPoint } from "../../types/DayEntryPoint";

const blockMapping: Record<string, string> = {
  "{": "}",
  "[": "]",
  "<": ">",
  "(": ")",
};

function solveFirst(lines: string[]) {
  const wrongBlockPoints: Record<string, number> = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  const wrongBlockEnd = [];
  for (const line of lines) {
    const blocks: string[] = [];
    for (const char of line) {
      if (["[", "(", "{", "<"].includes(char)) {
        blocks.push(char);
      } else {
        const lastOpenedBlock = blocks[blocks.length - 1];
        if (char === blockMapping[lastOpenedBlock]) {
          blocks.pop();
        } else {
          wrongBlockEnd.push(char);
          break;
        }
      }
    }
  }
  console.log(
    "first:",
    wrongBlockEnd.reduce((sum, block) => wrongBlockPoints[block] + sum, 0)
  );
}

function solveSecond(lines: string[]) {
  const wrongBlockPoints: Record<string, number> = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };
  const scores = [];

  lineFor: for (const line of lines) {
    const blocks: string[] = [];
    for (const char of line) {
      if (["[", "(", "{", "<"].includes(char)) {
        blocks.push(char);
      } else {
        const lastOpenedBlock = blocks[blocks.length - 1];
        if (char === blockMapping[lastOpenedBlock]) {
          blocks.pop();
        } else {
          continue lineFor;
        }
      }
    }
    const endingBlocks = blocks.map((block) => blockMapping[block]).reverse();
    const score = endingBlocks.reduce(
      (sum, block) => sum * 5 + wrongBlockPoints[block],
      0
    );
    scores.push(score);
  }
  const middleScore = scores.sort((a, b) => a - b)[
    Math.round(scores.length / 2) - 1
  ];
  console.log(
    "second:",
    middleScore,
    scores.length,
    Math.round(scores.length / 2),
    scores
  );
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
