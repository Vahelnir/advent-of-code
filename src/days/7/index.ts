import { DayEntryPoint } from "../../types/DayEntryPoint";

type Hand = {
  hand: string;
  bid: number;
  power: number;
  cardPowers: number[];
};
type ValidCard = (typeof VALID_CARDS)[number];

const VALID_CARDS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
] as const;

const JOKER_VALID_CARDS = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
] as const;

const getCardPower = (card: string, useJoker = false) => {
  if (card.length !== 1) {
    throw new Error(`card '${card}' has more than one character`);
  }

  const power = (useJoker ? JOKER_VALID_CARDS : VALID_CARDS).indexOf(
    card as ValidCard,
  );
  if (power === -1) {
    throw new Error(`card '${card}' is invalid`);
  }

  return power;
};

const getHandPower = (hand: string, useJoker = false) => {
  const defaultOccurrenceMap = VALID_CARDS.reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {} as Record<ValidCard, number>,
  );
  const occurrenceMap = hand
    .split("")
    .reduce(
      (map, card) => ({ ...map, [card]: map[card as ValidCard] + 1 }),
      defaultOccurrenceMap,
    );

  let jokerCount = 0;
  if (useJoker) {
    jokerCount = occurrenceMap["J"];
    occurrenceMap["J"] = 0;
  }

  const occurrences = Object.values(occurrenceMap).sort((a, b) => b - a);
  occurrences[0] += jokerCount;
  const maxCardCount = occurrences[0];

  if (occurrences.includes(3) && occurrences.includes(2)) {
    return 4;
  }

  if (maxCardCount >= 3) {
    return maxCardCount > 3 ? maxCardCount + 1 : maxCardCount;
  }

  return occurrences.filter((occurrence) => occurrence === 2).length;
};

const sortHands = (a: Hand, b: Hand) => {
  if (a.power !== b.power) {
    return a.power - b.power;
  }

  for (let i = 0; i < 5; i++) {
    const aCardPower = a.cardPowers[i];
    const bCardPower = b.cardPowers[i];
    if (aCardPower !== bCardPower) {
      return aCardPower - bCardPower;
    }
  }
  return 0;
};

export const run: DayEntryPoint = (input) => {
  const hands = input.split("\n").map((rawHand) => {
    const [hand, bid] = rawHand.split(" ");
    const splitHand = hand.split("");
    return {
      hand,
      bid: Number(bid),
      power: getHandPower(hand),
      cardPowers: splitHand.map((card) => getCardPower(card)),
    } satisfies Hand;
  });

  const sortedHands = hands.slice().sort(sortHands);
  console.log(
    "first",
    sortedHands.reduce((sum, value, index) => sum + value.bid * (index + 1), 0),
  );

  const jokerHands = input.split("\n").map((rawHand) => {
    const [hand, bid] = rawHand.split(" ");
    const splitHand = hand.split("");
    return {
      hand,
      bid: Number(bid),
      power: getHandPower(hand, true),
      cardPowers: splitHand.map((card) => getCardPower(card, true)),
    } satisfies Hand;
  });

  const secondSortedHands = jokerHands.slice().sort(sortHands);
  console.log(
    "second",
    secondSortedHands.reduce(
      (sum, value, index) => sum + value.bid * (index + 1),
      0,
    ),
  );
};
