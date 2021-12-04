export type Board = {
	content: string[][];
	drawedValues: boolean[][];
	won: boolean;
};

function createBooleanMatrix() {
	return Array(5)
		.fill(0)
		.map(() =>
			Array(5)
				.fill(0)
				.map((_) => false)
		);
}

export function create(content: string[][]) {
	return { content, drawedValues: createBooleanMatrix(), won: false };
}

export function draw(board: Board, value: string) {
	for (let i = 0; i < board.content.length; i++) {
		const line = board.content[i];
		for (let j = 0; j < line.length; j++) {
			if (value === line[j]) {
				board.drawedValues[i][j] = true;
			}
		}
	}
}

export function hasWon(board: Board) {
	// if (board.won) {
	// 	return true;
	// }
	const hasFullLine = board.drawedValues.some((line) =>
		line.reduce((acc, bool) => acc && bool === true, true)
	);
	if (hasFullLine) {
		board.won = true;
		return true;
	}

	for (let i = 0; i < board.drawedValues.length; i++) {
		let isFullColumnn = true;
		const line = board.drawedValues[i];
		for (let j = 0; j < line.length; j++) {
			if (!board.drawedValues[j][i]) {
				isFullColumnn = false;
				break;
			}
		}

		if (isFullColumnn) {
			board.won = true;
			return true;
		}
	}
	return false;
}

export function sumRemainingValues(board: Board) {
	let sum = 0;
	for (let i = 0; i < board.content.length; i++) {
		const line = board.content[i];
		for (let j = 0; j < line.length; j++) {
			if (!board.drawedValues[i][j]) {
				sum += +line[j];
			}
		}
	}
	return sum;
}
