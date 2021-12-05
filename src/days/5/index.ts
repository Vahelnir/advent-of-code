import { DayEntryPoint } from "../../types/DayEntryPoint";

type Size = { height: number; width: number };
type Position = { x: number; y: number };
type Segment = Position[];

function parseCoordinates(coords: string[]): Position[] {
  return coords
    .map((coord) => coord.split(","))
    .map(([x, y]) => ({ x: +x, y: +y }));
}

function parseSegments(lines: string[]): Segment[] {
  return lines
    .map((line) => line.split(" -> "))
    .map(parseCoordinates)
    .map((segment) =>
      segment.sort((a, b) => (a.x == b.x ? a.y - b.y : a.x - b.x))
    );
}

function getDimensionsFromSegments(segments: Segment[]): Size {
  const maxCoords: Position = segments.reduce(
    ({ y, x }, [start, end]) => ({
      y: Math.max(y, start.y, end.y),
      x: Math.max(x, start.x, end.x),
    }),
    { y: 0, x: 0 }
  );

  return { height: maxCoords.y + 1, width: maxCoords.x + 1 };
}

function createBaseDiagram(size: Size) {
  return Array(size.height)
    .fill(0)
    .map(() => Array(size.width).fill(0));
}

function solveFirst(lines: string[]) {
  const segments = parseSegments(lines);
  const dimensions = getDimensionsFromSegments(segments);
  const diagram = createBaseDiagram(dimensions);

  for (let [start, end] of segments) {
    if (start.x === end.x) {
      const x = start.x;
      for (let y = start.y; y <= end.y; y++) {
        diagram[y][x]++;
      }
    } else if (start.y === end.y) {
      const y = start.y;
      for (let x = start.x; x <= end.x; x++) {
        diagram[y][x]++;
      }
    } else {
      // ignore non-horizontal and non-vertical segments
    }
  }

  // display the diagram
  // console.log(
  //   diagram
  //     .map((line) => line.map((cell) => (cell === 0 ? "." : cell)))
  //     .map((line) => line.join(""))
  //     .join("\n")
  // );
  console.log(
    "first:",
    diagram
      .map((line) => line.filter((el) => el >= 2).length)
      .reduce((sum, count) => count + sum, 0)
  );
}

function solveSecond(lines: string[]) {
  const segments = parseSegments(lines);
  const dimensions = getDimensionsFromSegments(segments);
  const diagram = createBaseDiagram(dimensions);

  for (let [start, end] of segments) {
    if (start.x === end.x) {
      const x = start.x;
      for (let y = start.y; y <= end.y; y++) {
        diagram[y][x]++;
      }
    } else if (start.y === end.y) {
      const y = start.y;
      for (let x = start.x; x <= end.x; x++) {
        diagram[y][x]++;
      }
    } else {
      if (start.y < end.y) {
        // +45°
        for (let { x, y } = start; x <= end.x && y <= end.y; x++, y++) {
          diagram[y][x]++;
        }
      } else {
        // -45°
        for (let { x, y } = start; x <= end.x && y >= end.y; x++, y--) {
          diagram[y][x]++;
        }
      }
    }
  }

  // display the diagram
  // console.log(
  //   diagram
  //     .map((line) => line.map((cell) => (cell === 0 ? "." : cell)))
  //     .map((line) => line.join(""))
  //     .join("\n")
  // );
  console.log(
    "second:",
    diagram
      .map((line) => line.filter((el) => el >= 2).length)
      .reduce((sum, count) => count + sum, 0)
  );
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");
  solveFirst([...lines]);
  solveSecond([...lines]);
};
