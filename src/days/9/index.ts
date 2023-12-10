import { DayEntryPoint } from "../../types/DayEntryPoint";

const toNumber = (value: string) => Number(value);

const calculateExtrapolationSequence = (sequence: number[]) => {
  const extrapolated: number[] = [];
  for (let i = 1; i < sequence.length; i++) {
    const previousNumber = sequence[i - 1];
    const currentNumber = sequence[i];
    extrapolated.push(currentNumber - previousNumber);
  }

  return extrapolated;
};

const solveFirst = (histories: number[][], from: "start" | "end") => {
  const newHistories = histories.map((history) => history.slice());
  for (const history of newHistories) {
    const sequences: number[][] = [history];
    let previousSequence = history;
    while (!previousSequence.every((item) => item === 0)) {
      const newSequence = calculateExtrapolationSequence(previousSequence);
      sequences.push(newSequence);

      previousSequence = newSequence;
    }

    const addedNumbers = [0];
    for (let i = sequences.length - 2; i >= 0; i--) {
      const sequence = sequences[i];
      const addedNumber =
        from === "start"
          ? sequence[sequence.length - 1] +
            addedNumbers[addedNumbers.length - 1]
          : sequence[0] - addedNumbers[addedNumbers.length - 1];
      addedNumbers.push(addedNumber);
    }
    console.log(addedNumbers);

    const interpolatedValue = addedNumbers[addedNumbers.length - 1];
    if (from === "start") {
      history.push(interpolatedValue);
    } else {
      history.unshift(interpolatedValue);
    }
  }
  return newHistories.reduce((acc, history) => history[0] + acc, 0);
};

export const run: DayEntryPoint = (input) => {
  const histories = input
    .split("\n")
    .map((line) => line.split(" ").map(toNumber));

  // console.log("first", solveFirst(histories, "start"));
  console.log("second", solveFirst(histories, "end"));
};
