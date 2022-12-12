import { DayEntryPoint } from "../../types/DayEntryPoint";

type Operation = { operator: string; value: number | "old" };
type ConditionCase = { if: boolean; to_monkey: number };
type Condition = {
  divisible_by: number;
  cases: ConditionCase[];
};
type Monkey = {
  items: number[];
  operation: Operation;
  test: Condition;
  inspected_items: number;
};

function run_round(monkeys: Monkey[], transform: (val: number) => number) {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      monkey.inspected_items++;
      const { operator, value } = monkey.operation;
      let final_number: number = value === "old" ? item : value;
      if (operator === "+") {
        final_number = item + final_number;
      } else {
        final_number = item * final_number;
      }

      final_number = transform(final_number);

      const current_case = monkey.test.cases.find(
        (current_case) =>
          current_case.if === (final_number % monkey.test.divisible_by === 0)
      );
      if (!current_case) {
        throw new Error("lol should not happen");
      }

      monkeys[current_case.to_monkey].items.push(final_number);
    }
    monkey.items = [];
  }
}

function parse_monkeys(lines: string[]) {
  const monkeys: Monkey[] = [];
  let last_monkey: Monkey | undefined = undefined;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("Monkey")) {
      last_monkey = {
        items: [],
        operation: { operator: "", value: 0 },
        test: { divisible_by: 0, cases: [] },
        inspected_items: 0,
      };
      monkeys.push(last_monkey);
      continue;
    }

    if (!last_monkey) {
      continue;
    }

    const [type, value] = line.split(":").map((val) => val.trim());
    if (type.startsWith("Starting items")) {
      last_monkey.items = value.split(", ").map((val) => +val);
      continue;
    }

    if (type.startsWith("Operation")) {
      const [, , , operator, operation_value] = value.split(" ");
      last_monkey.operation = {
        operator,
        value: operation_value === "old" ? operation_value : +operation_value,
      };
      continue;
    }

    if (type.startsWith("Test")) {
      const t = value.split(" ");
      const divisible_by = +t[2];

      last_monkey.test = { divisible_by, cases: [] };
      continue;
    }

    if (type.startsWith("If")) {
      const split_type = type.split(" ");
      const split_value = value.split(" ");
      const to_monkey = +split_value[3];
      last_monkey.test.cases.push({ if: split_type[1] === "true", to_monkey });
      continue;
    }
  }
  return monkeys;
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");

  {
    const monkeys = parse_monkeys(lines);
    const twenty_rounds_monkeys = [...monkeys];
    for (let i = 0; i < 20; i++) {
      run_round(twenty_rounds_monkeys, (val) => Math.floor(val / 3));
    }

    const sorted_monkeys = [...twenty_rounds_monkeys].sort(
      (a, b) => b.inspected_items - a.inspected_items
    );
    const [first, second] = sorted_monkeys;
    console.log(sorted_monkeys);
    console.log(
      "first part:",
      first.inspected_items,
      second.inspected_items,
      first.inspected_items * second.inspected_items
    );
  }

  {
    const monkeys = parse_monkeys(lines);
    const modulo = monkeys
      .map((monkey) => monkey.test.divisible_by)
      .reduce((acc, value) => acc * value, 1);
    console.log("modulo:", modulo);
    const ten_thousands_rounds_monkeys = [...monkeys];
    for (let round = 0; round < 10000; round++) {
      if (
        [1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000].includes(
          round
        )
      ) {
        monkeys.forEach((monkey, monkey_index) =>
          console.log(
            `round ${round}, monkey ${monkey_index} has ${monkey.inspected_items} inspected items`
          )
        );
      }
      run_round(ten_thousands_rounds_monkeys, (val) => val % modulo);
    }

    const sorted_monkeys = [...ten_thousands_rounds_monkeys].sort(
      (a, b) => b.inspected_items - a.inspected_items
    );
    const [first, second] = sorted_monkeys;
    console.log(sorted_monkeys);
    console.log(
      "second part:",
      first.inspected_items,
      second.inspected_items,
      first.inspected_items * second.inspected_items
    );
  }
};
