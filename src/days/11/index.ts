import { DayEntryPoint } from "../../types/DayEntryPoint";

const times: number[] = [];

function blink(stones: number[]) {
  for (let index = 0; index < stones.length; index++) {
    const stone = stones[index];
    if (stone === 0) {
      stones[index] = 1;
      continue;
    }

    const digitCount = Math.floor(Math.log10(stone) + 1);
    if (digitCount % 2 === 0) {
      const start = performance.now();
      const halfDigit = digitCount / 2;
      stones[index] = stone % 10 ** halfDigit;
      stones.splice(index, 0, Math.floor(stone / 10 ** halfDigit));
      index++;
      times.push(performance.now() - start);
      if (times.length > 10) {
        times.shift();
      }
      continue;
    }

    stones[index] = stone * 2024;
  }
}

export const run: DayEntryPoint = (input) => {
  const stones = input.split(" ").map(Number);
  for (let index = 0; index < stones.length; index++) {
    let currentStones = [stones[index]];
    for (let tick = 0; tick < 75; tick++) {
      blink(currentStones);
      if (index === 0) {
        console.log(tick, currentStones.length);
      }
    }
  }

  console.log(stones.length);
};
