import { DayEntryPoint } from "../../types/DayEntryPoint";

export type Elf = { calories: number[]; total_calories: number };

export const run: DayEntryPoint = (input) => {
  const calories = input.split("\n");
  const elves: Elf[] = [];

  let elf_index = 0;
  for (const str_calory of calories) {
    if (str_calory.length === 0) {
      elf_index++;
      continue;
    }

    const calory = +str_calory;
    let current_elf = elves[elf_index];
    if (!current_elf) {
      current_elf = { calories: [calory], total_calories: calory };
      elves.push(current_elf);
    } else {
      current_elf.calories.push(calory);
      current_elf.total_calories += calory;
    }
  }

  const [first, second, third] = elves.sort(
    (elfA, elfB) => elfB.total_calories - elfA.total_calories
  );

  console.log("the first answer is", first.total_calories);
  console.log(
    "the second answer is",
    first.total_calories + second.total_calories + third.total_calories
  );
};
