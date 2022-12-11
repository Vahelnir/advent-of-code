import { DayEntryPoint } from "../../types/DayEntryPoint";

type Instruction<I extends string = string, A extends unknown[] = string[]> = {
  type: I;
  args: A;
};

// type AddxInstruction = Instruction<"addx", [string]>;
// type NoopInstruction = Instruction<"noop", []>;
// type Instructions = AddxInstruction | NoopInstruction;
// type InstructionType = Instructions["type"];

// const t: Record<InstructionType, (args: unknown[]) => Instructions>

type ProcessingInstruction = Instruction & { remaining_cycle: number };
type State = {
  cycle: number;
  x: number;
  instruction_index: number;
  processing_instruction: ProcessingInstruction | undefined;
};

const NOOP_CYCLE = 1;
const ADDX_CYCLE = 2;

const CYCLES_WHEN_CHECKING_STRENGTH = [20, 60, 100, 140, 180, 220];

function parse_instruction(line: string): Instruction {
  const [raw_instruction, ...raw_args] = line.split(" ");
  return { type: raw_instruction, args: raw_args } as Instruction;
}

function instruction_to_processing_instruction(
  instruction: Instruction,
  remaining_cycle: number
) {
  return { ...instruction, remaining_cycle };
}

export const run: DayEntryPoint = (input) => {
  const instructions = input.split("\n").map(parse_instruction);

  let state: State = {
    cycle: 1,
    x: 1,
    instruction_index: 0,
    processing_instruction: undefined,
  };

  const screen: string[][] = [];
  const signal_strength: number[] = [];
  while (
    state.instruction_index < instructions.length ||
    state.processing_instruction
  ) {
    const { cycle, x } = state;
    let { processing_instruction, instruction_index } = state;
    const row = Math.floor((cycle - 1) / 40);
    const pixel = cycle - 1 - row * 40;
    if (pixel === 0) {
      screen.push(Array(40).fill("."));
    }

    let pixel_to_draw = [x - 1, x, x + 1].includes(pixel) ? "#" : ".";

    if (CYCLES_WHEN_CHECKING_STRENGTH.includes(cycle)) {
      console.log(cycle, x, cycle * x);
      signal_strength.push(cycle * x);
    }

    let new_x = x;

    const new_state = (partial_state: Partial<State> = {}): State => {
      return {
        ...state,
        ...partial_state,
        cycle: cycle + 1,
        x: new_x,
      };
    };

    // create the next instruction to process
    if (!processing_instruction && instructions[instruction_index]) {
      const instruction = instructions[instruction_index];
      if (instruction.type === "addx") {
        processing_instruction = instruction_to_processing_instruction(
          instruction,
          ADDX_CYCLE - 1
        );
      } else if (instruction.type === "noop") {
        processing_instruction = instruction_to_processing_instruction(
          instruction,
          NOOP_CYCLE - 1
        );
      }
      // or continue processing the current instruction
    } else if (processing_instruction) {
      processing_instruction = {
        ...processing_instruction,
        remaining_cycle: processing_instruction.remaining_cycle - 1,
      };
    }

    // handle addx logic
    if (
      processing_instruction?.remaining_cycle === 0 &&
      processing_instruction.type === "addx"
    ) {
      // handle logic
      new_x = new_x + +processing_instruction.args[0];
    }

    if (processing_instruction?.remaining_cycle === 0) {
      processing_instruction = undefined;
      instruction_index = instruction_index + 1;
    }

    // draw this cycle pixel
    screen[row][pixel] = pixel_to_draw;

    state = new_state({ processing_instruction, instruction_index });
  }

  console.log(
    "first result:",
    signal_strength.reduce((acc, strength) => acc + strength, 0)
  );

  console.log(screen.map((row) => row.join("")).join("\n"));
};
