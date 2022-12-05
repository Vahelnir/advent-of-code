import { DayEntryPoint } from "../../types/DayEntryPoint";

function parse_crates(lines: string[]) {
  const empty_line_pos = lines.indexOf("");
  const column_line = lines[empty_line_pos - 1];
  const column_count = column_line.split("   ").length;
  const crates: string[][] = Array(column_count)
    .fill(0)
    .map(() => []);

  const crates_to_parse = lines.slice(0, empty_line_pos - 1);
  for (let i = crates_to_parse.length - 1; i >= 0; i--) {
    const line = crates_to_parse[i];
    for (let y = 0; y < line.length / 4; y++) {
      const crate = line[y * 4 + 1];
      if (crate.trim().length === 0) continue;

      crates[y].push(crate);
    }
  }
  return { crates, empty_line_pos };
}

function extract_instructions(line: string) {
  const [, count, , from, , to] = line.split(" ");
  return { count: +count, from: +from, to: +to };
}

function run_part(lines: string[], with_reverse: boolean) {
  const { crates, empty_line_pos } = parse_crates(lines);
  // first part
  for (const instruction of lines.slice(empty_line_pos + 1)) {
    const { count, from, to } = extract_instructions(instruction);
    const to_move = crates[from - 1].splice(-count, count);
    if (with_reverse) {
      to_move.reverse();
    }
    crates[to - 1].push(...to_move);
  }
  const res = crates.reduce(
    (acc, crate_column) => acc + crate_column[crate_column.length - 1],
    ""
  );
  console.log("result:", res);
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");

  run_part(lines, true);
  run_part(lines, false);
};
