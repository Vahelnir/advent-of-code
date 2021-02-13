function processRange(
  text: string,
  range: [number, number],
  { lower, higher }: { lower: string; higher: string }
) {
  for (const letter of text) {
    const [min, max] = range;
    const half = Math.round((max - min) / 2);
    if (letter === lower) {
      range = [min, min + half];
    } else if (letter === higher) {
      range = [min + half, max];
    }
  }
  return range[0];
}

function getRowFromText(textRow: string) {
  return processRange(textRow, [0, 128], { lower: "F", higher: "B" });
}

function getColumnFromText(textColumn: string) {
  return processRange(textColumn, [0, 8], { lower: "L", higher: "R" });
}

function computeSeatId(row: number, column: number) {
  return row * 8 + column;
}

function getSeatIdFromString(text: string) {
  const row = getRowFromText(text.slice(0, 7));
  const column = getColumnFromText(text.slice(7));
  return computeSeatId(row, column);
}

export async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );
  for (const line of fileContent.split("\n")) {
    const seatId = getSeatIdFromString(line);
  }
  const seatIds = fileContent
    .split("\n")
    .map(getSeatIdFromString)
    .sort((a, b) => a - b);
  const highestSeatId = seatIds[seatIds.length - 1];
  console.log("hightest seat id:", highestSeatId);

  let foundId: number | undefined = undefined;
  for (let i = 0; i < seatIds.length; i++) {
    if (i === 0) {
      continue;
    }
    if (seatIds[i] - seatIds[i - 1] === 2) {
      foundId = seatIds[i] - 1;
      break;
    }
  }
  console.log("found id:", foundId);
}

await start();
