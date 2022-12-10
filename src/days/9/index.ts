import { DayEntryPoint } from "../../types/DayEntryPoint";

const directions = ["R", "L", "U", "D"];
type Direction = "R" | "L" | "U" | "D";

type Position = {
  x: number;
  y: number;
};

type State = {
  head_position: Position;
  tail_position: Position;
  tail_visited_position: Position[];
};

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
  const {
    head_position,
    tail_position,
    tail_visited_position: tail_different_position,
  } = state;

  const new_head_position = move(head_position, direction);

  let new_tail_position = tail_position;
  if (
    are_position_equal(head_position, tail_position) ||
    are_position_equal(new_head_position, tail_position)
  ) {
    new_tail_position = tail_position;
  } else if (
    !are_position_adjacent(new_head_position, tail_position) &&
    !are_position_diagonal(new_head_position, tail_position)
  ) {
    new_tail_position = head_position;
  }

  return {
    tail_visited_position: !are_position_equal(tail_position, new_tail_position)
      ? [...tail_different_position, new_tail_position]
      : tail_different_position,
    head_position: new_head_position,
    tail_position: new_tail_position,
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
    head_position: default_position,
    tail_position: default_position,
    tail_visited_position: [default_position],
  };

  let current_tick = 0;
  let max_x = 0;
  let max_y = 0;
  for (const line of lines) {
    const [direction, amount] = get_movement_instruction(line);
    for (let i = 0; i < amount; i++) {
      state = tick(state, direction);

      // console.log(
      //   direction,
      //   current_tick,
      //   state.tail_position,
      //   state.head_position
      // );

      // if (max_x < state.head_position.x) {
      //   max_x = state.head_position.x;
      // }
      // if (max_y < state.head_position.y) {
      //   max_y = state.head_position.y;
      // }
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

  // console.log(max_x, max_y);
  // const grid = Array(max_y + 1)
  //   .fill(".")
  //   .map(() => Array(max_x + 1).fill("."));
  // for (const { x, y } of state.tail_visited_position) {
  //   console.log(x, y);
  //   grid[y][x] = "#";
  // }
  // console.log(
  //   grid
  //     .map((row) => row.join(""))
  //     .reverse()
  //     .join("\n")
  // );
};
