type ParsedEntry = {
  letter: string;
  range: [number, number];
  password: string;
};

function parseLine(textLine: string): ParsedEntry {
  const [validationHeader, password] = textLine.split(":");
  const [rangeString, letter] = validationHeader.split(" ");
  const [min, max] = rangeString.split("-").map((value) => parseInt(value, 10));
  return { letter, range: [min, max], password };
}

function oldJobValidation({ letter, password, range }: ParsedEntry): boolean {
  const letterMatches = [...password].reduce(
    (acc, l) => (l === letter ? acc + 1 : acc),
    0
  );
  const [min, max] = range;
  return letterMatches <= max && letterMatches >= min;
}

function officialTobogganValidation({
  letter,
  password,
  range,
}: ParsedEntry): boolean {
  const [firstPosition, secondPosition] = range;
  return (
    (password[firstPosition] === letter ||
      password[secondPosition] === letter) &&
    password[firstPosition] !== password[secondPosition]
  );
}

async function start() {
  const filePath = new URL("input.txt", import.meta.url);
  const fileContent = await Deno.readTextFile(filePath);
  const entries = fileContent.split("\n").map(parseLine);
  console.log("Old job validation:", entries.filter(oldJobValidation).length);
  console.log(
    "Official Toboggan Corporate Policy validation:",
    entries.filter(officialTobogganValidation).length
  );
}

await start();
