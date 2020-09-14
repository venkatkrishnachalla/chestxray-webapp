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

  /*** SaveEraseToolComponent class init function ***/
  ngOnInit(): void {
    this.saveErasePanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelSaveErase)
    );
  }

  /**
   * This is a iconAction click function.
   * iconAction([ellipse] , 1);
   */
  iconAction(data, index) {
    return null;
  }
}
