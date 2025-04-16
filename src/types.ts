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
