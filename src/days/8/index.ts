import type { DayEntryPoint } from "../../types/DayEntryPoint";

type Vector3D = { x: number; y: number; z: number };

function distance(a: Vector3D, b: Vector3D): number {
  return Math.abs((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

function vectorToKey(v: Vector3D): string {
  return `${v.x},${v.y},${v.z}`;
}

function keyToVector(key: string): Vector3D {
  const [x, y, z] = key.split(",").map(Number) as [number, number, number];
  return { x, y, z };
}

export const run: DayEntryPoint = async (input) => {
  const points: Vector3D[] = input
    .split("\n")
    .map(
      (line) => line.trim().split(",").map(Number) as [number, number, number],
    )
    .map(([x, y, z]) => ({ x, y, z }));

  const allDistances = new Set<string>();
  for (let i = 0; i < points.length; i++) {
    const pointA = points[i]!;
    const keyA = vectorToKey(pointA);
    for (let j = i + 1; j < points.length; j++) {
      const pointB = points[j]!;
      const keyB = vectorToKey(pointB);
      allDistances.add(
        pointA.x < pointB.x ? `${keyA}|${keyB}` : `${keyB}|${keyA}`,
      );
    }
  }

  const circuits: Set<string>[] = points.map(
    (point) => new Set([vectorToKey(point)]),
  );
  let sortedPairs = Array.from(allDistances)
    .map((key) => {
      const [keyA, keyB] = key.split("|") as [string, string];
      const pointA = keyToVector(keyA);
      const pointB = keyToVector(keyB);
      return {
        pointA,
        pointB,
        distance: distance(pointA, pointB),
      };
    })
    .toSorted((a, b) => a.distance - b.distance);
  let loopCount = 0;
  while (circuits.length > 1) {
    const pair = sortedPairs[loopCount++]!;
    const circuitA = circuits.find((circuit) =>
      circuit.has(vectorToKey(pair.pointA)),
    );
    const circuitB = circuits.find((circuit) =>
      circuit.has(vectorToKey(pair.pointB)),
    );
    if (!circuitA || !circuitB) {
      throw new Error("One of the circuits is missing");
    }

    if (circuitA !== circuitB) {
      const firstCircuitIndex = circuits.indexOf(circuitA);
      circuits[firstCircuitIndex] = circuitA.union(circuitB);
      circuits.splice(circuits.indexOf(circuitB), 1);
    }

    if (loopCount === 1000) {
      const [a, b, c] = circuits.toSorted((a, b) => b.size - a.size);
      if (!a || !b || !c) {
        throw new Error("Less than 3 circuits found");
      }
      console.log(a.size * b.size * c.size, circuits.length);
    }
  }

  const lastPair = sortedPairs[loopCount - 1];
  if (!lastPair) {
    throw new Error("No more pairs available");
  }

  console.log(lastPair.pointA.x * lastPair.pointB.x);
};
