function isValid(baseNumbers: number[], toCheck: number) {
  for (let i = 0; i < baseNumbers.length; i++) {
    for (let j = 0; j < baseNumbers.length; j++) {
      if (baseNumbers[i] + baseNumbers[j] === toCheck) {
        return true;
      }
    }
  }
}

function findInvalidNumber(numbers: number[], sliceLength: number) {
  for (let i = sliceLength; i < numbers.length; i++) {
    if (!isValid(numbers.slice(i - sliceLength, i), numbers[i])) {
      return numbers[i];
    }
  }
}

export async function start() {
  const SLICE_LENGTH = 25;
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );
  const numbers = fileContent
    .split("\r\n")
    .map((rawNumber) => parseInt(rawNumber, 10));

  const invalid = findInvalidNumber(numbers, SLICE_LENGTH);
  console.log("invalid number is:", invalid);

  if (!invalid) {
    throw new Error("invalid should not be empty");
  }

  for (let i = 0; i < numbers.length; i++) {
    const numList: number[] = [numbers[i]];
    console.log(numbers[i]);
    let j = i + 1;
    while (numList.reduce((acc, num) => acc + num, 0) < invalid) {
      numList.push(numbers[j]);
      j++;
    }
    if (numList.reduce((acc, num) => acc + num) === invalid) {
      console.log(numList.sort((a, b) => a - b));
      break;
    }
  }
  console.log("ended");
}

await start();
