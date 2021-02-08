type ParsedEntry {
  letter: string;
  range: [number, number];
  password: string;
}

function parseLine(textLine: string) {
  const [validationHeader, password] = textLine.split(":");
  const [rangeString, letter] = validationHeader.split(" ");
  const range = rangeString.split("-").map((value) => parseInt(value, 10));
  return { letter, range, password };
}

function oldJobValidation({ letter, password, range }: ParsedEntry): boolean {
  const letterMatches = [...password].reduce(
    (acc, l) => (l === letter ? acc + 1 : acc),
    0
  );
  const [min, max] = range;
  return letterMatches <= max && letterMatches >= min;
}

async function start() {
  const fileContent = await Deno.readTextFile("input.txt");
  const entries = fileContent.split("\n").map(parseLine);
  const validEntries = entries.filter(oldJobValidation);
  console.log(validEntries.length);
}

await start();
