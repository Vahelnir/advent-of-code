import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };
type Antenna = { id: string; position: Position };

function solvePartOne(grid: string[][], antennas: Antenna[]) {
  const antinodes = new Set<string>();
  for (const antenna of antennas) {
    const similarAntennas = antennas.filter(
      (similarAntenna) =>
        similarAntenna.id === antenna.id &&
        similarAntenna.position.x !== antenna.position.x &&
        similarAntenna.position.y !== antenna.position.y
    );
    for (const similarAntenna of similarAntennas) {
      const dx = similarAntenna.position.x - antenna.position.x;
      const dy = similarAntenna.position.y - antenna.position.y;
      const elongatedPosition = {
        x: similarAntenna.position.x + dx,
        y: similarAntenna.position.y + dy,
      };
      if (
        elongatedPosition.x < 0 ||
        elongatedPosition.y < 0 ||
        elongatedPosition.x >= grid[0].length ||
        elongatedPosition.y >= grid.length
      ) {
        continue;
      }

      antinodes.add(`${elongatedPosition.y},${elongatedPosition.x}`);
    }
  }

  const finalGrid = grid.map((row) => row.map((cell) => cell));
  for (const antinode of antinodes) {
    const [y, x] = antinode.split(",").map(Number);
    finalGrid[y][x] = "#";
  }

  console.log(finalGrid.map((row) => row.join("")).join("\n"));
  console.log("part one:", antinodes.size);
}

function solvePartTwo(grid: string[][], antennas: Antenna[]) {
  const antinodes = new Set<string>();
  for (const antenna of antennas) {
    antinodes.add(`${antenna.position.y},${antenna.position.x}`);
    const similarAntennas = antennas.filter(
      (similarAntenna) =>
        similarAntenna.id === antenna.id &&
        similarAntenna.position.x !== antenna.position.x &&
        similarAntenna.position.y !== antenna.position.y
    );
    for (const similarAntenna of similarAntennas) {
      const dx = similarAntenna.position.x - antenna.position.x;
      const dy = similarAntenna.position.y - antenna.position.y;
      let elongatedPosition = {
        x: similarAntenna.position.x + dx,
        y: similarAntenna.position.y + dy,
      };
      while (
        elongatedPosition.x >= 0 &&
        elongatedPosition.y >= 0 &&
        elongatedPosition.x < grid[0].length &&
        elongatedPosition.y < grid.length
      ) {
        antinodes.add(`${elongatedPosition.y},${elongatedPosition.x}`);
        elongatedPosition = {
          x: elongatedPosition.x + dx,
          y: elongatedPosition.y + dy,
        };
      }
    }
  }

  const finalGrid = grid.map((row) => row.map((cell) => cell));
  for (const antinode of antinodes) {
    const [y, x] = antinode.split(",").map(Number);
    finalGrid[y][x] = "#";
  }

  console.log(finalGrid.map((row) => row.join("")).join("\n"));
  console.log("part two:", antinodes.size);
}

export const run: DayEntryPoint = (input) => {
  const grid = input.split("\n").map((row) => row.split(""));

  const antennas = grid
    .flatMap((row, y) =>
      row.map((cell, x) => ({ id: cell, position: { x, y } } satisfies Antenna))
    )
    .filter(({ id }) => id !== ".");
  solvePartOne(grid, antennas);
  solvePartTwo(grid, antennas);
};
