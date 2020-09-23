export interface StateGroup {
  letter: string;
  names: string[];
}

export type SaveEllipse = {
  id: number;
  width: number;
  height: number;
  top: number;
  left: number;
  rx: number;
  ry: number;
  color: string;
  angle: number;
  types: boolean;
  strokeDashArray: any[];
  type: string;
  isMLAi: boolean;
};
export class UpdateEllipse {
  id: number;
  width: number;
  height: number;
  top: number;
  left: number;
  rx: number;
  ry: number;
  color: string;
  angle: number;
  types: boolean;
  strokeDashArray: any[];
  type: string;
  isMLAi: boolean;
}

export interface SaveFreeHandDrawing {
  id: number;
  coordinateValue: any;
  color: string;
}
export class UpdateFreeHandDrawing {
  id: number;
  coordinateValue: any;
  color: string;
}
