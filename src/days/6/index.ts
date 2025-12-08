import type { DayEntryPoint } from "../../types/DayEntryPoint";

function parseOperators(line: string) {
  const operators: string[] = [];
  const regex = /(?:\+|\*)(?:\s+)/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    operators.push(match[0]!);
  }
  return operators.map((op, index) => ({
    columnSize: index === operators.length - 1 ? op.length : op.length - 1,
    operator: op.trim(),
  }));
}

export const run: DayEntryPoint = async (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);

  const columnData = parseOperators(lines[lines.length - 1]!);
  const rows: string[][] = [];
  for (let x = 0; x < lines.length - 1; x++) {
    const row = [];
    let y = 0;
    for (let i = 0; i < columnData.length; i++) {
      const expectedSpaces = columnData[i]!.columnSize;
      const actualSpaces = lines[x]!.slice(y, y + expectedSpaces);
      row.push(actualSpaces.replaceAll(" ", "0"));
      y += expectedSpaces + 1;
    }
    rows.push(row);
  }
  const operators = columnData.map((c) => c.operator);

  let total = 0;
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i]!;
    console.log(operator);
    let acc = 0;
    if (operator === "+") {
      for (const row of rows) {
        console.log(row[i]);
        acc += Number(row[i]);
      }
    } else if (operator === "*") {
      acc = 1;
      for (const row of rows) {
        acc *= Number(row[i]);
      }
    }
    console.log("column total:", acc, operator);
    total += acc;
  }

  console.log("part 1:", total);

  const columns: string[][] = [];
  for (let x = 0; x < rows[0]!.length; x++) {
    let values: string[] = [];
    for (let y = 0; y < rows.length; y++) {
      values.push(rows[y]![x]!);
    }
    columns.push(values);
  }

  const aaa = [];
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i]!;
    const maxLength = col.reduce(
      (acc, v) => (v.length > acc ? v.length : acc),
      0,
    );
    const operator = operators[i]!;

    let accumulator = operator === "+" ? 0 : 1;
    const valueList: number[] = [];
    for (let i = 0; i < maxLength; i++) {
      const char = col
        .map((v) => v.at(i))
        .filter((v) => v && v !== "0")
        .join("");
      const value = Number(char);
      accumulator =
        operator === "+" ? accumulator + value : accumulator * value;
      valueList.push(value);
    }
    console.log("--_", operator, col, valueList, "_--");
    aaa.push(accumulator);
  }

  console.log(
    "part 2:",
    aaa.reduce((acc, v) => acc + v, 0),
  );
  // tested wrong answers: 11505532772069, 11448320285833
};
