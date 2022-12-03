import { type } from "os";
import { DayEntryPoint } from "../../types/DayEntryPoint";

const types = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "q",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "Q",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;
type RawType = typeof types[number];

const item_priorities = types.reduce((acc, value, index) => {
  acc[value] = index + 1;
  return acc;
}, {} as Record<RawType, number>);

function get_type_in_common(
  first_compartment: RawType[],
  second_compartment: RawType[]
) {
  return first_compartment.filter((type) =>
    second_compartment.includes(type)
  )[0];
}

function string_to_raw_types(str: string) {
  return str.split("").map((letter) => letter as RawType);
}

export const run: DayEntryPoint = (input) => {
  const bags = input.split("\n");
  let total_priorities = 0;
  for (const bag_as_string of bags) {
    const bag = string_to_raw_types(bag_as_string);
    const bag_half = bag.length / 2;
    const first_compartment = bag.slice(0, bag_half);
    const second_compartment = bag.slice(bag.length / 2);
    const type_in_common = get_type_in_common(
      first_compartment,
      second_compartment
    );
    total_priorities += item_priorities[type_in_common];
  }
  console.log("first result:", total_priorities);

  total_priorities = 0;
  for (let i = 0; i < bags.length / 3; i++) {
    const [first, second, third] = bags
      .slice(i * 3, i * 3 + 3)
      .map(string_to_raw_types);
    const type_in_common = first.filter(
      (letter) => second.includes(letter) && third.includes(letter)
    )[0];
    console.log(first, second, third);
    total_priorities += item_priorities[type_in_common];
  }
  console.log("second result:", total_priorities);
};
