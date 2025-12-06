import type { DayEntryPoint } from "../../types/DayEntryPoint";

export const run: DayEntryPoint = async (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);

  const rows = lines.slice(0, lines.length - 1).map((line) =>
    line
      .split(/ +/)
      .filter((s) => s.trim().length > 0)
      .map(Number),
  );
  const operators = lines[lines.length - 1]!.split(/ +/).filter(
    (s) => s.trim().length > 0,
  );

  let total = 0;
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i]!;
    console.log(operator);
    let acc = 0;
    if (operator === "+") {
      for (const row of rows) {
        console.log(row[i]);
        acc += row[i]!;
      }
    } else if (operator === "*") {
      acc = 1;
      for (const row of rows) {
        acc *= row[i]!;
      }
    }
    console.log("column total:", acc, operator);
    total += acc;
  }

  console.log("part 1:", total);
};
