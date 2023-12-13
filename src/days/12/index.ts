import { DayEntryPoint } from "../../types/DayEntryPoint";

const toNumber = (v: string) => Number(v);

function memoize<T extends (...args: any[]) => unknown>(func: T): T;
function memoize(
  func: (...args: unknown[]) => unknown,
): (...args: unknown[]) => unknown {
  const cache = new Map<string, unknown>();
  return (...args: any[]) => {
    if (cache.has(args.toString())) {
      return cache.get(args.toString());
    }
    const value = func(...args);
    cache.set(args.toString(), func(...args));
    return value;
  };
}

const solve = memoize((springs: string, groups: number[]): string[] => {
  if (springs.length === 0 && groups.length > 0) {
    return [];
  }

  if (springs.length === 0) {
    return [springs];
  }

  if (groups.length === 0 && springs.includes("#")) {
    return [];
  }

  const group = groups[0];
  const rawExtractedGroup = springs.slice(0, group);
  const extractedGroup = rawExtractedGroup.replaceAll("?", "#");
  if (extractedGroup === "#".repeat(group)) {
    const endNeighbour = springs[group] ?? "";
    if (endNeighbour === "#") {
      if (springs[0] === "#") {
        return [];
      }
      return solve(springs.slice(1), groups).map(
        (slice) => springs[0].replace("?", ".") + slice,
      );
    }
    const matches = [
      ...solve(springs.slice(group + 1), groups.slice(1)).map((slice) => {
        return extractedGroup + endNeighbour.replace("?", ".") + slice;
      }),
    ];
    if (rawExtractedGroup !== extractedGroup && rawExtractedGroup[0] !== "#") {
      return [
        ...matches,
        ...solve(springs.slice(1), groups).map((slice) => {
          return springs[0].replace("?", ".") + slice;
        }),
      ];
    }
    return matches;
  }

  if (springs[0] === "?") {
    return solve(springs.slice(1), groups).map((slice) => "." + slice);
  }

  if (springs[0] === "#") {
    return [];
  }

  return solve(springs.slice(1), groups).map((slice) => springs[0] + slice);
});

export const run: DayEntryPoint = (input) => {
  const lines = input
    .split("\n")
    .map((line) => line.split(" "))
    .map(([springs, groups]) => ({
      springs,
      groups: groups.split(",").map(toNumber),
    }));

  console.log(
    "first",
    lines
      .map(({ springs, groups }) => solve(springs, groups))
      .map((v) => v.length)
      .reduce((acc, v) => acc + v),
  );

  const newLines = lines.map(({ springs, groups }) => {
    return {
      springs: new Array(5).fill(springs).join("?"),
      groups: new Array(5).fill([...groups]).flat(),
    };
  });

  console.log(
    "second",
    newLines
      .map(({ springs, groups }, index) => {
        console.log(index);
        return solve(springs, groups);
      })
      .map((v) => v.length)
      .reduce((acc, v) => acc + v),
  );

  // const { springs, groups } = newLines[5];
  // console.log();
  // console.log(springs, groups);
  // console.log();
  // console.log(solve(springs, groups).join("\n"));
  // console.log();
  // console.log(bruteforce(springs, groups).join("\n"));

  // const all = lines.map(({ springs, groups }) => solve(springs, groups));
  // console.log(all.map((v) => v.length).reduce((acc, v) => acc + v));

  // const all = lines.filter(
  //   ({ springs, groups }) =>
  //     solve(springs, groups).length !== bruteforce(springs, groups).length,
  // );
  // console.log(all);

  // const all = lines.map(({ springs, groups }) => bruteforce(springs, groups));
  // console.log(all.map((v) => v.length).reduce((acc, v) => acc + v));
};

const bruteforce = (springs: string, groups: number[]): string[] => {
  const solutions = new Set<string>();
  const t = (str: string): string[] => {
    if (!str) {
      return [""];
    }

    if (str[0] === "?") {
      const prefixes = [str[0].replace("?", "#"), str[0].replace("?", ".")];
      return t(str.slice(1)).flatMap((slice) => prefixes.map((v) => v + slice));
    }

    return t(str.slice(1)).flatMap((slice) => str[0] + slice);
  };

  const rawRegex =
    "^\\.*" + groups.map((group) => `[#]{${group}}`).join("\\.+") + "\\.*$";
  const regex = new RegExp(rawRegex);

  return [...new Set(t(springs))].filter((v) => regex.test(v));
};
