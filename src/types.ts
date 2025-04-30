export interface Widget {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  resizable: boolean;
  draggable: boolean;
  static: boolean;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

export type Task = {
  id: string;
  title: string;
}

export type Column = {
  id: string;
  tasks: Task[];
}

export type KanbanTask = {
  id: string;
  title: string;
}

export type KanbanColumn = {
  id: string;
  tasks: KanbanTask[];
}

export type TodoTask = {
  date: string;
  label: string;
  checked: boolean;
}

export type Preferences = {
  [key: string]: unknown
}
