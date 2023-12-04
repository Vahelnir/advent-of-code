import { DayEntryPoint } from "../../types/DayEntryPoint";

const solveFirst = (cardSets: [string[], string[]][]) => {
  let points = 0;
  for (const [winning, possessed] of cardSets) {
    const roundResult = winning.reduce((acc, card) => {
      const hasWon = possessed.includes(card);
      if (!hasWon) {
        return acc;
      }
      if (acc === 0) {
        return 1;
      }
      return acc * 2;
    }, 0);

    const matchingCount = winning.reduce((acc, card) =>
      possessed.includes(card) ? acc + 1 : acc
    );
    points += roundResult;
  }
  return points;
};

const solveSecond = (cardSets: [string[], string[]][]) => {
  const newCardSets = cardSets.map(([winning, possessed]) => ({
    winning,
    possessed,
    count: 1,
  }));

  const withResult = newCardSets.map(({ winning, possessed, count }, index) => {
    const roundResult = winning.filter((card) =>
      possessed.includes(card)
    ).length;
    console.log(index, roundResult);

    if (roundResult > 0) {
      newCardSets
        .slice(index + 1, index + roundResult + 1)
        .forEach((round) => (round.count += count));
    }
    return { winning, possessed, count, matching: roundResult };
  });

  return withResult.reduce((acc, rounds) => acc + rounds.count, 0);
};

export const run: DayEntryPoint = (input) => {
  const cardSets = input.split("\n").map((line): [string[], string[]] => {
    const [winning, possessed] = line
      .replace(/Card \d:/, "")
      .split("|")
      .map((cards) =>
        cards
          .trim()
          .split(" ")
          .filter((card) => card !== "")
      );
    return [winning, possessed];
  });

  console.log("first", solveFirst(cardSets));
  console.log("second", solveSecond(cardSets));
};
