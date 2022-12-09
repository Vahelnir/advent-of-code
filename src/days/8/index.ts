import { DayEntryPoint } from "../../types/DayEntryPoint";

type ViewDistance = {
  north: number;
  west: number;
  east: number;
  south: number;
};

type Position = { x: number; y: number };

type Tree = {
  height: number;
  visible: boolean;
  position: Position;
};

type TreeWithScore = Tree & {
  view_distance: ViewDistance;
  score: number;
};

function create_tree(height: number, position: Position): Tree {
  return {
    height,
    position,
    visible: false,
  };
}

function part_one(grid_size: Position, grid: Tree[][]) {
  // left to right, right to left
  for (let y = 0; y < grid_size.y; y++) {
    let max_height_seen = -1;
    let max_height_seen_opposite = -1;
    for (let x = 0; x < grid_size.x; x++) {
      const tree = grid[y][x];
      if (max_height_seen < tree.height) {
        max_height_seen = tree.height;
        tree.visible = true;
      }

      const opposite_tree = grid[grid_size.y - y - 1][grid_size.x - x - 1];
      if (max_height_seen_opposite < opposite_tree.height) {
        max_height_seen_opposite = opposite_tree.height;
        opposite_tree.visible = true;
      }
    }
  }

  // top to bottom, bottom to top
  for (let x = 0; x < grid_size.x; x++) {
    let max_height_seen = -1;
    let max_height_seen_opposite = -1;
    for (let y = 0; y < grid_size.y; y++) {
      const tree = grid[y][x];
      if (max_height_seen < tree.height) {
        max_height_seen = tree.height;
        tree.visible = true;
      }

      const opposite_tree = grid[grid_size.y - y - 1][grid_size.x - x - 1];
      if (max_height_seen_opposite < opposite_tree.height) {
        max_height_seen_opposite = opposite_tree.height;
        opposite_tree.visible = true;
      }
    }
  }

  console.log(
    "first result:",
    grid.flat().filter((tree) => tree.visible).length
  );
}

function part_two(grid_size: Position, grid: Tree[][]) {
  const final_grid = grid.flat().map((tree) => get_tree_with_score(grid, tree));

  const sorted_trees = final_grid.sort((a, b) => b.score - a.score);
  console.log("second result:", sorted_trees[0].score);
}

function get_tree_with_score(grid: Tree[][], tree: Tree): TreeWithScore {
  const view_distance = {
    north: calculate_view_distance(grid, "north", tree),
    west: calculate_view_distance(grid, "west", tree),
    east: calculate_view_distance(grid, "east", tree),
    south: calculate_view_distance(grid, "south", tree),
  };
  return {
    ...tree,
    view_distance,
    score: calculate_score(view_distance),
  };
}

function calculate_view_distance(
  grid: Tree[][],
  direction: "north" | "south" | "east" | "west",
  tree: Tree
) {
  let from = 0;
  let inc: (val: number) => number;
  let cond: (val: number) => boolean;
  let get_tree: (val: number) => Tree;

  // configure the for loop which will go
  // in one of the four direction
  if (direction === "west") {
    const row = grid[tree.position.y];
    from = tree.position.x - 1;
    inc = (val) => val - 1;
    cond = (val) => val >= 0;
    get_tree = (val) => row[val];
  } else if (direction === "east") {
    const row = grid[tree.position.y];
    from = tree.position.x + 1;
    inc = (val) => val + 1;
    cond = (val) => val < row.length;
    get_tree = (val) => row[val];
  } else if (direction === "north") {
    from = tree.position.y - 1;
    get_tree = (val) => grid[val][tree.position.x];
    inc = (val) => val - 1;
    cond = (val) => val >= 0;
  } else {
    from = tree.position.y + 1;
    get_tree = (val) => grid[val][tree.position.x];
    inc = (val) => val + 1;
    cond = (val) => val < grid.length;
  }

  // if there is no element, we are at the border
  if (!cond(from)) {
    return 0;
  }

  let view_distance = 1;
  for (let i = from; cond(i); i = inc(i)) {
    const current_tree = get_tree(i);

    if (current_tree.height >= tree.height) {
      return view_distance;
    }

    view_distance++;
  }
  return view_distance - 1;
}

function calculate_score({ east, north, south, west }: ViewDistance) {
  return east * north * south * west;
}

export const run: DayEntryPoint = (input) => {
  const grid: Tree[][] = input.split("\n").map((row, y) =>
    row
      .split("")
      .map((raw_cell) => +raw_cell)
      .map((height, x) => create_tree(height, { x, y }))
  );

  const grid_size: Position = { y: grid.length, x: grid[0].length };

  part_one(grid_size, grid);
  part_two(grid_size, grid);
};
