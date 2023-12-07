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

const getCardPower = (card: string) => {
  if (card.length !== 1) {
    throw new Error(`card '${card}' has more than one character`);
  }

  const power = VALID_CARDS.indexOf(card as ValidCard);
  if (power === -1) {
    throw new Error(`card '${card}' is invalid`);
  }

  return power;
};

const getHandPower = (hand: string) => {
  const defaultOccurrenceMap = VALID_CARDS.reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {} as Record<ValidCard, number>,
  );
  const occurrenceMap = [...hand].reduce(
    (map, card) => ({ ...map, [card]: map[card as ValidCard] + 1 }),
    defaultOccurrenceMap,
  );

  const occurrences = Object.values(occurrenceMap);
  if (occurrences.includes(3) && occurrences.includes(2)) {
    return 4;
  }

  const maxPair = Math.max(...occurrences);
  if (maxPair >= 3) {
    return maxPair > 3 ? maxPair + 1 : maxPair;
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
    return {
      hand,
      bid: Number(bid),
      power: getHandPower(hand),
      cardPowers: hand.split("").map(getCardPower),
    } satisfies Hand;
  });

  const sortedHands = hands.slice().sort(sortHands);
  console.log(
    sortedHands.map(({ hand, power }, index) => [index, hand, power]),
  );

  console.log(
    "first",
    sortedHands.reduce((sum, value, index) => sum + value.bid * (index + 1), 0),
  );
};
