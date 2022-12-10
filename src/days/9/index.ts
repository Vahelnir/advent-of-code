import { DayEntryPoint } from "../../types/DayEntryPoint";

const directions = ["R", "L", "U", "D"];
type Direction = "R" | "L" | "U" | "D";

type Position = {
  x: number;
  y: number;
};

type State = {
  positions: Position[];
  tail_visited_position: Position[];
};

const ROPE_SIZE = 10;

function is_direction(str: string): str is Direction {
  return directions.includes(str);
}

function get_movement_instruction(line: string): [Direction, number] {
  const [raw_direction, raw_count] = line.split(" ");
  if (!is_direction(raw_direction)) {
    throw new Error("direction is not valid");
  }
  return [raw_direction, +raw_count];
}

function move({ x, y }: Position, direction: Direction): Position {
  let offset_x = 0;
  let offset_y = 0;
  switch (direction) {
    case "D":
      offset_y--;
      break;
    case "U":
      offset_y++;
      break;
    case "L":
      offset_x--;
      break;
    case "R":
      offset_x++;
      break;
  }
  // console.log(direction, x, y, offset_x, offset_y);
  return { x: x + offset_x, y: y + offset_y };
}

function tick(state: State, direction: Direction): State {
  const { positions, tail_visited_position: tail_different_position } = state;

  const [head_position, ...rest_positions] = positions;
  const new_head_position = move(head_position, direction);

  let previous_position = head_position;
  let previous_new_position = new_head_position;
  let new_rest_positions = [];
  for (let i = 0; i < rest_positions.length; i++) {
    const current_position = rest_positions[i];
    let new_current_position = current_position;
    if (
      are_position_equal(previous_position, current_position) ||
      are_position_equal(previous_new_position, current_position)
    ) {
      new_current_position = current_position;
    } else if (
      !are_position_adjacent(previous_new_position, current_position) &&
      !are_position_diagonal(previous_new_position, current_position)
    ) {
      new_current_position = previous_position;
    }

    previous_position = current_position;
    previous_new_position = new_current_position;
    new_rest_positions.push(new_current_position);
  }

  const new_positions = [new_head_position, ...new_rest_positions];

  return {
    tail_visited_position: !are_position_equal(
      positions[ROPE_SIZE - 1],
      new_positions[ROPE_SIZE - 1]
    )
      ? [...tail_different_position, new_positions[ROPE_SIZE - 1]]
      : tail_different_position,
    positions: new_positions,
  };
}

function are_position_equal(pos_a: Position, pos_b: Position) {
  return pos_a.x === pos_b.x && pos_a.y === pos_b.y;
}

function are_position_adjacent(pos_a: Position, pos_b: Position) {
  return (
    are_position_equal(pos_a, { ...pos_b, x: pos_b.x + 1 }) ||
    are_position_equal(pos_a, { ...pos_b, x: pos_b.x - 1 }) ||
    are_position_equal(pos_a, { ...pos_b, y: pos_b.y + 1 }) ||
    are_position_equal(pos_a, { ...pos_b, y: pos_b.y - 1 })
  );
}

function are_position_diagonal(pos_a: Position, pos_b: Position) {
  return (
    are_position_equal(pos_a, { y: pos_b.y + 1, x: pos_b.x + 1 }) ||
    are_position_equal(pos_a, { y: pos_b.y - 1, x: pos_b.x + 1 }) ||
    are_position_equal(pos_a, { y: pos_b.y - 1, x: pos_b.x - 1 }) ||
    are_position_equal(pos_a, { y: pos_b.y + 1, x: pos_b.x - 1 })
  );
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");

  const default_position = { x: 0, y: 0 };
  let state: State = {
    positions: Array(ROPE_SIZE).fill(default_position),
    tail_visited_position: [default_position],
  };

  let current_tick = 0;
  let max_x = 0;
  let max_y = 0;
  let min_x = 0;
  let min_y = 0;
  for (const line of lines) {
    const [direction, amount] = get_movement_instruction(line);
    console.log(direction, amount);
    for (let i = 0; i < amount; i++) {
      state = tick(state, direction);
      draw_grid_with_rope(state.positions, 5, 4, 0, 0);
      console.log("");

      const head_position = state.positions[0];
      if (max_x < head_position.x) {
        max_x = head_position.x;
      }
      if (max_y < head_position.y) {
        max_y = head_position.y;
      }
      if (min_x > head_position.x) {
        min_x = head_position.x;
      }
      if (min_y > head_position.y) {
        min_y = head_position.y;
      }
      current_tick++;
    }
  }

  console.log(
    state.tail_visited_position.filter(
      (pos, i) =>
        state.tail_visited_position.findIndex(
          ({ x, y }) => x === pos.x && y === pos.y
        ) === i
    ).length
  );

  const offset_x = Math.abs(min_x);
  const offset_y = Math.abs(min_y);
  console.log(max_x, max_y, offset_x, offset_y);
  draw_visited_grid(
    state.tail_visited_position,
    max_x,
    max_y,
    offset_x,
    offset_y
  );
};

function draw_visited_grid(
  tail_visited_position: Position[],
  max_x: number,
  max_y: number,
  offset_x: number,
  offset_y: number
) {
  const grid = Array(max_y + 1 + offset_y)
    .fill(".")
    .map(() => Array(max_x + 1 + offset_x).fill("."));
  for (const { x, y } of tail_visited_position) {
    grid[y + offset_y][x + offset_x] = "#";
  }
  console.log(
    grid
      .map((row) => row.join(""))
      .reverse()
      .join("\n")
  );
}

function draw_grid_with_rope(
  rope_positions: Position[],
  max_x: number,
  max_y: number,
  offset_x: number,
  offset_y: number
) {
  const grid = Array(max_y + 1 + offset_y)
    .fill(".")
    .map(() => Array(max_x + 1 + offset_x).fill("."));
  for (let i = 0; i < rope_positions.length; i++) {
    const { x, y } = rope_positions[i];
    if (grid[y + offset_y][x + offset_x] !== ".") {
      continue;
    }
    grid[y + offset_y][x + offset_x] = i === 0 ? "H" : i;
  }
  console.log(
    grid
      .map((row) => row.join(""))
      .reverse()
      .join("\n")
  );
}
