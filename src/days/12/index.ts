import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };

type Cell = {
  position: Position;
  height: number;
  nearest_cell: Cell | undefined;
  length: number;
  is_start: boolean;
  is_end: boolean;
  visited: boolean;
};

type Grid = Cell[][];

const lowest = "a".charCodeAt(0);

function is_defined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function to_cell(letter: string, position: Position): Cell {
  let is_start = false;
  let is_end = false;
  if (letter === "S") {
    letter = "a";
    is_start = true;
  }
  if (letter === "E") {
    letter = "z";
    is_end = true;
  }
  return {
    position,
    height: letter.charCodeAt(0) - lowest,
    nearest_cell: undefined,
    length: -1,
    is_start,
    is_end,
    visited: false,
  };
}

function find_cell(
  grid: Grid,
  find_func: (cell: Cell) => boolean
): Cell | undefined {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const current_cell = grid[y][x];
      if (find_func(current_cell)) {
        return current_cell;
      }
    }
  }
}

function get_cell(grid: Grid, { x, y }: Position) {
  if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
    return undefined;
  }
  return grid[y][x];
}

function get_possible_nearby_cells(grid: Grid, cell: Cell) {
  const {
    position: { x, y },
    height,
    length,
  } = cell;
  return [
    get_cell(grid, { y, x: x + 1 }),
    get_cell(grid, { y, x: x - 1 }),
    get_cell(grid, { y: y + 1, x }),
    get_cell(grid, { y: y - 1, x }),
  ]
    .filter(is_defined)
    .filter((cell) => !cell.visited)
    .filter((cell) => cell.height <= height + 1);
}

function get_direction(current_cell: Cell, next_cell: Cell) {
  if (current_cell.position.x < next_cell.position.x) {
    return ">";
  } else if (current_cell.position.y < next_cell.position.y) {
    return "v";
  } else if (current_cell.position.y > next_cell.position.y) {
    return "^";
  }
  return "<";
}

function parse_grid(input: string): Grid {
  return input
    .split("\n")
    .map((line, y) =>
      line.split("").map((letter, x) => to_cell(letter, { x, y }))
    );
}

function traverse(grid: Grid, start_cell: Cell) {
  start_cell.length = 0;
  const queue: Cell[] = [start_cell];
  while (queue.length > 0) {
    const current_cell = queue.shift();
    if (!current_cell) {
      throw new Error("current_cell should not be undefined");
    }

    if (current_cell.visited) {
      continue;
    }

    current_cell.visited = true;

    const cells = get_possible_nearby_cells(grid, current_cell).map(
      (adjacent) => {
        if (
          !adjacent.nearest_cell ||
          current_cell.length + 1 < adjacent.length
        ) {
          adjacent.nearest_cell = current_cell;
          adjacent.length = current_cell.length + 1;
        }
        return adjacent;
      }
    );
    queue.push(...cells);
  }
}

function copy_grid(grid: Grid) {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function first_part(input: string) {
  const grid = parse_grid(input);
  const start_cell = find_cell(grid, (cell) => cell.is_start);
  if (!start_cell) {
    throw new Error("no start cell, weird");
  }

  const end_cell = find_cell(grid, (cell) => cell.is_end);
  if (!end_cell) {
    throw new Error("no end cell, weird");
  }

  traverse(grid, start_cell);

  print_screen(grid, end_cell);
  console.log("first part:", end_cell?.length);
}

function second_part(input: string) {
  const grid = parse_grid(input);

  const shortest = grid
    .flat()
    .filter((cell) => cell.height === 0)
    .reduce((acc, cell) => {
      const new_grid = copy_grid(grid);
      const end_cell = find_cell(new_grid, (cell) => cell.is_end);
      if (!end_cell) {
        throw new Error("no end cell, weird");
      }
      traverse(new_grid, cell);
      return end_cell.length !== -1 && acc > end_cell.length
        ? end_cell.length
        : acc;
    }, Infinity);
  console.log("second part:", shortest);
}

function print_screen(grid: Grid, end_cell: Cell) {
  const screen = grid.map((row) =>
    row.map((cell) => String.fromCharCode(lowest + cell.height))
  );

  let current_cell = end_cell.nearest_cell;
  while (current_cell !== undefined) {
    const { x, y } = current_cell.position;
    screen[y][x] = "\x1b[33m" + screen[y][x] + "\x1b[0m";
    current_cell = current_cell.nearest_cell;
  }
  console.log(screen.map((row) => row.join("")).join("\n"));
}

export const run: DayEntryPoint = (input) => {
  first_part(input);
  second_part(input);
};
