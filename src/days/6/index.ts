import { DayEntryPoint } from "../../types/DayEntryPoint";

function find_start_of_message_marker(input: string, marker_length: number) {
  let found_letters: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    const found_char_index = found_letters.indexOf(char);
    if (found_char_index > -1) {
      found_letters.splice(0, found_char_index + 1);
    }

    found_letters.push(char);

    if (found_letters.length === marker_length) {
      console.log("result:", found_letters.join(""), i + 1);
      break;
    }
  }
}

export const run: DayEntryPoint = (input) => {
  find_start_of_message_marker(input, 4);
  find_start_of_message_marker(input, 14);
};
