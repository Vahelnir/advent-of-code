const requiredFields = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid",
] as const;

function isPassportValid(passport: Record<string, string>) {
  for (const r of requiredFields) {
    if (!(r in passport)) {
      console.log("missing:", r);
      return false;
    }
  }
  return true;
}

async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );
  const lines = fileContent.split("\r\n");
  let passport: Record<string, string> = {};
  let valid = 0;
  let passportCount = 0;
  for (const line of lines) {
    if (line.length === 0) {
      passportCount++;
      if (isPassportValid(passport)) {
        valid += 1;
      }
      passport = {};
    } else {
      for (const entry of line.split(" ")) {
        const [key, value] = entry.split(":");
        passport[key] = value;
      }
    }
  }
  if (isPassportValid(passport)) {
    valid += 1;
  }
  console.log(`${valid}/${passportCount}`);
}

await start();
