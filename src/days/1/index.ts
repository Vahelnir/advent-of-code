import { DayEntryPoint } from "../../types/DayEntryPoint";

export const run: DayEntryPoint = (input) => {
  const calories = input.split("\n");
  const elves: { calories: number[]; total_calories: number }[] = [];

  let elveIndex = 0;
  for (const str_calory of calories) {
    if (str_calory.length === 0) {
      elveIndex++;
      continue;
    }

    const calory = +str_calory;
    let currentElfArray = elves[elveIndex];
    if (!currentElfArray) {
      currentElfArray = { calories: [calory], total_calories: calory };
      elves.push(currentElfArray);
    } else {
      currentElfArray.calories.push(calory);
      currentElfArray.total_calories += calory;
    }
  }

  const [first, second, third] = elves.sort(
    (elfA, elfB) => elfB.total_calories - elfA.total_calories
  );

  console.log("the first answer is", first.total_calories);
  console.log("the second answer is", first.total_calories + second.total_calories + third.total_calories);
};
