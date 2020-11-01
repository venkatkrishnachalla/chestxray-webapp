import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-undo-redo-tool',
  templateUrl: './undo-redo-tool.component.html',
  styleUrls: ['./undo-redo-tool.component.scss'],
})

// UndoRedoToolComponent class implementation
export class UndoRedoToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  undoRedoPanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];

  /*
   * Constructor for UndoRedoToolComponent class
   */
  constructor() {}

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.undoRedoPanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelUndoRedo)
    );
  }

  /**
   * This is a iconAction click function.
   * @param '{any}' array- A any param
   * @param '{number}' index- A number param
   * @example
   * iconAction([ellipse], 1);
   */
  iconAction(data, index) {
    return null;
  }
}
