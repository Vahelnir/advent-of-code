import { Validator, validators } from "./validators.ts";

function isPassportValid(passport: Set<string>) {
  return (passport.size === 7 && !passport.has("cid")) || passport.size > 7;
}

export async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );

  let passportsContainingRequiredFields = 0;
  let passportsWithValidValuesAndFields = 0;
  for (const rawStringPassport of fileContent.split("\r\n\r\n")) {
    const stringPassport = rawStringPassport.replaceAll("\r\n", " ");
    const validatedProperties = new Set<string>();
    const properties = new Set<string>();

    for (const entry of stringPassport.split(" ")) {
      const [key, value] = entry.split(":");
      properties.add(key);

      const validatorEntry = validators.find(
        (validator) => validator.property === key
      );
      if (
        validatorEntry &&
        ((validatorEntry.required && validatorEntry.validator(value)) ||
          !validatorEntry.required)
      ) {
        validatedProperties.add(key);
      } else {
        if (key === "pid") {
          console.log("key is not valid", `${key}:'${value}'`);
        }
      }
    }
    if (isPassportValid(properties)) {
      passportsContainingRequiredFields += 1;
    }
    if (isPassportValid(validatedProperties)) {
      passportsWithValidValuesAndFields += 1;
    }
  }
  console.log("first half:", passportsContainingRequiredFields);
  console.log("second half:", passportsWithValidValuesAndFields);
}

await start();
