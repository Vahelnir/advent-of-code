import { readFile } from "fs/promises";
import { join, resolve } from "path";

function run() {
  const day = process.argv.slice(2)[0];
  if (!day) {
    console.log("please select a day to solve");
  }

  return solveDay(day);
}

async function readInput(path: string) {
  const value = await readFile(path);
  return value.toString("utf-8");
}

async function solveDay(day: string) {
  const dayDirectory = resolve(__dirname, "days/", day);
  const dayPath = join(dayDirectory, "index");
  try {
    const dayModule = require(dayPath);
    if (!dayModule.run) {
      console.log("cannot run day", day);
      return;
    }
    const input = await readInput(join(dayDirectory, "input.txt"));
    dayModule.run(input);
  } catch (error) {
    console.log("no day", day, "found");
    console.error(error);
  }
}

run().catch(console.error);
