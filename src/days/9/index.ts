import { DayEntryPoint } from "../../types/DayEntryPoint";

type FreeSpace = {
  type: "free";
  size: number;
};

type FileSpace = {
  type: "file";
  id: number;
  size: number;
};

export const run: DayEntryPoint = (input) => {
  const spaces: (FileSpace | FreeSpace)[] = input
    .split("")
    .map(Number)
    .map((n, index) =>
      index % 2 === 0
        ? ({
            type: "file",
            id: index / 2,
            size: n,
          } satisfies FileSpace)
        : ({
            type: "free",
            size: n,
          } satisfies FreeSpace)
    );

  solvePartOne(getDiskRepresentation(spaces).slice());
  solvePartTwo(spaces.slice());
};

function getDiskRepresentation(spaces: (FileSpace | FreeSpace)[]) {
  return spaces.flatMap((space, index) =>
    space.type === "file"
      ? new Array(space.size).fill(space.id)
      : new Array(space.size).fill(".")
  );
}

function solvePartOne(numbers: any[]) {
  for (let index = numbers.length - 1; index >= 0; index--) {
    const n = numbers[index];
    if (n === ".") {
      continue;
    }

    const nearestEmptySpace = numbers.indexOf(".");
    if (nearestEmptySpace === -1 || nearestEmptySpace > index) {
      break;
    }

    numbers[index] = ".";
    numbers[nearestEmptySpace] = n;
  }

  console.log("first part:", calculateChecksum(numbers));
}

function solvePartTwo(spaces: (FreeSpace | FileSpace)[]) {
  for (let index = spaces.length - 1; index >= 0; index--) {
    const space = spaces[index];
    if (space.type === "free") {
      continue;
    }

    const nearestEmptySpaceIndex = spaces.findIndex(
      (s) => s.type === "free" && s.size >= space.size
    );
    if (nearestEmptySpaceIndex === -1 || nearestEmptySpaceIndex > index) {
      continue;
    }

    const nearestEmptySpace = spaces[nearestEmptySpaceIndex];
    if (nearestEmptySpace.size === space.size) {
      spaces[nearestEmptySpaceIndex] = space;
      spaces[index] = nearestEmptySpace;
      continue;
    }

    spaces[index] = { ...nearestEmptySpace, size: space.size };
    nearestEmptySpace.size -= space.size;
    spaces.splice(nearestEmptySpaceIndex, 0, space);
  }

  const disk = getDiskRepresentation(spaces);
  console.log("second part:", calculateChecksum(disk));
}

function calculateChecksum(numbers: (number | string)[]) {
  return numbers.reduce<number>(
    (acc, n, index) => (typeof n === "string" ? acc : acc + n * index),
    0
  );
}
