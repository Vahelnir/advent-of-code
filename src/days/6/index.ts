import { DayEntryPoint } from "../../types/DayEntryPoint";

type Fish = { daysUntilSpawn: number };

function createFish(daysUntilSpawn = 8): Fish {
  return { daysUntilSpawn };
}

function parseFishStates(lines: string[]): number[] {
  return lines[0]
    .split(",")
    .map((fishState) => +fishState)
    .reduce((fishList, fishState) => {
      const newList = [...fishList];
      newList[fishState]++;
      return newList;
    }, Array(9).fill(0));
}

function updateFishList(fishList: number[]) {
  const [first, ...rest] = fishList.slice(0, 7);
  const [beforeLast, last] = fishList.slice(7);
  return [...rest, first + beforeLast, last, 0];
}

function getFishCountAfterDays(lines: string[], days: number) {
  let fishList = parseFishStates(lines);
  for (let day = 0; day < days; day++) {
    const fishToSpawn = fishList[0];
    fishList = updateFishList(fishList);
    fishList[8] += fishToSpawn;
  }
  return fishList.reduce((sum, count) => sum + count, 0);
}

function solveFirst(lines: string[]) {
  console.log("first:", getFishCountAfterDays(lines, 80));
}

function solveSecond(lines: string[]) {
  console.log("second:", getFishCountAfterDays(lines, 256));
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
