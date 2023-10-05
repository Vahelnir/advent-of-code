import { DayEntryPoint } from "../../types/DayEntryPoint";

type ArrayValue = { parent?: ArrayValue; content: Value[]; type: "array" };
type NumberValue = { parent?: ArrayValue; content: number; type: "number" };
type Value = ArrayValue | NumberValue;

type DeepArray<T> = (T | DeepArray<T>)[];

function parse_array(block: string) {
  let previous_array: ArrayValue | undefined;
  for (const letter of block) {
    if (letter === "[") {
      const arr: Value = {
        parent: previous_array,
        content: [],
        type: "array",
      };
      previous_array?.content.push(arr);
      previous_array = arr;
    } else if (letter === "]") {
      if (!previous_array?.parent) {
        continue;
      }
      previous_array = previous_array.parent;
    } else if (letter === ",") {
      continue;
    } else {
      previous_array?.content.push({
        type: "number",
        parent: previous_array,
        content: +letter,
      });
    }
  }
  if (!previous_array) {
    return undefined;
  }

  return unwrap_value(previous_array) as DeepArray<number>;
}

function unwrap_value(value: Value): number | DeepArray<number> {
  if (value.type === "array") {
    return value.content.map(unwrap_value);
  }
  return value.content;
}

function is_in_order(
  left: DeepArray<number>,
  right: DeepArray<number>,
  converted_to_array = false
): boolean {
  for (let i = 0; i < (converted_to_array ? 1 : left.length); i++) {
    let left_value = left[i];
    let right_value = right[i];
    let converted_to_array = false;

    if (left_value && !right_value) {
      console.log("right is undefined, left =", left_value);
      if (left.length > right.length) {
        return false;
      }

      return true;
    }

    if (typeof left_value !== typeof right_value) {
      if (typeof left_value === "number") {
        left_value = [left_value];
      } else {
        right_value = [right_value];
      }
      converted_to_array = true;
    }

    if (left_value instanceof Array && right_value instanceof Array) {
      const order = is_in_order(left_value, right_value, converted_to_array);
      if (!order) {
        return false;
      }
    }
    if (left_value > right_value) {
      console.log(
        `left (${left_value}) value bigger than right (${right_value}) value`
      );
      return false;
    }
    // console.log("val", left[i], right[i]);
  }
  return true;
}

export const run: DayEntryPoint = (input) => {
  const blocks = input.split("\n\n").map((block) => block.split("\n"));

  let pair_index = 1;
  let in_order_pairs: number[] = [];
  for (const block of blocks) {
    const [left, right] = block.map((block) => parse_array(block));
    if (!left || !right) {
      console.log("skipping...");
      continue;
    }
    console.log(left, right);
    const in_order = is_in_order(left, right);
    if (in_order) {
      in_order_pairs.push(pair_index);
    }
    pair_index++;
    console.log(in_order);
  }
  console.log(
    "first part",
    in_order_pairs,
    in_order_pairs.reduce((sum, val) => sum + val, 0)
  );
};
