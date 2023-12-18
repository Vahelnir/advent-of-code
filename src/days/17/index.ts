import { DayEntryPoint } from "../../types/DayEntryPoint";

type Position = { x: number; y: number };
type Direction = "right" | "left" | "up" | "down";

type Grid = Cell[][];
type Cell = {
  heatLoss: number;
  previousNode?: Cell;
  total: number;
  visited: boolean;
  position: Position;
};

type PositionToVisit = {
  position: Position;
  straight: number;
  direction: Direction;
  totalHeat: number;
};

export const run: DayEntryPoint = (input) => {
  const grid: Grid = input.split("\n").map((line, y) =>
    line.split("").map(
      (heatLoss, x) =>
        ({
          position: { x, y },
          heatLoss: Number(heatLoss),
          total: 0,
          visited: false,
        }) satisfies Cell,
    ),
  );
  const startingPoint = { x: 0, y: 0 } satisfies Position;

  const positionsToVisit: PositionToVisit[] = [
    {
      position: { ...startingPoint, y: startingPoint.y + 1 },
      direction: "right",
      straight: 1,
      totalHeat: 0,
    },
    {
      position: { ...startingPoint, x: startingPoint.x + 1 },
      direction: "down",
      straight: 1,
      totalHeat: 0,
    },
  ];
  while (
    positionsToVisit.sort((a, b) => b.totalHeat - a.totalHeat).length > 0
  ) {
    const value = positionsToVisit.pop();
    if (!value) continue;

    const { position, straight, direction, totalHeat } = value;

    const currentCell = grid[position.y][position.x];
    if (currentCell.visited) {
      continue;
    }
    if (position.x === grid[0].length - 1) {
      console.log(position, direction, straight);
    }

    const currentTotalHeat = totalHeat + currentCell.heatLoss;
    currentCell.visited = true;
    const adjacentCells = (
      [
        {
          position: { ...position, y: position.y + 1 },
          direction: "down",
          straight: direction === "down" ? straight + 1 : 0,
          totalHeat: currentTotalHeat,
        },
        {
          position: { ...position, y: position.y - 1 },
          direction: "up",
          straight: direction === "up" ? straight + 1 : 0,
          totalHeat: currentTotalHeat,
        },
        {
          position: { ...position, x: position.x + 1 },
          direction: "right",
          straight: direction === "right" ? straight + 1 : 0,
          totalHeat: currentTotalHeat,
        },
        {
          position: { ...position, x: position.x - 1 },
          direction: "left",
          straight: direction === "left" ? straight + 1 : 0,
          totalHeat: currentTotalHeat,
        },
      ] satisfies PositionToVisit[]
    ).filter((positionToVisit) => {
      if (
        positionToVisit.position.x < 0 ||
        positionToVisit.position.y < 0 ||
        positionToVisit.position.x >= grid[0].length ||
        positionToVisit.position.y >= grid.length
      ) {
        return false;
      }

      const cell = grid[positionToVisit.position.y][positionToVisit.position.x];
      return !(
        cell.visited ||
        (direction === positionToVisit.direction &&
          positionToVisit.straight >= 3)
      );
    });

    adjacentCells.forEach(({ position: { x, y } }) => {
      const adjacentCell = grid[y][x];
      if (
        !adjacentCell.previousNode ||
        adjacentCell.heatLoss + currentCell.total < adjacentCell.total
      ) {
        adjacentCell.total = currentCell.total + adjacentCell.heatLoss;
        adjacentCell.previousNode = currentCell;
      }
    });

    positionsToVisit.push(...adjacentCells);
  }
  const path: Cell[] = [];
  let parent: Cell | undefined = grid[grid.length - 1][grid[0].length - 1];
  while (parent !== undefined) {
    path.unshift(parent);
    parent = parent.previousNode;
  }
  const displayGrid = grid.map((line) =>
    line.map((cell) => String(cell.heatLoss)),
  );

  path.forEach(({ position: { x, y } }) => (displayGrid[y][x] = "."));
  console.log(displayGrid.map((line) => line.join("")).join("\n"));

  console.log(grid[grid.length - 1][grid[0].length - 1].total);
};
