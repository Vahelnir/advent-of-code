import { readFile } from "fs/promises";
import { resolve } from "path";

// TODO: export this function
async function readInput() {
	const value = await readFile(resolve("input.txt"));
	return value.toString("utf-8");
}

/**
 * @param {number[]} depths
 */
async function solveFirst(depths) {
	let count = 0;
	let previousDepth = depths[0];
	for (const depth of depths.slice(1)) {
		if (depth > previousDepth) {
			count++;
		}
		previousDepth = depth;
	}
	console.log("first:", count);
}

const sliceSize = 3;
/**
 * @param {number[]} depths
 */
async function solveSecond(depths) {
	/** @type {number | null} */
	let previousSum = Infinity;
	let count = 0;
	for (let i = 0; i < depths.length - 3; i++) {
		const sum = depths
			.slice(i, i + sliceSize)
			.map((depth) => (isNaN(depth) ? 0 : depth))
			.reduce((sum, depth) => sum + depth, 0);

		if (sum > previousSum) {
			count++;
		}
		previousSum = sum;
	}
	console.log("second:", count);
}

async function run() {
	const rawInput = await readInput();
	const depths = rawInput.split("\n").map((line) => Number.parseInt(line, 10));
	solveFirst([...depths]);
	solveSecond([...depths]);
}

run();
