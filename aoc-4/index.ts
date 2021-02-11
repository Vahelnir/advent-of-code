interface Passport {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
}

const requiredFields = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid",
] as const;

function isPassportValid(passport: Set<keyof Passport>) {
  return (passport.size === 7 && !passport.has("cid")) || passport.size === 8;
}

async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );
  const lines = fileContent.split("\r\n");
  const passport = new Set<keyof Passport>();

  let valid = 0;
  let passportCount = 0;

  function processPassport() {
    if (isPassportValid(passport)) {
      valid += 1;
    }
    passportCount++;
    passport.clear();
  }

  for (const line of lines) {
    if (line.length > 0) {
      for (const entry of line.split(" ")) {
        const [key] = entry.split(":");
        passport.add(key as keyof Passport);
      }
    } else {
      processPassport();
    }
  }
  processPassport();
  console.log(`${valid}/${passportCount}`);
}

await start();
