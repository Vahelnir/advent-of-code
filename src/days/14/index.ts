import { DayEntryPoint } from "../../types/DayEntryPoint";

type Dimensions = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
type Position = { x: number; y: number };

const simulateWithVoid = (input: string) => {
  const simulation = SandSimulation.withVoid(input);
  let voided = false;
  let iteration = 0;
  let lastPath = [];
  while (!voided) {
    let sandPosition: Position = { x: 500, y: 1 };
    let stuck = false;
    lastPath = [];
    while (!stuck && !voided) {
      if (simulation.canBePlacedAt(sandPosition.x, sandPosition.y + 1)) {
        sandPosition.y++;
      } else if (
        simulation.canBePlacedAt(sandPosition.x - 1, sandPosition.y + 1)
      ) {
        sandPosition.y++;
        sandPosition.x--;
      } else if (
        simulation.canBePlacedAt(sandPosition.x + 1, sandPosition.y + 1)
      ) {
        sandPosition.y++;
        sandPosition.x++;
      } else {
        stuck = true;
      }

      if (simulation.isVoidAt(sandPosition.x, sandPosition.y)) {
        voided = true;
        break;
      }

      lastPath.push({ ...sandPosition });
    }
    if (stuck) {
      simulation.placeAt(sandPosition.x, sandPosition.y, "o");
    }
    iteration++;
  }

  // console.log(lastPath);
  // lastPath.forEach(({ x, y }) => simulation.placeAt(x, y, "~"));

  simulation.display();
  return iteration - 1;
};

const simulateWithGround = (input: string) => {
  const simulation = SandSimulation.withGround(input);
  let voided = false;
  let iteration = 0;
  let lastPath = [];
  while (!voided) {
    let sandPosition: Position = { x: 500, y: 0 };
    if (!simulation.canBePlacedAt(sandPosition.x, sandPosition.y)) {
      console.log(simulation.tilesAt(sandPosition.x, sandPosition.y));
      iteration++;
      break;
    }
    let stuck = false;
    lastPath = [];
    while (!stuck && !voided) {
      if (simulation.canBePlacedAt(sandPosition.x, sandPosition.y + 1)) {
        sandPosition.y++;
      } else if (
        simulation.canBePlacedAt(sandPosition.x - 1, sandPosition.y + 1)
      ) {
        sandPosition.y++;
        sandPosition.x--;
      } else if (
        simulation.canBePlacedAt(sandPosition.x + 1, sandPosition.y + 1)
      ) {
        sandPosition.y++;
        sandPosition.x++;
      } else {
        stuck = true;
      }

      if (simulation.isVoidAt(sandPosition.x, sandPosition.y)) {
        voided = true;
        break;
      }

      lastPath.push({ ...sandPosition });
    }
    if (stuck) {
      simulation.placeAt(sandPosition.x, sandPosition.y, "o");
    }
    iteration++;
  }

  // console.log(lastPath);
  // lastPath.forEach(({ x, y }) => simulation.placeAt(x, y, "~"));

  simulation.display();
  return iteration - 1;
};

export const run: DayEntryPoint = (input) => {
  // console.log("first", simulateWithVoid(input));
  console.log("second", simulateWithGround(input));
};

type Element = {
  letter: string;
  from: Position;
  to: Position;
  draw: boolean;
};

class SandSimulation {
  private elements: Element[] = [];

  private isInRect({ x, y }: Position, from: Position, to: Position) {
    return from.x <= x && to.x >= x && from.y <= y && to.y >= y;
  }

  tilesAt(x: number, y: number) {
    return this.elements.filter(
      ({ from, to, letter }) =>
        this.isInRect({ x, y }, from, to) || this.isInRect({ x, y }, to, from)
    );
  }

  canBePlacedAt(x: number, y: number) {
    return !this.elements.some(
      ({ from, to, letter }) =>
        (this.isInRect({ x, y }, from, to) ||
          this.isInRect({ x, y }, to, from)) &&
        ["#", "o", "="].includes(letter)
    );
  }

