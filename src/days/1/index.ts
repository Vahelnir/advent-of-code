import { DayEntryPoint } from "../../types/DayEntryPoint";

const linesToDepths = (lines: string[]) =>
	lines.map((line) => Number.parseInt(line, 10));

function solveFirst(lines: string[]) {
	const depths = linesToDepths(lines);
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

function solveSecond(lines: string[]) {
	const sliceSize = 3;

	const depths = linesToDepths(lines);
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

export const run: DayEntryPoint = (input) => {
	const lines = input.split("\n");
	solveFirst([...lines]);
	solveSecond([...lines]);
}
