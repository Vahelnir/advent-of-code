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

  const allDistances = new Map<string, number>();
  const distanceMap = new Map<string, Map<string, number>>();
  for (let i = 0; i < points.length; i++) {
    const pointA = points[i]!;
    const keyA = vectorToKey(pointA);
    const distanceTargets = distanceMap.get(keyA) || new Map<string, number>();
    for (let j = 0; j < points.length; j++) {
      if (i === j) {
        continue;
      }

      const pointB = points[j]!;
      const keyB = vectorToKey(pointB);
      const dist = distance(pointA, pointB);
      allDistances.set(
        keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`,
        dist,
      );
      distanceTargets.set(keyB, dist);
    }

    distanceMap.set(keyA, distanceTargets);
  }

  const circuits: Set<string>[] = points.map(
    (point) => new Set([vectorToKey(point)]),
  );
  let sortedPairs = Array.from(allDistances.entries())
    .map(([key, distance]) => {
      const [keyA, keyB] = key.split("|") as [string, string];
      return {
        pointA: keyToVector(keyA),
        pointB: keyToVector(keyB),
        distance,
      };
    })
    .toSorted((a, b) => a.distance - b.distance);
  for (let i = 0; i < sortedPairs.length; i++) {
    const pair = sortedPairs[i]!;
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
    if (i === 1000) {
      break;
    }
  }

  const [a, b, c] = circuits.toSorted((a, b) => b.size - a.size);
  if (!a || !b || !c) {
    throw new Error("Less than 3 circuits found");
  }
  // console.log(a, b, c);
  console.log(a.size * b.size * c.size, circuits.length);
};
