function findResultWithTwo(numberList: number[]) {
  for (let i = 0; i < numberList.length; i++) {
    for (let j = 0; j < numberList.length; j++) {
      if (numberList[i] + numberList[j] === 2020) {
        return numberList[i] * numberList[j];
      }
    }
  }
}

function findResultWithThree(numberList: number[]) {
  for (let i = 0; i < numberList.length; i++) {
    for (let j = 0; j < numberList.length; j++) {
      for (let k = 0; k < numberList.length; k++) {
        if (numberList[i] + numberList[j] + numberList[k] === 2020) {
          return numberList[i] * numberList[j] * numberList[k];
        }
      }
    }
  }
}

async function start() {
  const fileContent = await Deno.readTextFile("./input.txt");
  const numbers = fileContent.split("\n").map((line) => parseInt(line, 10));
  const resTwo = findResultWithTwo(numbers);
  const resThree = findResultWithThree(numbers);
  console.log(resTwo, resThree);
}

await start();
