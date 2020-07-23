export interface StateGroup {
  letter: string;
  names: string[];
}

export type SaveEllipse = {
  width: number;
  height: number;
  top: number;
  left: number;
  rx: number;
  ry: number;
  color: string;
};

export interface SaveFreeHandDrawing {
  coordinateValue: any;
  color: string;
}
