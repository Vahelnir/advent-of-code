import { DayEntryPoint } from "../../types/DayEntryPoint";

type File = {
  _type: "file";
  parent: Directory;
  size: number;
  name: string;
};

type Directory = {
  _type: "directory";
  parent: Directory | undefined;
  children: Record<string, File | Directory>;
  name: string;
};

type State = {
  cwd: Directory;
  index: number;
  lines: string[];
};

const root_dir: Directory = {
  _type: "directory",
  name: "/",
  children: {},
  parent: undefined,
};

const TOTAL_SIZE = 70000000;
const UPDATE_SIZE = 30000000;
const FIND_UNDER_SIZE = 100000;

function get_path(element: File | Directory): string {
  if (!element.parent) {
    return "";
  }
  return `${get_path(element.parent)}/${element.name}`;
}

const commands: Record<string, (state: State, args: string[]) => State> = {
  cd(state, [path]) {
    console.log(path);
    if (path === "/") {
      return { ...state, cwd: root_dir };
    }

    if (path === "..") {
      if (!state.cwd.parent) {
        throw new Error(`Already in root directory: ${get_path(state.cwd)}`);
      }
      return { ...state, cwd: state.cwd.parent };
    }

    const go_to_path = state.cwd.children[path];
    if (!go_to_path || go_to_path._type !== "directory") {
      throw new Error(`trying to 'cd' to a file: ${path}`);
    }

    return { ...state, cwd: go_to_path };
  },
  ls(state) {
    let line: string = state.lines[++state.index];
    while (line && line[0] !== "$") {
      const [size, name] = line.split(" ");
      if (size === "dir") {
        state.cwd.children[name] = {
          _type: "directory",
          name,
          children: {},
          parent: state.cwd,
        };
      } else {
        state.cwd.children[name] = {
          _type: "file",
          name,
          size: +size,
          parent: state.cwd,
        };
      }
      line = state.lines[++state.index];
    }
    state.index--;
    return state;
  },
};

function solve_first_part(state: State) {
  const directories: { name: string; size: number }[] = [];
  const get_directory_size = (directory: Directory) => {
    let directory_size = 0;
    for (const child_name in directory.children) {
      const child = directory.children[child_name];
      if (child._type === "directory") {
        const size = get_directory_size(child);
        directories.push({ name: child.name, size });
        directory_size += size;
      } else {
        directory_size += child.size;
      }
    }
    return directory_size;
  };
  const used_size = get_directory_size(root_dir);
  console.log("total space:", TOTAL_SIZE);
  console.log("used space:", used_size);
  console.log("free space:", TOTAL_SIZE - used_size);
  console.log("min space to free:", UPDATE_SIZE - (TOTAL_SIZE - used_size));
  console.log(
    "first part",
    directories
      .filter((directory) => directory.size <= FIND_UNDER_SIZE)
      .reduce((acc, { size }) => acc + size, 0)
  );

  const sorted_dirs = [...directories]
    .sort((a, b) => b.size - a.size)
    .reverse();
  const dir_to_remove = sorted_dirs.find(
    (el) => el.size >= UPDATE_SIZE - (TOTAL_SIZE - used_size)
  );
  console.log("second part", dir_to_remove?.size);
}

export const run: DayEntryPoint = (input) => {
  const lines = input.split("\n");

  let state = { cwd: root_dir, index: 0, lines };
  for (; state.index < lines.length; state.index++) {
    const line = lines[state.index];
    if (line[0] !== "$") {
      continue;
    }

    const [, command, ...args] = line.split(" ");
    state = commands[command]?.(state, args);
  }

  solve_first_part(state);
};
