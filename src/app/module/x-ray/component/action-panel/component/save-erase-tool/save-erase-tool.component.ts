import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-save-erase-tool',
  templateUrl: './save-erase-tool.component.html',
  styleUrls: ['./save-erase-tool.component.scss'],
})

// SaveEraseToolComponent class implementation
export class SaveEraseToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  saveErasePanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];

  /*
   * Constructor for SaveEraseToolComponent class
   */
  constructor() {}

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.saveErasePanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelSaveErase)
    );
  }

  /**
   * This is a iconAction click function.
   * @param '{any}' array- A any param
   * @param '{number}' index- A number param
   * @example
   * iconAction(data, index);
   */

  iconAction(data, index) {
    return null;
  }
}
