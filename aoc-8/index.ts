function runAndBreakOnLoop(rawInstructions: string[]) {
  let i = 0;
  let accumulator = 0;

  function jmp(to: number) {
    i += to;
  }

  function acc(value: number) {
    accumulator += value;
    i += 1;
  }

  function nop() {
    i += 1;
  }

  const executedInstructions = new Map<number, boolean>();
  while (i < rawInstructions.length) {
    const alreadyExecuted = executedInstructions.get(i);
    if (alreadyExecuted) {
      return accumulator;
    }
    const rawInstruction = rawInstructions[i];
    const [instruction, ...args] = rawInstruction.split(" ");
    executedInstructions.set(i, true);

    switch (instruction) {
      case "jmp": {
        const value = parseInt(args[0], 10);
        jmp(value);
        break;
      }
      case "acc": {
        acc(parseInt(args[0], 10));
        break;
      }
      case "nop": {
        // const value = parseInt(args[0], 10);
        nop();
        break;
      }
    }
  }

  return accumulator;
}

/**
 * IDEAS:
 * - keep track of the order of each executed instruction and try to replay it backwards
 * - graphs ?
 */
function bruteForceRun(rawInstructions: string[]) {
  let tryCounter = 0;

  let replaying = false;
  let swapInstruction = false;
  const tracked = [];
  let state = {
    index: 0,
    accumulator: 0,
    executedInstructions: new Map<number, boolean>(),
  };

  function jmp(to: number) {
    state.index += to;
  }

  function acc(value: number) {
    state.accumulator += value;
    state.index += 1;
  }

  function nop() {
    state.index += 1;
  }

  while (state.index < rawInstructions.length) {
    const alreadyExecuted = state.executedInstructions.get(state.index);
    if (alreadyExecuted) {
      const previous = tracked.pop();
      if (previous) {
        replaying = true;
        swapInstruction = true;
        state = previous.state;
        tryCounter++;
        continue;
      } else {
        throw new Error("chelou que t'arrives ici :shrug:");
      }
    }

    const rawInstruction = rawInstructions[state.index];
    let [instruction, ...args] = rawInstruction.split(" ");
    if (["jmp", "nop"].includes(instruction)) {
      if (!replaying) {
        tracked.push({
          instruction,
          state: {
            ...state,
            executedInstructions: new Map(state.executedInstructions),
          },
        });
      }
      if (replaying && swapInstruction) {
        instruction = instruction === "jmp" ? "nop" : "jmp";
        swapInstruction = false;
      }
    }
    state.executedInstructions.set(state.index, true);
    switch (instruction) {
      case "jmp": {
        const value = parseInt(args[0], 10);
        jmp(value);
        break;
      }
      case "acc": {
        acc(parseInt(args[0], 10));
        break;
      }
      case "nop": {
        // const value = parseInt(args[0], 10);
        nop();
        break;
      }
    }
  }
  console.log(tryCounter);
  return state.accumulator;
}

export async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );
  const instructions = fileContent.split("\r\n");
  const firstAccumulator = runAndBreakOnLoop(instructions);
  console.log("first accumulator value:", firstAccumulator);

  const secondAccumulator = bruteForceRun(instructions);
  console.log("second accumulator value:", secondAccumulator);
}

await start();
