import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };
type Fold = { axis: string; value: number };

function parseLines(lines: string[]) {
  const folds = lines
    .filter((line) => line.startsWith("fold"))
    .map((fold) => fold.split(" ").slice(-1)[0])
    .map((el) => el.split("="))
    .map(([axis, value]) => ({ axis, value: +value }));
  const dots: Position[] = lines
    .slice(0, -folds.length)
    .map((str) => str.split(","))
    .map(([x, y]) => ({ x: +x, y: +y }));
  return { folds, dots };
}

function createTransparentFromDots(dots: Position[]) {
  const { y: height, x: width } = dots.reduce(
    ({ x: maxX, y: maxY }, { x, y }) => ({
      x: Math.max(x, maxX),
      y: Math.max(y, maxY),
    }),
    { x: 0, y: 0 }
  );
  console.log("size:", height, width);

  const transparent = Array.from({ length: height + 1 }, () =>
    Array(width + 1).fill(".")
  );

  for (const { x, y } of dots) {
    transparent[y][x] = "#";
  }
  return transparent;
}

function gridToString(grid: string[][]) {
  return grid.map((row) => row.join("")).join("\n");
}

function fold(foldedTransparent: string[][], fold: Fold) {
  const mergeGrids = (a: string[][], b: string[][], offset: Position) =>
    a.map((row, y) =>
      row.map((point, x) => {
        const bX = x - (offset.x <= x ? offset.x : 0);
        const bY = y - (offset.y <= y ? offset.y : 0);
        return point === "." ? b[bY][bX] : point;
      })
    );
  let offset = { x: 0, y: 0 };
  if (fold.axis === "y") {
    let a = foldedTransparent.slice(0, fold.value);
    let b = foldedTransparent.slice(fold.value + 1).reverse();
    if (a.length < b.length) {
      [a, b] = [b, a];
    }

    offset.y = a.length - b.length;
    return mergeGrids(a, b, offset);
  }

  let a = foldedTransparent.map((row) => row.slice(0, fold.value));
  let b = foldedTransparent.map((row) => row.slice(fold.value + 1).reverse());
  if (a[0].length < b[0].length) {
    [a, b] = [b, a];
  }
  offset.x = a[0].length - b[0].length;
  return mergeGrids(a, b, offset);
}

async function solveFirst(lines: string[]) {
  const { dots, folds } = parseLines(lines);

  const transparent = createTransparentFromDots(dots);

  const foldedTransparent = fold(transparent, folds[0]);

  console.log(
    "first:",
    foldedTransparent
      .map((row) => row.filter((point) => point === "#").length)
      .reduce((sum, value) => sum + value, 0)
  );
  // console.log(gridToString(foldedTransparent));
}

async function solveSecond(lines: string[]) {
  const { dots, folds } = parseLines(lines);

  const transparent = createTransparentFromDots(dots);

  let foldedTransparent = transparent;

  for (const foldObj of folds) {
    foldedTransparent = fold(foldedTransparent, foldObj);
  }

  console.log("second:");
  console.log(gridToString(foldedTransparent));
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  solveFirst([...lines]);
  solveSecond([...lines]);
};
