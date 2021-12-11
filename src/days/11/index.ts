import { DayEntryPoint } from "../../types/DayEntryPoint";

type Octopus = { position: Position; energy: number; lastFlashStep: number };
type Position = { x: number; y: number };

function parseOctopuses(lines: string[]) {
  return lines.map((line, y) =>
    line
      .split("")
      .map((energy) => +energy)
      .map((energy, x) => createOctopus(energy, { x, y }))
  );
}

function createOctopus(energy: number, { x, y }: Position): Octopus {
  return { position: { x, y }, energy, lastFlashStep: -1 };
}

function octopusTick(octopus: Octopus, step: number) {
  if (octopusHasFlashed(octopus, step)) {
    return { octopus, hasFlashed: false };
  }

  octopus.energy++;
  if (octopus.energy > 9 && octopus.lastFlashStep < step) {
    octopus.energy = 0;
    octopus.lastFlashStep = step;
    return { octopus, hasFlashed: true };
  }
  return { octopus, hasFlashed: false };
}

function octopusHasFlashed(octopus: Octopus, step: number) {
  return octopus.lastFlashStep === step;
}

function getOctopusAt(
  octopuses: Octopus[][],
  { x, y }: Position
): Octopus | undefined {
  return octopuses?.[y]?.[x];
}

function getAdjacentOctopus(
  octopuses: Octopus[][],
  { x: currentX, y: currentY }: Position
) {
  return [
    getOctopusAt(octopuses, { x: currentX - 1, y: currentY }),
    getOctopusAt(octopuses, { x: currentX, y: currentY + 1 }),
    getOctopusAt(octopuses, { x: currentX + 1, y: currentY }),
    getOctopusAt(octopuses, { x: currentX, y: currentY - 1 }),
    getOctopusAt(octopuses, { x: currentX - 1, y: currentY - 1 }),
    getOctopusAt(octopuses, { x: currentX + 1, y: currentY + 1 }),
    getOctopusAt(octopuses, { x: currentX + 1, y: currentY - 1 }),
    getOctopusAt(octopuses, { x: currentX - 1, y: currentY + 1 }),
  ];
}

function tickAdjacent(
  octopuses: Octopus[][],
  step: number,
  { x, y }: Position
): Octopus[] {
  const tickedAdjacent = getAdjacentOctopus(octopuses, { x, y })
    .filter((octopus): octopus is Octopus => octopus !== undefined)
    .map((octopus) => octopusTick(octopus, step))
    .filter(({ hasFlashed }) => hasFlashed)
    .map(({ octopus }) => octopus);
  return [
    ...tickedAdjacent,
    ...tickedAdjacent.flatMap((octopus) =>
      tickAdjacent(octopuses, step, octopus.position)
    ),
  ];
}

function tickOctopuses(octopuses: Octopus[][], step: number) {
  return octopuses
    .flatMap((row) => row.map((octopus) => octopusTick(octopus, step)))
    .filter(({ hasFlashed }) => hasFlashed)
    .map(({ octopus }) => octopus);
}

async function solveFirst(lines: string[]) {
  const octopuses = parseOctopuses(lines);
  let flashCount = 0;
  for (let tick = 1; tick <= 100; tick++) {
    const flashingOctopus = tickOctopuses(octopuses, tick);

    for (const octopus of flashingOctopus) {
      flashCount += tickAdjacent(octopuses, tick, octopus.position).length + 1;
    }
  }
  console.log("first:", flashCount);
}

async function solveSecond(lines: string[]) {
  const octopuses = parseOctopuses(lines);

  let tick = 1;
  while (true) {
    const flashingOctopus = tickOctopuses(octopuses, tick);

    let flashCount = 0;
    for (const octopus of flashingOctopus) {
      flashCount += tickAdjacent(octopuses, tick, octopus.position).length + 1;
    }

    const octopusesCount = octopuses.length * octopuses[0].length;
    if (flashCount === octopusesCount) {
      console.log("second:", tick);
      return;
    }

    tick++;
  }
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
