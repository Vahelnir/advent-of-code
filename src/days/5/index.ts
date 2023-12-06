import { DayEntryPoint } from "../../types/DayEntryPoint";

const toNumber = (v: string) => Number(v);

const findThroughAllMaps = (
  seed: number,
  maps: [number, number, number][][]
) => {
  return maps.reduce((acc, map, index) => {
    const found = map.find(
      ([, sourceRangeStart, length]) =>
        acc >= sourceRangeStart && acc < sourceRangeStart + length
    );
    if (!found) {
      return acc;
    }

    const [destRangeStart, sourceRangeStart] = found;
    const relative = acc - sourceRangeStart;
    return destRangeStart + relative;
  }, seed);
};

const solveFirst = (rawSeeds: string, maps: [number, number, number][][]) => {
  const seeds = rawSeeds.split(" ").slice(1).map(toNumber);

  return seeds.reduce(
    (location, seed) => Math.min(location, findThroughAllMaps(seed, maps)),
    Infinity
  );
};

const solveSecond = (rawSeeds: string, maps: [number, number, number][][]) => {
  const parsedSeeds = rawSeeds.split(" ").slice(1).map(toNumber);

  const seeds: [number, number][] = [];
  for (let i = 0; i < parsedSeeds.length / 2; i++) {
    const [startRange, length] = parsedSeeds.slice(i * 2, i * 2 + 2);
    seeds.push([startRange, length]);
  }

  const reversedMaps = maps
    .reverse()
    .map((map) => map.map(([a, b, c]): [number, number, number] => [b, a, c]));
  for (let i = 0; true; i++) {
    const found = findThroughAllMaps(i, reversedMaps);
    const foundSeed = seeds.find(
      ([start, length]) => start <= found && start + length - 1 > found
    );
    if (foundSeed) {
      return i;
    }
  }
};

export const run: DayEntryPoint = (input) => {
  const [rawSeeds, ...rawMaps] = input.split("\n\n");
  const maps = rawMaps.map((rawMap) =>
    rawMap
      .split("\n")
      .slice(1)
      .map((line): [number, number, number] => {
        const [destRangeStart, sourceRangeStart, length] = line
          .split(" ")
          .map(toNumber);
        return [destRangeStart, sourceRangeStart, length];
      })
  );

  console.log("first", solveFirst(rawSeeds, maps));
  console.log("second", solveSecond(rawSeeds, maps));
};
