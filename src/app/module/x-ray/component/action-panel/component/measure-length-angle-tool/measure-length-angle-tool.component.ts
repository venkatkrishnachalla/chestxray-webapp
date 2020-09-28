import { Component, OnInit } from '@angular/core';
import { actionPanelConstants } from 'src/app/constants/actionPanelConstants';

@Component({
  selector: 'cxr-measure-length-angle-tool',
  templateUrl: './measure-length-angle-tool.component.html',
  styleUrls: ['./measure-length-angle-tool.component.scss'],
})

// MeasureLengthAngleToolComponent class implementation
export class MeasureLengthAngleToolComponent implements OnInit {
  readonly constants = actionPanelConstants;
  lengthAnglePanel: {
    image: string;
    alt: string;
    title: string;
    active: boolean;
    implemented: boolean;
  }[];

  /*
   * Constructor for MeasureLengthAngleToolComponent class
   */
  constructor() {}

  /**
   * This is a ngOnInit function
   * @param '{void}' empty- A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.lengthAnglePanel = JSON.parse(
      JSON.stringify(this.constants.actionPanelLengthAngle)
    );
  }

  /**
   * This is a iconAction function
   * @param '{any}' array- A any param
   * @param '{number}' index- A number param
   * @example
   * iconAction(data, index);
   */
  iconAction(data, index) {
    return null;
  }
}
