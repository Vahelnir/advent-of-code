import { DayEntryPoint } from "../../types/DayEntryPoint";

type Lens = { focalLength: number; label: string };

const getHash = (sequence: string) => {
  return [...sequence].reduce(
    (acc, v) => ((acc + v.charCodeAt(0)) * 17) % 256,
    0,
  );
};

const solveSecond = (sequences: string[]) => {
  const map = new Map<number, Lens[]>();
  for (const sequence of sequences) {
    const dashIndex = sequence.indexOf("-");
    if (sequence.includes("-")) {
      const label = sequence.slice(0, dashIndex);
      const hash = getHash(label);
      const boxLens = map.get(hash) ?? [];
      map.set(
        hash,
        boxLens.filter((lens) => lens.label !== label),
      );
      continue;
    }

    const equalIndex = sequence.indexOf("=");
    const label = sequence.slice(0, equalIndex);
    const hash = getHash(label);
    const boxLens = map.get(hash) ?? [];
    const focalLength = Number(sequence.slice(equalIndex + 1));

    const existingIndex = boxLens.findIndex((lens) => lens.label === label);
    if (existingIndex > -1) {
      const boxLensCopy = boxLens.slice();
      boxLensCopy.splice(existingIndex, 1, { label, focalLength });
      map.set(hash, boxLensCopy);
    } else {
      map.set(hash, [...boxLens, { label, focalLength }]);
    }
  }

  const lensFocalStrength = (hash: number, lenses: Lens[]) =>
    lenses.reduce(
      (acc, value, index) => acc + (hash + 1) * (index + 1) * value.focalLength,
      0,
    );

  return [...map.entries()].reduce(
    (acc, [hash, lenses]) =>
      lenses.length > 0 ? acc + lensFocalStrength(hash, lenses) : acc,
    0,
  );
};

export const run: DayEntryPoint = (input) => {
  const sequences = input.split(",");
  const sum = sequences.reduce((sum, sequence) => sum + getHash(sequence), 0);

  console.log("first", sum);
  console.log("second", solveSecond(sequences));
};
