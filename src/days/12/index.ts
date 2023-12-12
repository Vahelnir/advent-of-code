import { DayEntryPoint } from "../../types/DayEntryPoint";

const toNumber = (v: string) => Number(v);

const replace = (slice: string): string[] => {
  if (slice.length === 0) {
    return [];
  }

  if (slice.startsWith("#")) {
    return [slice.replaceAll("?", "#")];
  }

  const solutions = [slice.replaceAll("?", "#")];

  const firstQuestionMarkIndex = slice.indexOf("?");
  if (firstQuestionMarkIndex > -1) {
    solutions.push(
      slice.slice(0, firstQuestionMarkIndex) +
        "." +
        slice.slice(firstQuestionMarkIndex + 1)
    );
  }

  return solutions;
};

const recursiveTest = (
  spring: string,
  groups: number[],
  index = 0
): string[] => {
  // console.log(spring, groups);
  if (groups.length === 0) {
    if (spring.slice(index).includes("#")) {
      return [];
    }
    return [spring.replaceAll("?", ".")];
  }

  if (
    groups.length === 1 &&
    groups[0] < [...spring.slice(index)].filter((v) => v === "#").length
  ) {
    return [];
  }

  if (groups[0] > spring.length - index) {
    return [];
  }

  if (index === spring.length) {
    return [spring];
  }

  const group = groups[0] ?? 0;
  const capturedGroup = spring.slice(index, index + group);
  if (!capturedGroup.includes(".")) {
    if (spring[index + group] === "#") {
      // console.log("cannot be grouped", "." + spring.slice(1));
      return recursiveTest(spring.replace("?", "."), groups, index + 1);
    }

    const newMatches = capturedGroup.includes("?")
      ? replace(capturedGroup)
      : [capturedGroup];

    const res = newMatches.flatMap((match) => {
      if (match !== "#".repeat(group)) {
        return recursiveTest(
          spring.slice(0, index) + match + spring.slice(index + group),
          groups,
          index + 1
        );
      }

      if (spring[index + group] === "?") {
        return recursiveTest(
          spring.slice(0, index) +
            match +
            "." +
            spring.slice(index + group + 1),
          groups.slice(1),
          index + group
        );
      }

      return recursiveTest(
        spring.slice(0, index) + match + spring.slice(index + group),
        groups.slice(1),
        index + group
      );
    });

    // console.log("found matches", newMatches);
    return res;
  }

  if (capturedGroup.includes(".") && capturedGroup[0] === "#") {
    return [];
  }

  const letter = spring[index];
  if (letter === "?") {
    // console.log("letter");
    return recursiveTest(spring.replace("?", "."), groups, index + 1);
  }

  return recursiveTest(spring, groups, index + 1);
};

const solve = (input: string, count = 1) => {
  const lines = input
    .split("\n")
    .map((line) => line.split(" "))
    .map(([spring, groups]): { spring: string; groups: number[] } => {
      const g = groups.split(",").map(toNumber);
      return {
        spring: new Array(count)
          .fill(0)
          .flatMap(() => spring)
          .join("?"),
        groups: new Array(count).fill(0).flatMap(() => [...g]),
      };
    });

  // const { spring, groups } = lines[106];
  // const res = recursiveTest(spring, groups);
  // console.log();
  // console.log();
  // console.log(spring, groups);
  // console.log(res.join("\n"));

  // const res2 = bruteForce(spring, groups);
  // console.log();
  // console.log(res2.join("\n"));
  // console.log(res.length, res2.length);
  console.log(lines[0]);
  return lines
    .map(({ spring, groups }, index) => {
      console.time("steps");
      // TODO: stop calling filterValid
      const res = filterValid(
        spring,
        groups,
        recursiveTest(spring, groups)
      ).length;
      console.timeEnd("steps");
      return res;
    })
    .reduce((acc, v) => acc + v);
};

export const run: DayEntryPoint = (input) => {
  // console.log("first", solve(input));
  console.log("second", solve(input, 5));
};

const filterValid = (spring: string, groups: number[], values: string[]) => {
  const rawRegex =
    "^\\.*" + groups.map((group) => `[#]{${group}}`).join("\\.+") + "\\.*$";
  const regex = new RegExp(rawRegex);
  return values.filter((value) => regex.test(value));
};

const bruteForce = (spring: string, groups: number[]) => {
  const t = (spring: string): string[] => {
    if (spring.length === 0) {
      return [""];
    }
    if (spring[0] === "?") {
      return t(spring.slice(1)).flatMap((v) =>
        [".", "#"].map((prefix) => prefix + v)
      );
    }
    return t(spring.slice(1)).map((v) => spring[0] + v);
  };

  return filterValid(spring, groups, t(spring));
};
