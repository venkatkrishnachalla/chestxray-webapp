import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-arrow-text-tool',
  templateUrl: './arrow-text-tool.component.html',
  styleUrls: ['./arrow-text-tool.component.scss'],
})

// ArrowTextToolComponent class implementation
export class ArrowTextToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  arrowTextPanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];

  /*
   * Constructor for ArrowTextToolComponent class
   */
  constructor() {}

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.arrowTextPanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelArrowText)
    );
  }

  /**
   * This is a iconAction function.
   * @param '{any}' array - A any param
   * @param '{number}' value - A empty param
   * @example
   * iconAction(data, index);
   */
  iconAction(data, index) {
    return null;
  }
}
