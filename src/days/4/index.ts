import { DayEntryPoint } from "../../types/DayEntryPoint";
import * as Board from "./Board";

function getBoardsFromLines(lines: string[]) {
	let boardLines = lines.slice(2);
	const boards: Board.Board[] = [];
	while (boardLines.length > 0) {
		const board = boardLines
			.splice(0, 5)
			.map((line) => line.split(" ").filter((el) => el.trim().length > 0));
		boardLines = boardLines.slice(1);
		boards.push(Board.create(board));
	}
	return boards;
}

function solveFirst(lines: string[]) {
	const values = lines[0].split(",");
	const boards = getBoardsFromLines(lines);

	for (const value of values) {
		for (const board of boards) {
			Board.draw(board, value);

			if (Board.hasWon(board)) {
				const sum = Board.sumRemainingValues(board);
				console.log("first:", +value, sum, +value * sum);
				return;
			}
		}
	}
}

function solveSecond(lines: string[]) {
	const values = lines[0].split(",");
	let boards = getBoardsFromLines(lines);

	for (const value of values) {
		for (const board of boards) {
			Board.draw(board, value);
			if (boards.length === 1 && Board.hasWon(board)) {
				const sum = Board.sumRemainingValues(board);
				console.log("second:", +value, sum, +value * sum);
				return;
			}
		}
		boards = boards.filter((board) => !Board.hasWon(board));
	}
}

export const run: DayEntryPoint = (input) => {
	const lines = input.split("\n");
	solveFirst([...lines]);
	solveSecond([...lines]);
};
