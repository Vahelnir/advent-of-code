import { DayEntryPoint } from "../../types/DayEntryPoint";

type BinaryString = "1" | "0";

const invertBinaryArray = (binaryArray: BinaryString[]) =>
  binaryArray.map((bit) => (bit === "1" ? "0" : "1"));

function countOneAndZero(lines: string[], index: number) {
  let oneCount = 0;
  for (let j = 0; j < lines.length; j++) {
    const bit = lines[j][index];
    if (bit === "1") {
      oneCount++;
    }
  }

  const zeroCount = lines.length - oneCount;
  return { one: oneCount, zero: zeroCount };
}

function getGammaAndEpsilonBinaryArray(lines: string[]) {
  const lineLength = lines[0].length;
  const gammaArray = Array.from("0".repeat(lineLength)) as BinaryString[];
  for (let i = 0; i < lineLength; i++) {
    const count = countOneAndZero(lines, i);
    if (count.one > count.zero) {
      gammaArray[i] = "1";
    }
  }

  const gamma = Number.parseInt(gammaArray.join(""), 2);
  const epsilon = Number.parseInt(invertBinaryArray(gammaArray).join(""), 2);
  return { gamma, epsilon };
}

function getOxygenAndCarbonDioxide(lines: string[]) {
  const lineLength = lines[0].length;
  let oxygenFilteredLines = lines;
  let carbonDioxideFilteredLines = lines;
  for (let i = 0; i < lineLength; i++) {
    const oxygenCount = countOneAndZero(oxygenFilteredLines, i);
    const mostCommonBit = oxygenCount.one >= oxygenCount.zero ? "1" : "0";
    if (oxygenFilteredLines.length > 1) {
      oxygenFilteredLines = oxygenFilteredLines.filter(
        (line) => line[i] === mostCommonBit
      );
    }

    const carbonDioxideBitsCount = countOneAndZero(
      carbonDioxideFilteredLines,
      i
    );
    const leastCommonBit =
      carbonDioxideBitsCount.one < carbonDioxideBitsCount.zero ? "1" : "0";
    if (carbonDioxideFilteredLines.length > 1) {
      carbonDioxideFilteredLines = carbonDioxideFilteredLines.filter(
        (line) => line[i] === leastCommonBit
      );
    }
  }

  const oxygen = Number.parseInt(oxygenFilteredLines[0], 2);
  const carbonDioxide = Number.parseInt(carbonDioxideFilteredLines[0], 2);
  return { oxygen, carbonDioxide };
}

function solveFirst(lines: string[]) {
  const { gamma, epsilon } = getGammaAndEpsilonBinaryArray(lines);
  console.log("first:", gamma * epsilon);
}

function solveSecond(lines: string[]) {
  const { carbonDioxide, oxygen } = getOxygenAndCarbonDioxide(lines);
  console.log("second:", oxygen, carbonDioxide, oxygen * carbonDioxide);
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");
  solveFirst([...lines]);
  solveSecond([...lines]);
};
