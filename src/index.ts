import { join, resolve } from "path";

async function run() {
  const day = process.argv.slice(2)[0];
  if (!day) {
    console.log("please select a day to solve");
    return;
  }

  return solveDay(day);
}

async function readInput(path: string) {
  const value = Bun.file(path);
  return value.text();
}

async function solveDay(day: string) {
  const dayDirectory = resolve(import.meta.dir, "days/", day);
  const dayPath = join(dayDirectory, "index");
  const inputPath = join(dayDirectory, "input.txt");

  const dayModule = await import(dayPath);
  if (!dayModule.run) {
    console.log("cannot run day", day);
    return;
  }

  const input = await readInput(inputPath);
  dayModule.run(input);
}

run().catch(console.error);
