import { DayEntryPoint } from "../../types/DayEntryPoint";

const DEBUG = false;

const parsePacket = (rawPacket: string) => JSON.parse(rawPacket);

const compareValues = (
  left: number | unknown[],
  right: number | unknown[],
  nested = 0
): 1 | 0 | -1 => {
  const debug = (text: string, extraTab = 0) =>
    DEBUG && console.log(" ".repeat(nested + extraTab) + text);

  debug(`- Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);

  if (left instanceof Array && right instanceof Array) {
    for (let i = 0; i < left.length; i++) {
      const newLeft = left[i] as number | unknown[];
      const newRight = right[i] as number | unknown[];
      if (newRight === undefined) {
        break;
      }

      const comparison = compareValues(newLeft, newRight, nested + 1);
      if (comparison !== 0) {
        return comparison;
      }
    }

    if (left.length === right.length) {
      return 0;
    }
    debug(
      left.length < right.length
        ? "- Left side ran out of items, so inputs are in the right order"
        : "- Right side ran out of items, so inputs are not in the right order",
      2
    );
    return left.length < right.length ? 1 : -1;
  }

  if (typeof left === "number" && typeof right === "number") {
    if (left === right) {
      return 0;
    }
    debug(
      left < right
        ? "- Left side is smaller, so inputs are in the right order"
        : "- Right side is smaller, so inputs are not in the right order",
      2
    );
    return left < right ? 1 : -1;
  }

  if (typeof left === "number") {
    debug(`- Mixed types; convert left to [${left}] and retry comparison`, 2);
    return compareValues([left], right, nested + 1);
  }

  debug(`- Mixed types; convert right to [${right}] and retry comparison`, 2);
  return compareValues(left, [right], nested + 1);
};

export const run: DayEntryPoint = (input) => {
  const rawBlocks = input.split("\n\n");
  const blocks = rawBlocks.map((block, index) => {
    console.log(`== Pair ${index + 1} == `);
    const [rawFirst, rawSecond] = block.split("\n");
    const left = parsePacket(rawFirst);
    const right = parsePacket(rawSecond);
    return [left, right];
  });

  console.log(
    "first",
    blocks
      .map(([left, right], index) => {
        const isOrdered = compareValues(left, right) === 1;
        console.log();
        return { index: index + 1, isOrdered };
      })
      .filter(({ isOrdered }) => isOrdered)
      .reduce((acc, { index }) => acc + index, 0)
  );

  const orderedPackets = [...blocks.flat(), [[2]], [[6]]]
    .sort((a, b) => compareValues(b, a))
    .map((value) => JSON.stringify(value))
    .map((packet, index): [string, number] => [packet, index]);
  console.log(
    "second",
    ((orderedPackets.find(([packet]) => packet === "[[2]]")?.[1] ?? -1) + 1) *
      ((orderedPackets.find(([packet]) => packet === "[[6]]")?.[1] ?? -1) + 1)
  );
};
