function firstPart(availableAdapters: number[]) {
  // sort everything

  const differences: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < availableAdapters.length - 1; i++) {
    const next = availableAdapters[i + 1];
    const current = availableAdapters[i];

    const diff = next - current;
    differences[diff - 1] += 1;
  }
}

function secondPart(availableAdapters: number[]) {}

export async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );

  const unsortedAdapters = fileContent
    .split("\r\n")
    .map((string) => parseInt(string, 10));
  const max = Math.max(...unsortedAdapters);
  // add the first and last Jolt adapters
  unsortedAdapters.push(max + 3);
  unsortedAdapters.push(0);
  const availableAdapters = unsortedAdapters.sort((a, b) => a - b);

  console.log("step 1:", firstPart(availableAdapters));
  console.log("step 2:", secondPart(availableAdapters));
}

await start();
