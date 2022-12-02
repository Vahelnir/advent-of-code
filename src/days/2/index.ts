import { DayEntryPoint } from "../../types/DayEntryPoint";

type Shape = "rock" | "paper" | "scissors";

const shapes_order: Shape[] = ["rock", "paper", "scissors"];

const shape_to_score: Record<Shape, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

function get_shape_by_offset(shape: Shape, offset: number): Shape {
  const opponent_shape_index = shapes_order.indexOf(shape);
  const max_index = shapes_order.length;
  const next_index = (opponent_shape_index + offset) % max_index;
  const final_index = next_index < 0 ? next_index + max_index : next_index;
  return shapes_order[final_index];
}

function get_winning_shape(opponent_shape: Shape) {
  return get_shape_by_offset(opponent_shape, 1);
}

function get_losing_shape(opponent_shape: Shape) {
  return get_shape_by_offset(opponent_shape, -1);
}

function transform_letter_to_shape(letter: string): Shape {
  if (letter === "A" || letter === "X") {
    return "rock";
  }

  if (letter === "B" || letter === "Y") {
    return "paper";
  }

  return "scissors";
}

function run_round(opponent: Shape, me: Shape): number {
  if (opponent === me) {
    return 3;
  }

  if (me === get_winning_shape(opponent)) {
    return 6;
  }

  return 0;
}

function get_shape_from_opponent_and_expected_result(
  opponent: Shape,
  expected_result: string
) {
  if (expected_result === "Z") {
    return get_winning_shape(opponent);
  }
  if (expected_result === "Y") {
    return opponent;
  }
  return get_losing_shape(opponent);
}

function get_score_from_expected_result(expected_result: string) {
  if (expected_result === "X") {
    return 0;
  }

  if (expected_result === "Y") {
    return 3;
  }

  return 6;
}

function first_part(rounds: string[]) {
  let total_score = 0;
  for (const round of rounds) {
    const [first, second] = round.split(" ").map(transform_letter_to_shape);
    const round_score = run_round(first, second) + shape_to_score[second];
    total_score += round_score;
  }
  console.log("first result:", total_score);
}

function second_part(rounds: string[]) {
  let total_score = 0;
  for (const round of rounds) {
    const [raw_opponent_choice, expected_result] = round.split(" ");

    const opponent_choice = transform_letter_to_shape(raw_opponent_choice);
    const me_choice = get_shape_from_opponent_and_expected_result(
      opponent_choice,
      expected_result
    );
    const round_score =
      get_score_from_expected_result(expected_result) +
      shape_to_score[me_choice];
    total_score += round_score;
  }
  console.log("second result:", total_score);
}

export const run: DayEntryPoint = (input) => {
  const rounds = input.split("\n");
  first_part([...rounds]);
  second_part([...rounds]);
};