  isVoidAt(x: number, y: number) {
    return this.elements.some(
      ({ from, to, letter }) =>
        (this.isInRect({ x, y }, from, to) ||
          this.isInRect({ x, y }, to, from)) &&
        letter === "*"
    );
  }

  placeAt(x: number, y: number, letter: string, draw?: boolean) {
    this.drawLine({ x, y }, { x, y }, letter, draw);
  }

  drawLine(from: Position, to: Position, letter = "#", draw = true) {
    this.elements.push({ letter, from, to, draw });
  }

  display() {
    const size = this.computeSize();
    console.log(size);
    const grid: string[][] = new Array(size.maxY - size.minY)
      .fill(null)
      .map(() => new Array(size.maxX - size.minX).fill("."));

    const place = (x: number, y: number, letter: string) =>
      (grid[y - size.minY][x - size.minX] = letter);

    for (const element of this.elements) {
      const { letter, from, to, draw } = element;
      if (!draw) {
        continue;
      }

      if (from.x - to.x < 0) {
        for (let x = from.x; x < to.x + 1; x++) {
          place(x, from.y, letter);
        }
      } else if (from.x - to.x >= 0) {
        for (let x = to.x; x < from.x + 1; x++) {
          place(x, to.y, letter);
        }
      }
      if (from.y - to.y < 0) {
        for (let y = from.y; y < to.y + 1; y++) {
          place(from.x, y, letter);
        }
      } else if (from.y - to.y >= 0) {
        for (let y = to.y; y < from.y + 1; y++) {
          place(to.x, y, letter);
        }
      }
    }
    console.log(grid.map((line) => line.join("")).join("\n"));
  }

  computeSize(): Dimensions {
    const groundAndSource = this.elements.filter(({ letter }) =>
      ["+", "#", "o"].includes(letter)
    );
    const firstElement = groundAndSource[0];
    const { minX, minY, maxX, maxY } = groundAndSource
      .filter((elem) => elem.draw)
      .flatMap(({ from, to }) => [from, to])
      .reduce(
        (acc, position) => ({
          minX: Math.min(acc.minX, position.x),
          maxX: Math.max(acc.maxX, position.x),
          minY: Math.min(acc.minY, position.y),
          maxY: Math.max(acc.maxY, position.y),
        }),
        {
          minX: firstElement.from.x,
          maxX: firstElement.from.x,
          minY: firstElement.from.y,
          maxY: firstElement.from.y,
        }
      );
    return { minX, minY, maxX: maxX + 1, maxY: maxY + 1 };
  }

  static new(input: string) {
    const rockPaths = input.split("\n").map((line) =>
      line
        .split("->")
        .map((coords) => coords.split(","))
        .map(([x, y]) => ({ x: Number(x), y: Number(y) }))
    );

    const simulation = new SandSimulation();
    simulation.placeAt(500, 0, "+");

    for (const rockPath of rockPaths) {
      let previousRock = rockPath[0];
      for (let i = 1; i < rockPath.length; i++) {
        const currentRock = rockPath[i];
        simulation.drawLine(previousRock, currentRock);
        previousRock = currentRock;
      }
    }
    return simulation;
  }

  static withVoid(input: string) {
    const simulation = SandSimulation.new(input);
    const size = simulation.computeSize();
    simulation.drawLine(
      { y: size.maxY, x: -Infinity },
      { y: size.maxY, x: Infinity },
      "*",
      false
    );

    return simulation;
  }

  static withGround(input: string) {
    const simulation = SandSimulation.new(input);
    const size = simulation.computeSize();
    simulation.drawLine(
      { y: size.maxY + 1, x: -Infinity },
      { y: size.maxY + 1, x: Infinity },
      "=",
      false
    );

    return simulation;
  }
}
