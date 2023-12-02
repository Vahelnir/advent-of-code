import { DayEntryPoint } from "../../types/DayEntryPoint";

const ALLOWED_COLORS = ["red", "green", "blue"] as const;

type CubeColors = (typeof ALLOWED_COLORS)[number];

type Cube = {
  count: number;
  color: CubeColors;
};

type Game = {
  id: number;
  shown: Cube[];
  isPossible: boolean;
  possibleCubes: Record<CubeColors, number>;
};

const MAX_CUBES_PER_COLOR: Record<CubeColors, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const createCube = (count: number, color: string): Cube => {
  const cubeColor = color as CubeColors;
  if (!ALLOWED_COLORS.includes(cubeColor)) {
    throw new Error(`color ${cubeColor} is not authorized`);
  }

  return { count, color: cubeColor };
};

const isGamePossible = (cube: Cube) =>
  cube.count > MAX_CUBES_PER_COLOR[cube.color];

const parseGame = (line: string): Game => {
  const [rawGameId, rest] = line.split(":");
  const gameId = rawGameId.replace("Game ", "");

  const shownCubes = rest
    .split(";")
    .flatMap((line) => line.split(","))
    .map((line) => line.trim().split(" "))
    .map(([count, color]) => createCube(Number(count), color));

  return {
    id: Number(gameId),
    shown: shownCubes,
    isPossible: !shownCubes.some(isGamePossible),
    possibleCubes: shownCubes.reduce(
      (acc, cube) => {
        const existingCount = acc[cube.color];
        if (existingCount === undefined || existingCount < cube.count) {
          return { ...acc, [cube.color]: cube.count };
        }
        return acc;
      },
      { red: 0, blue: 0, green: 0 }
    ),
  };
};

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line !== "");
  const games = lines.map(parseGame);
  console.log(
    "first",
    games
      .filter((game) => game.isPossible)
      .reduce((acc, game) => acc + game.id, 0)
  );
  console.log(
    "second",
    games
      .map(({ possibleCubes: { red, green, blue } }) => red * green * blue)
      .reduce((acc, power) => acc + power)
  );
};
