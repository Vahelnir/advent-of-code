const slopesOptions: [number, number][] = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
];

function slideSlope(
  map: string[][],
  height: number,
  width: number,
  [right, down]: [number, number]
) {
  const pos = { x: 0, y: 0 };

  let treeCount = 0;
  while (pos.y < height) {
    if (map[pos.y][pos.x % width] === "#") {
      treeCount++;
    }
    pos.x += right;
    pos.y += down;
  }
  return treeCount;
}

async function start() {
  const fileContent = await Deno.readTextFile(
    new URL("input.txt", import.meta.url)
  );
  const map = fileContent.split("\r\n").map((stringRow) => stringRow.split(""));
  const height = map.length;
  const width = map[0].length;

  const firstResult = slideSlope(map, height, width, [3, 1]);
  console.log("first:", firstResult);

  let finalResult = 1;
  for (const slopeOptions of slopesOptions) {
    finalResult *= slideSlope(map, height, width, slopeOptions);
  }

  console.log("second:", finalResult);
}

await start();
