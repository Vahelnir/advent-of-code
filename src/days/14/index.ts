import { DayEntryPoint } from "../../types/DayEntryPoint";

type Dimensions = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
type Position = { x: number; y: number };

export const run: DayEntryPoint = (input) => {
  const rockPaths = input.split("\n").map((line) =>
    line
      .split("->")
      .map((coords) => coords.split(","))
      .map(([x, y]) => ({ x: Number(x), y: Number(y) }))
  );

  const flattenedRocks = rockPaths.flat(2);
  const allX = flattenedRocks.map(({ x }) => x);
  const allY = flattenedRocks.map(({ y }) => y);
  const size = {
    minX: Math.min(...allX) - 1,
    maxX: Math.max(...allX) + 2,
    minY: Math.min(...allY, 0),
    maxY: Math.max(...allY) + 2,
  };
  console.log(size);
  const grid = new Grid(size);

  grid.placeAt(500, 0, "+");

  for (const rockPath of rockPaths) {
    let previousRock = rockPath[0];
    for (let i = 1; i < rockPath.length; i++) {
      const currentRock = rockPath[i];
      grid.drawLine(previousRock, currentRock);
      previousRock = currentRock;
    }
  }

  let voided = false;
  let iteration = 0;
  let lastPath = [];
  while (!voided) {
    let sandPosition: Position = { x: 500, y: 1 };
    let stuck = false;
    lastPath = [];
    while (!stuck && !voided) {
      if (grid.tileAt(sandPosition.x, sandPosition.y + 1) === ".") {
        sandPosition.y++;
      } else if (grid.tileAt(sandPosition.x - 1, sandPosition.y + 1) === ".") {
        sandPosition.y++;
        sandPosition.x--;
      } else if (grid.tileAt(sandPosition.x + 1, sandPosition.y + 1) === ".") {
        sandPosition.y++;
        sandPosition.x++;
      } else {
        stuck = true;
      }

      if (
        sandPosition.x < size.minX + 1 ||
        sandPosition.x > size.maxX - 1 ||
        sandPosition.y < size.minY ||
        sandPosition.y > size.maxY - 1
      ) {
        voided = true;
        break;
      }

      lastPath.push({ ...sandPosition });
    }
    if (stuck) {
      grid.placeAt(sandPosition.x, sandPosition.y, "o");
    }
    iteration++;
  }

  console.log(lastPath);
  lastPath.forEach(({ x, y }) => grid.placeAt(x, y, "~"));

  console.log(iteration - 1, voided);
  grid.display();
};

class Grid {
  private grid: string[][];
  private dimensions: Dimensions;

  constructor(dimensions: Dimensions) {
    this.grid = new Array(dimensions.maxY - dimensions.minY)
      .fill(null)
      .map(() => new Array(dimensions.maxX - dimensions.minX).fill("."));
    this.dimensions = dimensions;
  }

  tileAt(x: number, y: number) {
    if (y >= this.dimensions.maxY || x >= this.dimensions.maxX) {
      return ".";
    }
    return this.grid[y - this.dimensions.minY][x - this.dimensions.minX];
  }

  placeAt(x: number, y: number, value: string) {
    this.grid[y - this.dimensions.minY][x - this.dimensions.minX] = value;
  }

  drawLine(from: Position, to: Position, value = "#") {
    if (from.x - to.x < 0) {
      for (let x = from.x; x < to.x + 1; x++) {
        this.placeAt(x, from.y, value);
      }
    } else if (from.x - to.x > 0) {
      for (let x = to.x; x < from.x + 1; x++) {
        this.placeAt(x, to.y, value);
      }
    }
    if (from.y - to.y < 0) {
      for (let y = from.y; y < to.y + 1; y++) {
        this.placeAt(from.x, y, value);
      }
    } else if (from.y - to.y > 0) {
      for (let y = to.y; y < from.y + 1; y++) {
        this.placeAt(to.x, y, value);
      }
    }
  }

  display() {
    const corners = [
      { x: this.dimensions.minX, y: this.dimensions.minY },
      { x: this.dimensions.minX, y: this.dimensions.maxY - 1 },
      { x: this.dimensions.maxX - 1, y: this.dimensions.maxY - 1 },
      { x: this.dimensions.maxX - 1, y: this.dimensions.minY },
    ];
    this.drawLine(corners[0], corners[1], " ");
    this.drawLine(corners[1], corners[2], " ");
    this.drawLine(corners[2], corners[3], " ");
    console.log(this.grid.map((line) => line.join("")).join("\n"));
  }

  get rawGrid() {
    return this.grid;
  }
}
