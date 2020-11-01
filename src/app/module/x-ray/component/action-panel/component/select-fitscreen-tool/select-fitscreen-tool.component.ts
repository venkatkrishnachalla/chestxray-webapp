import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-select-fitscreen-tool',
  templateUrl: './select-fitscreen-tool.component.html',
  styleUrls: ['./select-fitscreen-tool.component.scss'],
})

// SelectFitscreenToolComponent class implementation
export class SelectFitscreenToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  actionPanelSelectFitScreen: { image: string; alt: string; title: string }[];

  /*
   * Constructor for SelectFitscreenToolComponent class
   */
  constructor() {}

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.actionPanelSelectFitScreen = JSON.parse(
      JSON.stringify(this.constants.actionPanelSelectFitScreen)
    );
  }
}
