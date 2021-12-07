import { DayEntryPoint } from "../../types/DayEntryPoint";

const sum = (sum: number, value: number) => sum + value;

function getFuelCost(movement: number): number {
  return (movement * (movement + 1)) / 2;
}

function solveFirst(lines: string[]) {
  const positions = lines[0]
    .split(",")
    .map((pos) => +pos)
    .sort((a, b) => a - b);
  const median = positions[positions.length / 2 - 1];
  const getFuelCostToTarget = (target: number) =>
    positions
      .map((position) => Math.abs(position - target))
      .reduce((sum, movement) => sum + movement, 0);
  const fuelCost = getFuelCostToTarget(median);
  console.log("first:", fuelCost);
}

function solveSecond(lines: string[]) {
  const positions = lines[0]
    .split(",")
    .map((pos) => +pos)
    .sort((a, b) => a - b);
  const mean = positions.reduce(sum, 0) / positions.length;
  const ceilMean = Math.ceil(mean);
  const floorMean = ceilMean - 1;
  const getFuelCostToTarget = (target: number) =>
    positions
      .map((position) => Math.abs(position - target))
      .reduce((sum, movement) => sum + getFuelCost(movement), 0);
  const fuelCost = Math.min(
    getFuelCostToTarget(ceilMean),
    getFuelCostToTarget(floorMean)
  );
  console.log("second:", fuelCost);
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
